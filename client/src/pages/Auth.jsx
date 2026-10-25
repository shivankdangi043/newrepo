import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import toast from 'react-hot-toast';import {motion} from 'framer-motion';import {Wheat} from 'lucide-react';import api from '../api';
export default function Auth({onLogin}){
 const nav=useNavigate(),[reg,setReg]=useState(false),[f,setF]=useState({}),[b,setB]=useState(false);const set=k=>e=>setF({...f,[k]:e.target.value});
 const go=async e=>{e.preventDefault();setB(true);try{const r=await api.post('/auth/'+(reg?'register':'login'),f);
  localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));onLogin(r.data.user);toast.success('Welcome, '+r.data.user.name+'!');nav('/app')}
  catch(x){toast.error(x.response?.data?.msg||'Something went wrong')}setB(false)};
 return <div className="min-h-screen grid place-items-center p-4"><motion.div initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} className="glass w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
  <div className="hidden md:flex flex-col justify-between p-10 text-white" style={{background:'linear-gradient(150deg,#3f4a28,#5b6b3a 50%,#7c9cbf)'}}>
   <Link to="/" className="flex items-center gap-2 font-display text-2xl"><Wheat/>Agri-Tech</Link><div><p className="font-display text-3xl leading-snug">“The best fertilizer is the farmer’s shadow, guided by data.”</p></div>
   <motion.div animate={{y:[0,-10,0]}} transition={{repeat:Infinity,duration:4}} className="text-6xl">🌱</motion.div></div>
  <form onSubmit={go} className="p-8 md:p-10 flex flex-col gap-3"><h2 className="font-display text-3xl">{reg?'Create account':'Welcome back'}</h2>
   <p style={{color:'var(--mut)'}}>{reg?'Join as a farmer':'Login to your farm dashboard'}</p>
   {reg&&<input className="inp" placeholder="Full name" required onChange={set('name')}/>}<input className="inp" type="email" placeholder="Email" required onChange={set('email')}/>
   <input className="inp" type="password" placeholder="Password" required minLength={6} onChange={set('password')}/>
   <button className="btn justify-center mt-2" disabled={b}>{b?'Please wait…':reg?'Register':'Login'}</button>
   <button type="button" className="text-sm underline" onClick={()=>setReg(!reg)}>{reg?'Already registered? Login':'New farmer? Register'}</button></form></motion.div></div>}
