import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const sharp = createRequire(import.meta.url)('sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalRoot = path.join(root, 'output', 'identidade-raposa');
const variantsRoot = path.join(originalRoot, '08-variantes');
const failures = [];
const assetChecks = [];
const originalChecks = [];
const sourceRenders = new Map();
const expectedNames = [
  'full-character', 'head-mark', 'brand-symbol', 'full-character-solid',
  'cauda', 'avatar', 'app-icon',
  ...['neutro', 'curioso', 'feliz', 'pensando', 'alerta', 'satisfeito', 'frustracao', 'comemorando'].map(name => `expressoes/${name}`),
  ...[16, 24, 32, 48, 64, 128, 256].map(size => `icones/simbolo-${size}`),
];

// Preserve every byte except a hex color token and the text of a title.
const colorPattern = /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\da-z_-])/gi;
const normalize = xml => xml
  .replace(colorPattern, '#COLOR')
  .replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/g, '$1TITLE$2');
const colors = xml => [...xml.matchAll(colorPattern)].map(match => match[0].toUpperCase());
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

function rgb(hex) {
  let value = hex.slice(1);
  if (value.length === 3 || value.length === 4) value = [...value].map(ch => ch + ch).join('');
  return [0, 2, 4].map(offset => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function within(base, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath || path.isAbsolute(relativePath)) {
    throw new Error(`Expected a relative path: ${String(relativePath)}`);
  }
  const absolutePath = path.resolve(base, relativePath);
  const relative = path.relative(base, absolutePath);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Path leaves the expected directory: ${relativePath}`);
  }
  return absolutePath;
}

async function renderSource(sourcePath, width, height) {
  const key = `${sourcePath}|${width}|${height}`;
  if (!sourceRenders.has(key)) {
    sourceRenders.set(key, sharp(sourcePath)
      .resize({width})
      .toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject: true}));
  }
  return sourceRenders.get(key);
}

let manifest;
let baseline;
try {
  manifest = JSON.parse(await fs.readFile(path.join(variantsRoot, 'manifest.json'), 'utf8'));
  baseline = JSON.parse(await fs.readFile(path.join(variantsRoot, 'originais.sha256.json'), 'utf8'));
} catch (error) {
  failures.push(`Cannot read verification inputs: ${error.message}`);
}

if (baseline) {
  if (Array.isArray(baseline) || typeof baseline !== 'object' || !Object.keys(baseline).length) {
    failures.push('Original hash baseline must be a nonempty object.');
  } else {
    for (const [relativePath, expectedHash] of Object.entries(baseline)) {
      try {
        if (typeof expectedHash !== 'string' || !/^[\da-f]{64}$/i.test(expectedHash)) throw new Error('Invalid SHA-256');
        const currentHash = hash(await fs.readFile(within(originalRoot, relativePath)));
        const unchanged = currentHash === expectedHash.toLowerCase();
        originalChecks.push({path: relativePath, unchanged, sha256: currentHash});
        if (!unchanged) failures.push(`Original changed: ${relativePath}`);
      } catch (error) {
        failures.push(`Original ${relativePath}: ${error.message}`);
      }
    }
  }
}

const variants = manifest?.variants;
if (!Array.isArray(variants)) {
  failures.push('Manifest must contain a variants array.');
} else {
  const ids = variants.map(variant => variant.id);
  if (variants.length !== 2 || !ids.includes('branca') || !ids.includes('preta')) {
    failures.push('Manifest must contain exactly the branca and preta variants.');
  }
  for (const variant of variants) {
    if (!Array.isArray(variant.assets)) {
      failures.push(`${variant.id}: assets must be an array.`);
      continue;
    }
    const names = variant.assets.map(asset => asset.name);
    if (names.length !== expectedNames.length || new Set(names).size !== names.length || expectedNames.some(name => !names.includes(name))) {
      failures.push(`${variant.id}: expected exactly the 22 agreed assets.`);
    }
    for (const asset of variant.assets) {
      const label = `${variant.id}/${asset.name}`;
      try {
        if (!Number.isInteger(asset.width) || !Number.isInteger(asset.height) || asset.width < 1 || asset.height < 1) {
          throw new Error('Invalid declared dimensions');
        }
        const sourcePath = within(originalRoot, asset.source);
        const svgPath = within(variantsRoot, asset.svg);
        const pngPath = within(variantsRoot, asset.png);
        if (!asset.source.endsWith('.svg') || !asset.svg.endsWith('.svg') || !asset.png.endsWith('.png')) {
          throw new Error('Unexpected asset extensions');
        }
        const sourceBaselineKey = path.relative(originalRoot, sourcePath).split(path.sep).join('/');
        const coveredByBaseline = baseline && Object.keys(baseline).some(key => key.replaceAll('\\', '/') === sourceBaselineKey);
        if (!coveredByBaseline) failures.push(`${label}: source SVG missing from original hash baseline.`);

        const [sourceXml, variantXml, metadata] = await Promise.all([
          fs.readFile(sourcePath, 'utf8'), fs.readFile(svgPath, 'utf8'), sharp(pngPath).metadata(),
        ]);
        const exactConstruction = normalize(sourceXml) === normalize(variantXml);
        if (!exactConstruction) failures.push(`${label}: XML differs beyond hex colors and title text.`);

        const sourceColors = colors(sourceXml);
        const variantColors = colors(variantXml);
        const nonGrayscale = [...new Set(variantColors.filter(color => {
          const [red, green, blue] = rgb(color);
          return red !== green || green !== blue;
        }))];
        if (nonGrayscale.length) failures.push(`${label}: non-grayscale SVG colors: ${nonGrayscale.join(', ')}`);
        // Black eyes and their existing white highlights must survive recoloring.
        const protectedColorsPreserved = sourceColors.every((color, index) => {
          const [red, green, blue] = rgb(color);
          if (!((red === 0 && green === 0 && blue === 0) || (red === 255 && green === 255 && blue === 255))) return true;
          return variantColors[index] && rgb(variantColors[index]).every((channel, channelIndex) => channel === [red, green, blue][channelIndex]);
        });
        if (!protectedColorsPreserved) failures.push(`${label}: original pure-black eyes or white highlights were recolored.`);

        const correctDimensions = metadata.width === asset.width && metadata.height === asset.height;
        if (metadata.format !== 'png' || !correctDimensions) failures.push(`${label}: PNG format or dimensions do not match the manifest.`);
        if (!metadata.hasAlpha) failures.push(`${label}: PNG has no alpha channel.`);
        const [{data, info}, sourceRender] = await Promise.all([
          sharp(pngPath).toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject: true}),
          renderSource(sourcePath, asset.width, asset.height),
        ]);
        let transparentPixels = 0;
        let visiblePixels = 0;
        let nonGrayscalePixels = 0;
        let alphaDifferences = 0;
        const sameDimensions = info.width === sourceRender.info.width && info.height === sourceRender.info.height;
        for (let offset = 0; offset < data.length; offset += 4) {
          const alpha = data[offset + 3];
          if (alpha === 0) transparentPixels++;
          else {
            visiblePixels++;
            if (data[offset] !== data[offset + 1] || data[offset + 1] !== data[offset + 2]) nonGrayscalePixels++;
          }
          if (!sameDimensions || alpha !== sourceRender.data[offset + 3]) alphaDifferences++;
        }
        const alphaIdentical = sameDimensions && alphaDifferences === 0;
        if (!alphaIdentical) failures.push(`${label}: PNG alpha differs from source rendered at the same dimensions (${alphaDifferences} pixels).`);
        if (nonGrayscalePixels) failures.push(`${label}: PNG has ${nonGrayscalePixels} visible non-grayscale pixels.`);
        if (!visiblePixels) failures.push(`${label}: empty PNG.`);
        const cornerOffsets = [0, info.width - 1, (info.height - 1) * info.width, info.height * info.width - 1];
        const transparentCorners = cornerOffsets.every(pixel => data[pixel * 4 + 3] === 0);
        if (!['avatar', 'app-icon'].includes(asset.name) && (!transparentPixels || !transparentCorners)) {
          failures.push(`${label}: the transparent asset has an opaque background or corners.`);
        }
        if (asset.name === 'app-icon' && !transparentCorners) failures.push(`${label}: app-icon rounded corners are not transparent.`);
        assetChecks.push({
          variant: variant.id, name: asset.name, source: asset.source,
          width: info.width, height: info.height, exactConstruction, protectedColorsPreserved,
          alphaIdentical, alphaDifferences, transparentPixels, transparentCorners,
          nonGrayscaleColors: nonGrayscale, nonGrayscalePixels,
        });
      } catch (error) {
        failures.push(`${label}: ${error.message}`);
      }
    }
  }
}

const result = {
  verifiedAt: new Date().toISOString(),
  comparison: 'Exact SVG bytes after normalizing only hex color tokens and title contents; exact PNG alpha against source rendered at the declared resolution.',
  variantCount: Array.isArray(variants) ? variants.length : 0,
  assetCount: assetChecks.length,
  allOriginalsUnchanged: originalChecks.length > 0 && originalChecks.every(check => check.unchanged) && originalChecks.length === Object.keys(baseline || {}).length,
  originalChecks, assetChecks, failures,
  passed: failures.length === 0,
};
await fs.mkdir(variantsRoot, {recursive: true});
await fs.writeFile(path.join(variantsRoot, 'verificacao.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({assets: result.assetCount, originals: originalChecks.length, passed: result.passed, failures}));
if (failures.length) process.exitCode = 1;
