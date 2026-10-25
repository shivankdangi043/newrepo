import {useState,useEffect} from 'react';import {BrowserRouter,Routes,Route,NavLink,Navigate,useLocation} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';import {motion,AnimatePresence} from 'framer-motion';
import {LayoutDashboard,Sprout,FlaskConical,Bug,ShoppingBasket,MessageCircleQuestion,ShieldCheck,Sun,Moon,LogOut,Wheat} from 'lucide-react';
import Landing from './pages/Landing';import Auth from './pages/Auth';import Dashboard from './pages/Dashboard';import Crops from './pages/Crops';
import Soil from './pages/Soil';import Disease from './pages/Disease';import Shop from './pages/Shop';import Expert from './pages/Expert';import Admin from './pages/Admin';

const Blobs=()=><><div className="blob bg-lav size-96 -top-24 -left-24"/><div className="blob bg-dusty size-96 top-1/3 -right-32" style={{animationDelay:'-5s'}}/><div className="blob bg-beige2 size-80 bottom-0 left-1/4" style={{animationDelay:'-9s'}}/></>;
export const useTheme=()=>{const [d,setD]=useState(localStorage.getItem('theme')==='dark');
 useEffect(()=>{document.documentElement.classList.toggle('dark',d);localStorage.setItem('theme',d?'dark':'light')},[d]);return [d,setD]};

function Shell({user,logout}){
 const loc=useLocation(),[dark,setDark]=useTheme();const admin=user.role==='admin';
 const nav=admin?[['admin','Admin',ShieldCheck]]:[['','Dashboard',LayoutDashboard],['crops','Crops',Sprout],['soil','Soil',FlaskConical],['disease','Disease',Bug],['shop','Shop',ShoppingBasket],['expert','Expert',MessageCircleQuestion]];
 const link=({isActive})=>`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${isActive?'bg-olive text-white shadow-lg':'hover:bg-lav2/60'}`;
 return <div className="min-h-screen md:flex">
  <aside className="hidden md:flex flex-col w-64 p-4 sticky top-0 h-screen"><div className="glass flex-1 p-4 flex flex-col gap-1">
   <div className="flex items-center gap-2 font-display text-xl font-semibold mb-6 px-2"><Wheat className="text-olive"/>Agri-Tech</div>
   {nav.map(([to,l,I])=><NavLink key={l} end={to===''} to={'/app/'+to} className={link}><I size={18}/>{l}</NavLink>)}
   <div className="mt-auto flex gap-2"><button className="btn btn-soft flex-1 justify-center" onClick={()=>setDark(!dark)}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button><button className="btn btn-soft flex-1 justify-center" onClick={logout}><LogOut size={16}/></button></div></div></aside>
  <div className="flex-1 min-w-0"><header className="flex justify-between items-center p-4 md:px-8">
   <div className="md:hidden flex items-center gap-2 font-display text-lg"><Wheat className="text-olive"/>Agri-Tech</div>
   <div className="ml-auto flex items-center gap-3"><span className="text-sm">Hi, <b>{user.name}</b></span>
    <span className={`text-xs px-2 py-1 rounded-full ${user.verified?'bg-olive text-white':'bg-lav2 text-olive2'}`}>{user.verified?'✔ Verified':'Pending'}</span>
    <button className="md:hidden" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div></header>
   <main className="px-4 md:px-8 pb-28 md:pb-10 max-w-6xl"><AnimatePresence mode="wait"><motion.div key={loc.pathname} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:.3}}>
    <Routes location={loc}>{admin?<><Route path="admin" element={<Admin/>}/><Route path="*" element={<Navigate to="/app/admin"/>}/></>:
     <><Route index element={<Dashboard user={user}/>}/><Route path="crops" element={<Crops/>}/><Route path="soil" element={<Soil/>}/><Route path="disease" element={<Disease/>}/><Route path="shop" element={<Shop/>}/><Route path="expert" element={<Expert/>}/><Route path="*" element={<Navigate to="/app"/>}/></>}</Routes></motion.div></AnimatePresence></main></div>
  <nav className="md:hidden fixed bottom-3 inset-x-3 glass flex justify-around p-2 z-40">{nav.map(([to,l,I])=><NavLink key={l} end={to===''} to={'/app/'+to} className={({isActive})=>`p-2.5 rounded-xl ${isActive?'bg-olive text-white':''}`}><I size={20}/></NavLink>)}<button className="p-2.5" onClick={logout}><LogOut size={20}/></button></nav></div>;
}
export default function App(){
 const [user,setUser]=useState(JSON.parse(localStorage.getItem('user')||'null'));useTheme();
 const logout=()=>{localStorage.clear();setUser(null)};
 return <BrowserRouter><Toaster position="top-right" toastOptions={{style:{background:'var(--bg)',color:'var(--fg)',border:'1px solid var(--bd)'}}}/><Blobs/><Routes>
  <Route path="/" element={<Landing user={user}/>}/><Route path="/login" element={user?<Navigate to="/app"/>:<Auth onLogin={setUser}/>}/>
  <Route path="/app/*" element={user?<Shell user={user} logout={logout}/>:<Navigate to="/login"/>}/></Routes></BrowserRouter>;
}
