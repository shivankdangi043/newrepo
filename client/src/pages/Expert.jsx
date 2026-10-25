import {useState} from 'react';import toast from 'react-hot-toast';import {Send} from 'lucide-react';import api from '../api';import {Glass,Head,Empty,useGet} from '../ui';
export default function Expert(){
 const [qs,load]=useGet('/queries'),[f,setF]=useState({question:'',crop:''});
 const send=async()=>{if(!f.question.trim())return toast.error('Write your question');await api.post('/queries',f);toast.success('Sent to our agronomists');setF({question:'',crop:''});load()};
 return <><Head t="Expert Desk" s="Ask an agronomist. Answers appear here."/><Glass hover={false} className="space-y-3"><input className="inp" placeholder="Crop (optional)" value={f.crop} onChange={e=>setF({...f,crop:e.target.value})}/>
  <textarea className="inp" rows="3" placeholder="Describe your problem…" value={f.question} onChange={e=>setF({...f,question:e.target.value})}/><button className="btn" onClick={send}><Send size={16}/>Ask expert</button></Glass>
  <div className="space-y-3 mt-6">{!qs.length&&<Empty e="💬" t="No questions yet."/>}{qs.map(q=><Glass key={q._id} hover={false}><div className="flex justify-between"><b>{q.crop||'General'}</b><span className={`text-xs px-2 py-1 rounded-full ${q.answer?'bg-olive text-white':'bg-lav2 text-olive2'}`}>{q.answer?'Answered':'Pending'}</span></div>
   <p className="my-1">{q.question}</p>{q.answer&&<p className="bg-dusty2 text-olive2 rounded-xl p-3 mt-2">👨‍🌾 {q.answer}</p>}</Glass>)}</div></>;
}
