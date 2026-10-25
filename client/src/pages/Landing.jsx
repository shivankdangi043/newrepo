import {Link} from 'react-router-dom';import {motion} from 'framer-motion';import {CloudSun,FlaskConical,Bug,ShoppingBasket,Sprout,MessageCircleQuestion,Wheat,ArrowRight} from 'lucide-react';import {Count,Glass} from '../ui';
const F=[[CloudSun,'Live Weather','Geolocation-based forecast with irrigation & spraying tips.'],[FlaskConical,'Soil Intelligence','Track moisture, NPK and pH with a health score and fertilizer advice.'],
[Bug,'Disease Detection','Pick symptoms, get diagnosis, severity, treatment and dosage.'],[Sprout,'Crop Lifecycle','Follow every crop from sowing to harvest with progress tracking.'],
[ShoppingBasket,'Agri Store','Order seeds, fertilizers and pesticides in a few taps.'],[MessageCircleQuestion,'Expert Desk','Ask agronomists and get answers inside the app.']];
export default function Landing({user}){return <div>
 <nav className="flex justify-between items-center px-6 md:px-16 py-5"><div className="flex items-center gap-2 font-display text-2xl font-semibold"><Wheat className="text-olive"/>Agri-Tech</div>
  <Link to={user?'/app':'/login'} className="btn">{user?'Open Dashboard':'Login / Register'}</Link></nav>
 <section className="px-6 md:px-16 pt-10 md:pt-20 pb-20 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
  <div><motion.span initial={{opacity:0}} animate={{opacity:1}} className="inline-block px-3 py-1 rounded-full bg-lav2 text-olive2 text-sm mb-4">🌿 Smart farming for every farmer</motion.span>
   <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.1}} className="font-display text-5xl md:text-7xl font-semibold leading-tight">Grow smarter with <span className="grad-text">data</span>, not guesswork.</motion.h1>
   <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.25}} className="mt-5 text-lg max-w-lg" style={{color:'var(--mut)'}}>Weather, soil health, crop tracking, disease help and a farm store, all in one calm and simple platform.</motion.p>
   <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.4}} className="mt-8 flex gap-3"><Link to="/login" className="btn">Get Started <ArrowRight size={18}/></Link><a href="#features" className="btn btn-soft">Explore</a></motion.div></div>
  <div className="relative h-96 hidden md:block">
   {[['🌾','Wheat · Growing',0,'top-4 left-4'],['💧','Soil moisture 52%',1,'top-40 right-0'],['☀️','28°C · Clear sky',2,'bottom-6 left-16']].map(([e,t,i,p])=>
    <motion.div key={t} animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:4+i,delay:i}} className={`glass absolute px-5 py-4 flex items-center gap-3 ${p}`}><span className="text-3xl">{e}</span><b>{t}</b></motion.div>)}
   <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:40,ease:'linear'}} className="absolute inset-10 rounded-full border-2 border-dashed border-lav"/></div></section>
 <section id="features" className="px-6 md:px-16 py-16 max-w-7xl mx-auto"><h2 className="font-display text-4xl text-center mb-10">Everything a farm needs</h2>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{F.map(([I,t,d],i)=><motion.div key={t} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}>
   <Glass className="h-full"><div className="size-12 rounded-2xl bg-lav grid place-items-center mb-3 text-olive2"><I/></div><h3 className="font-display text-xl mb-1">{t}</h3><p style={{color:'var(--mut)'}}>{d}</p></Glass></motion.div>)}</div></section>
 <section className="px-6 md:px-16 py-10 max-w-5xl mx-auto grid grid-cols-3 gap-4 text-center">{[[30,'% less crop loss','+'],[5,'min setup',''],[24,'/7 access','']].map(([n,l,p])=>
  <Glass key={l}><p className="font-display text-4xl text-olive"><Count to={n} pre={p}/></p><p style={{color:'var(--mut)'}}>{l}</p></Glass>)}</section>
 <footer className="text-center py-10" style={{color:'var(--mut)'}}>Built with the MERN stack · © Agri-Tech</footer></div>}
