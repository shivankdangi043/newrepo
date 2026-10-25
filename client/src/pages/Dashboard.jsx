import {useState,useEffect} from 'react';import toast from 'react-hot-toast';import {motion} from 'framer-motion';
import {Sun,CloudSun,CloudFog,CloudRain,Snowflake,CloudLightning,Sprout,ShoppingBasket,IndianRupee,MessageCircleQuestion,AlertTriangle,Save} from 'lucide-react';
import {AreaChart,Area,XAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell} from 'recharts';import api from '../api';import {Glass,Stat,Head,Skel,useGet,COLORS} from '../ui';
const wx=c=>c===0?[Sun,'Clear sky']:c<4?[CloudSun,'Partly cloudy']:c<50?[CloudFog,'Foggy']:c<70||(c>79&&c<83)?[CloudRain,'Rainy']:c<80?[Snowflake,'Snow']:[CloudLightning,'Thunderstorm'];
export default function Dashboard({user}){
 const [st,,l]=useGet('/stats',null),[w,setW]=useState(null),[farm,setFarm]=useState({});
 useEffect(()=>{api.get('/farm').then(r=>setFarm(r.data));
  navigator.geolocation?.getCurrentPosition(p=>api.get('/weather',{params:{lat:p.coords.latitude,lon:p.coords.longitude}}).then(r=>setW(r.data)),()=>toast('Allow location for live weather',{icon:'📍'}))},[]);
 const set=k=>e=>setFarm({...farm,[k]:e.target.value});const [Ic,desc]=w?wx(w.current.weather_code):[Sun,''];
 const alerts=[...(w?[w.tip]:[]),...(st?.advice||[])];
 return <><Head t={`Namaste, ${user.name.split(' ')[0]} 👋`} s="Here is how your farm is doing today."/>
  {l?<Skel n={4}/>:<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
   <Stat icon={Sprout} label="Crops" value={st.crops}/><Stat icon={ShoppingBasket} label="Orders" value={st.orders} c="bg-dusty2"/>
   <Stat icon={IndianRupee} label="Spent" value={st.spent} c="bg-beige2"/><Stat icon={MessageCircleQuestion} label="Open queries" value={st.open}/></div>}
  <div className="grid lg:grid-cols-3 gap-4 mt-4">
   <Glass className="lg:col-span-2 text-white border-0" style={{background:'linear-gradient(135deg,#7c9cbf,#b9a9e0)'}} hover={false}>
    {w?<><div className="flex items-center justify-between"><div><p className="opacity-80">Your location · now</p><p className="font-display text-6xl">{Math.round(w.current.temperature_2m)}°C</p><p>{desc} · 💧{w.current.relative_humidity_2m}% · 💨{w.current.wind_speed_10m} km/h</p></div>
     <motion.div animate={{rotate:Ic===Sun?360:0,y:Ic===Sun?0:[0,-8,0]}} transition={{repeat:Infinity,duration:Ic===Sun?20:3,ease:'linear'}}><Ic size={90}/></motion.div></div>
     <div className="grid grid-cols-5 gap-2 mt-5">{w.daily.time.map((d,i)=><div key={d} className="bg-white/20 rounded-xl p-2 text-center text-sm"><p>{new Date(d).toLocaleDateString('en',{weekday:'short'})}</p><p className="font-semibold">{Math.round(w.daily.temperature_2m_max[i])}°</p><p className="text-xs">{w.daily.precipitation_sum[i]}mm</p></div>)}</div></>:<div className="h-44 grid place-items-center">Fetching live weather…</div>}</Glass>
   <Glass hover={false}><h3 className="font-display text-lg mb-2 flex gap-2 items-center"><AlertTriangle size={18} className="text-olive"/>Smart alerts</h3>
    <div className="space-y-2 text-sm">{alerts.length?alerts.map((a,i)=><motion.p key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*.1}} className="p-2 rounded-lg bg-lav2/70 text-olive2">{a}</motion.p>):<p style={{color:'var(--mut)'}}>No alerts. Add a soil record to get advice.</p>}</div></Glass></div>
  <div className="grid lg:grid-cols-3 gap-4 mt-4">
   <Glass className="lg:col-span-2" hover={false}><h3 className="font-display text-lg mb-2">Soil moisture trend</h3>
    {st?.soil?.length?<ResponsiveContainer height={200}><AreaChart data={st.soil}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c9cbf" stopOpacity={.6}/><stop offset="100%" stopColor="#7c9cbf" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="d" stroke="#888" fontSize={12}/><Tooltip/><Area dataKey="moisture" stroke="#5b6b3a" fill="url(#g)" strokeWidth={2}/></AreaChart></ResponsiveContainer>:<p className="py-10 text-center" style={{color:'var(--mut)'}}>No soil records yet.</p>}</Glass>
   <Glass hover={false}><h3 className="font-display text-lg mb-2">Crop stages</h3>{st?.crops?<ResponsiveContainer height={200}><PieChart><Pie data={st.stages} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={4}>{st.stages.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>:<p className="py-10 text-center" style={{color:'var(--mut)'}}>Add crops to see stages.</p>}</Glass></div>
  <Glass className="mt-4" hover={false}><h3 className="font-display text-lg mb-3">Farm profile</h3><div className="grid sm:grid-cols-4 gap-3">
   <input className="inp" placeholder="Farm name" value={farm.name||''} onChange={set('name')}/><input className="inp" placeholder="Location" value={farm.location||''} onChange={set('location')}/>
   <input className="inp" type="number" placeholder="Size (acres)" value={farm.size||''} onChange={set('size')}/><button className="btn justify-center" onClick={()=>api.put('/farm',farm).then(()=>toast.success('Farm profile saved'))}><Save size={16}/>Save</button></div></Glass></>;
}
