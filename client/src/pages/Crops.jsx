import {useState} from 'react';import toast from 'react-hot-toast';import {motion,AnimatePresence} from 'framer-motion';import {Plus,Trash2} from 'lucide-react';import api from '../api';import {Glass,Head,Modal,Empty,Skel,useGet} from '../ui';
const em=n=>/wheat|rice|paddy|barley/i.test(n)?'🌾':/corn|maize/i.test(n)?'🌽':/tomato/i.test(n)?'🍅':/potato/i.test(n)?'🥔':/cotton/i.test(n)?'☁️':/sugar/i.test(n)?'🎋':/chilli|pepper/i.test(n)?'🌶️':'🌱';
const pct=c=>{const a=+new Date(c.plantedOn),b=+new Date(c.harvestOn);if(c.stage==='harvested')return 100;if(!a||!b||b<=a)return 0;return Math.max(0,Math.min(100,Math.round((Date.now()-a)/(b-a)*100)))};
export default function Crops(){
 const [cs,load,l]=useGet('/crops'),[open,setOpen]=useState(false),[f,setF]=useState({}),[fl,setFl]=useState('all');const set=k=>e=>setF({...f,[k]:e.target.value});
 const add=async()=>{if(!f.name)return toast.error('Enter crop name');await api.post('/crops',f);toast.success('Crop added 🌱');setOpen(false);setF({});load()};
 const list=cs.filter(c=>fl==='all'||c.stage===fl);
 return <><Head t="My Crops" s="Planting to harvest, at a glance."><button className="btn" onClick={()=>setOpen(true)}><Plus size={18}/>Add crop</button></Head>
  <div className="flex gap-2 mb-4">{['all','planted','growing','harvested'].map(s=><button key={s} className={'chip capitalize '+(fl===s?'on':'')} onClick={()=>setFl(s)}>{s}</button>)}</div>
  {l?<Skel/>:!list.length?<Empty t="No crops here yet. Add your first crop!"/>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><AnimatePresence>{list.map(c=><motion.div key={c._id} layout exit={{opacity:0,scale:.8}}><Glass>
   <div className="flex justify-between"><span className="text-4xl">{em(c.name)}</span><button onClick={()=>api.delete('/crops/'+c._id).then(()=>{toast('Crop removed');load()})} className="opacity-50 hover:opacity-100 hover:text-red-500"><Trash2 size={18}/></button></div>
   <h3 className="font-display text-xl mt-2">{c.name}</h3><p className="text-sm" style={{color:'var(--mut)'}}>{c.plantedOn?.slice(0,10)} → {c.harvestOn?.slice(0,10)}</p>
   <div className="h-2 rounded-full bg-lav2 mt-3 overflow-hidden"><motion.div className="h-full bg-olive" initial={{width:0}} animate={{width:pct(c)+'%'}} transition={{duration:1}}/></div><p className="text-xs mt-1">{pct(c)}% of season</p>
   <div className="flex gap-1 mt-3">{['planted','growing','harvested'].map(s=><button key={s} onClick={()=>api.patch('/crops/'+c._id,{stage:s}).then(()=>{toast.success('Marked '+s);load()})} className={'chip capitalize flex-1 text-center '+(c.stage===s?'on':'')}>{s}</button>)}</div></Glass></motion.div>)}</AnimatePresence></div>}
  <Modal open={open} onClose={()=>setOpen(false)} title="Add a crop"><div className="space-y-3"><input className="inp" placeholder="Crop name (e.g. Wheat)" onChange={set('name')}/>
   <label className="text-sm">Planting date<input type="date" className="inp mt-1" onChange={set('plantedOn')}/></label><label className="text-sm">Expected harvest<input type="date" className="inp mt-1" onChange={set('harvestOn')}/></label>
   <button className="btn w-full justify-center" onClick={add}>Save crop</button></div></Modal></>;
}
