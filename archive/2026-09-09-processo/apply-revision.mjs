import fs from 'node:fs/promises';
const p=new URL('./mascot.mjs',import.meta.url);
let s=await fs.readFile(p,'utf8');
s=s.slice(0,s.indexOf('export function profile'))+"export { naturalFront as front, naturalProfile as profile, sleeping as resting } from './natural-poses.mjs';\n\n"+s.slice(s.indexOf('export function symbol'));
s=s.slice(0,s.indexOf('function auxiliary'))+"export { naturalPose as pose } from './natural-poses.mjs';\n\n"+s.slice(s.indexOf('export function svg'));
// Color icons use black eyes. The explicit one-ink symbol retains its chosen ink.
s=s.replace('fill="${palette.purple}"/><ellipse cx="774"','fill="${style===\'mono\'?palette.purple:palette.black}"/><ellipse cx="774"');
s=s.replace('fill="${palette.purple}"/><ellipse cx="701"','fill="${style===\'mono\'?palette.purple:palette.black}"/><ellipse cx="701"');
await fs.writeFile(p,s);
