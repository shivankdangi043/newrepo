import {useState} from 'react';import {motion} from 'framer-motion';import {ScanSearch,ImagePlus} from 'lucide-react';import api from '../api';import {Glass,Head} from '../ui';
const SYM=['Yellow leaves','Brown spots','Wilting','White powder','Holes in leaves','Curling leaves','Stunted growth'];const sev={High:'bg-red-200 text-red-900',Medium:'bg-amber-200 text-amber-900',Low:'bg-green-200 text-green-900'};
export default function Disease(){
 const [sel,setSel]=useState([]),[txt,setTxt]=useState(''),[img,setImg]=useState(null),[res,setRes]=useState(null),[busy,setBusy]=useState(false);
 const run=async()=>{setBusy(true);setRes(null);const [r]=await Promise.all([api.post('/disease',{symptoms:sel.join(' ')+' '+txt}),new Promise(x=>setTimeout(x,1400))]);setRes(r.data);setBusy(false)};
 return <><Head t="Disease Detection" s="Select what you see on the plant. Add a photo for your own reference."/>
  <div className="grid lg:grid-cols-2 gap-4"><Glass hover={false} className="space-y-4">
   <div className="flex flex-wrap gap-2">{SYM.map(s=><button key={s} className={'chip '+(sel.includes(s)?'on':'')} onClick={()=>setSel(sel.includes(s)?sel.filter(x=>x!==s):[...sel,s])}>{s}</button>)}</div>
   <textarea className="inp" rows="3" placeholder="Anything else? Describe in your own words…" onChange={e=>setTxt(e.target.value)}/>
   <label className={'block rounded-2xl border-2 border-dashed border-lav p-4 text-center cursor-pointer overflow-hidden '+(busy?'scan':'')}>{img?<img src={img} className="max-h-48 mx-auto rounded-xl"/>:<div style={{color:'var(--mut)'}}><ImagePlus className="mx-auto mb-1"/>Upload leaf photo</div>}
    <input type="file" accept="image/*" hidden onChange={e=>e.target.files[0]&&setImg(URL.createObjectURL(e.target.files[0]))}/></label>
   <button className="btn" disabled={busy||(!sel.length&&!txt)} onClick={run}><ScanSearch size={18}/>{busy?'Analyzing…':'Diagnose'}</button></Glass>
   <div className="space-y-3">{res?.map((r,i)=><motion.div key={r.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.15}}><Glass hover={false}>
    <div className="flex justify-between items-start gap-2"><h3 className="font-display text-lg">{r.name}</h3><span className={`text-xs px-2 py-1 rounded-full ${sev[r.severity]}`}>{r.severity}</span></div>
    <div className="h-2 rounded-full bg-lav2 my-2"><motion.div className="h-full rounded-full bg-olive" initial={{width:0}} animate={{width:r.confidence+'%'}} transition={{duration:.8}}/></div><p className="text-xs mb-2">Match confidence {r.confidence}%</p>
    <p><b>Treatment:</b> {r.treatment}</p><p><b>Fertilizer:</b> {r.fertilizer}</p></Glass></motion.div>)}{!res&&!busy&&<Glass hover={false} className="text-center py-16" style={{color:'var(--mut)'}}>🔍 Results will appear here</Glass>}</div></div></>;
}
