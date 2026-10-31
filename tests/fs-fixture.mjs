import {lstatSync,mkdirSync,readdirSync,copyFileSync,readlinkSync,symlinkSync,unlinkSync,rmdirSync} from 'node:fs';
import {join,resolve,sep} from 'node:path';
// Explicit traversal avoids the recursive fs.cpSync UTF-8 destination issue observed
// on Windows/Node 24.10 with non-ASCII fixture directories. Not product code.
export function copyFixture(source,target){
 const stat=lstatSync(source);
 if(stat.isSymbolicLink()){symlinkSync(readlinkSync(source),target);return;}
 if(stat.isDirectory()){mkdirSync(target,{recursive:true});for(const entry of readdirSync(source))copyFixture(join(source,entry),join(target,entry));}
 else copyFileSync(source,target);
}
export function removeFixture(target,workspace){
 if(!resolve(target).startsWith(resolve(workspace)+sep))throw Error('Fixture cleanup escaped workspace');
 const stat=lstatSync(target);
 if(stat.isDirectory()&&!stat.isSymbolicLink()){for(const entry of readdirSync(target))removeFixture(join(target,entry),workspace);rmdirSync(target);}
 else unlinkSync(target);
}
