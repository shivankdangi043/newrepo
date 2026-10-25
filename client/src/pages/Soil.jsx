import {useState} from 'react';import toast from 'react-hot-toast';import {motion} from 'framer-motion';import {RadarChart,Radar,PolarGrid,PolarAngleAxis,ResponsiveContainer} from 'recharts';
import api from '../api';import {Glass,Head,useGet,Empty} from '../ui';
const FIELDS=[['moisture','Moisture %',0,100,1],['nitrogen','Nitrogen (kg/acre)',0,120,1],['phosphorus','Phosphorus (kg/acre)',0,120,1],['potassium','Potassium (kg/acre)',0,120,1],['ph','pH',3,10,.1]];
const score=s=>Math.max(0,Math.min(100,Math.round(100-(Math.abs(s.moisture-50)*.6+Math.max(0,60-s.nitrogen)*.5+Math.max(0,60-s.phosphorus)*.4+Math.max(0,60-s.potassium)*.4+Math.abs(s.ph-6.8)*8))));
const Ring=({v})=>{const r=54,c=2*Math.PI*r;return <svg viewBox="0 0 140 140" className="w-40 mx-auto"><circle cx="70" cy="70" r={r} fill="none" stroke="var(--bd)" strokeWidth="12"/>
 <motion.circle cx="70" cy="70" r={r} fill="none" stroke="#5b6b3a" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} animate={{strokeDashoffset:c*(1-v/100)}} initial={{strokeDashoffset:c}} transition={{duration:1}} transform="rotate(-90 70 70)"/>
 <text x="70" y="78" textAnchor="middle" fontSize="30" fill="currentColor" fontFamily="Fraunces">{v}</text></svg>};
export default function Soil(){
 const [s,setS]=useState({moisture:45,nitrogen:50,phosphorus:40,potassium:40,ph:6.5}),[rows,load]=useGet('/soil');const v=score(s);
 const save=async()=>{await api.post('/soil',s);toast.success('Soil record saved');load()};
 return <><Head t="Soil Monitoring" s="Move the sliders with your soil-test values to see health live."/>
  <div className="grid lg:grid-cols-3 gap-4"><Glass className="lg:col-span-2 space-y-4" hover={false}>{FIELDS.map(([k,l,a,b,st])=><label key={k} className="block"><div className="flex justify-between text-sm"><span>{l}</span><b>{s[k]}</b></div><input type="range" min={a} max={b} step={st} value={s[k]} onChange={e=>setS({...s,[k]:+e.target.value})}/></label>)}
   <button className="btn" onClick={save}>Analyze &amp; save</button></Glass>
   <Glass hover={false} className="text-center"><h3 className="font-display text-lg">Soil health score</h3><Ring v={v}/><p className="mt-1 font-medium">{v>75?'Excellent 🌟':v>50?'Fair 👍':'Needs care ⚠️'}</p>
    <ResponsiveContainer height={160}><RadarChart data={[{n:'N',v:s.nitrogen},{n:'P',v:s.phosphorus},{n:'K',v:s.potassium},{n:'Water',v:s.moisture}]}><PolarGrid/><PolarAngleAxis dataKey="n" fontSize={12}/><Radar dataKey="v" stroke="#5b6b3a" fill="#b9a9e0" fillOpacity={.6}/></RadarChart></ResponsiveContainer></Glass></div>
  <h2 className="font-display text-xl mt-8 mb-3">History &amp; advice</h2>{!rows.length?<Empty e="🧪" t="No records yet."/>:<div className="grid md:grid-cols-2 gap-4">{rows.map(r=><Glass key={r._id}>
   <p className="text-xs" style={{color:'var(--mut)'}}>{new Date(r.createdAt).toLocaleString()}</p><p className="text-sm my-1">Moisture {r.moisture}% · N {r.nitrogen} · P {r.phosphorus} · K {r.potassium} · pH {r.ph}</p>
   <ul className="space-y-1">{r.advice.map(a=><li key={a} className="text-sm bg-lav2/70 text-olive2 rounded-lg px-2 py-1">{a}</li>)}</ul></Glass>)}</div>}</>;
}
