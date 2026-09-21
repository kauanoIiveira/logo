import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pose, poses, svg} from './mascot.mjs';
const sharp=createRequire(import.meta.url)('sharp'),frames={};
for(const[k]of poses){
 const {data,info}=await sharp(Buffer.from(svg(pose(k),{viewBox:'-300 -100 1700 1300',width:1700,height:1300}))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let minX=info.width,minY=info.height,maxX=0,maxY=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>32){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
 const pad=60;frames[k]=`${minX-300-pad} ${minY-100-pad} ${maxX-minX+pad*2} ${maxY-minY+pad*2}`;
}
const u=new URL('./natural-poses.mjs',import.meta.url);let s=await fs.readFile(u,'utf8');
s=s.replace(/export const poseViewBoxes=\{[\s\S]*?\n\};/,'export const poseViewBoxes='+JSON.stringify(frames,null,2)+';');
await fs.writeFile(u,s);console.log(frames);
