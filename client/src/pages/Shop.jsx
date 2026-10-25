import {useState} from 'react';import toast from 'react-hot-toast';import {motion,AnimatePresence} from 'framer-motion';import {ShoppingCart,Plus,Minus,Search,X} from 'lucide-react';import api from '../api';import {Glass,Head,Skel,useGet} from '../ui';
const em={seed:'🌱',fertilizer:'🧪',pesticide:'🛡️'};
export default function Shop(){
 const [ps,load,l]=useGet('/products'),[os,lo]=useGet('/orders'),[cat,setCat]=useState('all'),[q,setQ]=useState(''),[cart,setCart]=useState({}),[open,setOpen]=useState(false);
 const list=ps.filter(p=>(cat==='all'||p.category===cat)&&p.name.toLowerCase().includes(q.toLowerCase())),items=ps.filter(p=>cart[p._id]);
 const total=items.reduce((s,p)=>s+p.price*cart[p._id],0),n=Object.values(cart).reduce((a,b)=>a+b,0);
 const add=(p,d=1)=>setCart(c=>{const v=Math.max(0,Math.min(p.stock,(c[p._id]||0)+d)),x={...c,[p._id]:v};if(!v)delete x[p._id];return x});
 const buy=async()=>{try{await api.post('/orders',{items:items.map(p=>({id:p._id,qty:cart[p._id]}))});toast.success('Order placed 🎉');setCart({});setOpen(false);load();lo()}catch(e){toast.error(e.response?.data?.msg||'Failed')}};
 return <><Head t="Agri Store" s="Seeds, fertilizers and pesticides."><button className="btn relative" onClick={()=>setOpen(true)}><ShoppingCart size={18}/>Cart{n>0&&<motion.span key={n} initial={{scale:1.6}} animate={{scale:1}} className="absolute -top-2 -right-2 bg-lav text-olive2 text-xs rounded-full size-6 grid place-items-center">{n}</motion.span>}</button></Head>
  <div className="flex flex-wrap gap-2 items-center mb-4"><div className="relative flex-1 min-w-48"><Search size={16} className="absolute left-3 top-3.5 opacity-50"/><input className="inp pl-9" placeholder="Search products…" onChange={e=>setQ(e.target.value)}/></div>
   {['all','seed','fertilizer','pesticide'].map(c=><button key={c} className={'chip capitalize '+(cat===c?'on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
  {l?<Skel/>:<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(p=><Glass key={p._id}><div className="text-5xl mb-2">{em[p.category]}</div><h3 className="font-display text-lg leading-tight">{p.name}</h3>
   <p className="text-sm" style={{color:'var(--mut)'}}>{p.stock<20?<span className="text-amber-600">Only {p.stock} left</span>:`${p.stock} in stock`}</p>
   <div className="flex justify-between items-center mt-3"><b className="text-xl text-olive">₹{p.price}</b><button className="btn btn-soft" disabled={!p.stock} onClick={()=>{add(p);toast.success('Added')}}><Plus size={16}/>Add</button></div></Glass>)}</div>}
  <h2 className="font-display text-xl mt-10 mb-3">Order history</h2><div className="space-y-2">{os.map(o=><Glass key={o._id} hover={false} className="!p-3 text-sm flex justify-between gap-3"><span>{o.items.map(i=>`${i.product} ×${i.qty}`).join(', ')}</span><b>₹{o.total}</b></Glass>)}{!os.length&&<p style={{color:'var(--mut)'}}>No orders yet.</p>}</div>
  <AnimatePresence>{open&&<><motion.div className="fixed inset-0 bg-black/40 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}/>
   <motion.aside className="fixed right-0 top-0 h-full w-full max-w-sm z-50 p-5 flex flex-col" style={{background:'var(--bg)'}} initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28}}>
    <div className="flex justify-between mb-4"><h3 className="font-display text-2xl">Your cart</h3><button onClick={()=>setOpen(false)}><X/></button></div>
    <div className="flex-1 overflow-auto space-y-3">{items.map(p=><div key={p._id} className="glass p-3 flex justify-between items-center"><div><p className="font-medium text-sm">{p.name}</p><p className="text-olive">₹{p.price*cart[p._id]}</p></div>
     <div className="flex items-center gap-2"><button className="chip" onClick={()=>add(p,-1)}><Minus size={14}/></button>{cart[p._id]}<button className="chip" onClick={()=>add(p)}><Plus size={14}/></button></div></div>)}{!items.length&&<p className="text-center mt-10" style={{color:'var(--mut)'}}>Cart is empty 🧺</p>}</div>
    <div className="pt-4 border-t" style={{borderColor:'var(--bd)'}}><div className="flex justify-between text-xl font-display mb-3"><span>Total</span><span>₹{total}</span></div><button className="btn w-full justify-center" disabled={!total} onClick={buy}>Place order</button></div></motion.aside></>}</AnimatePresence></>;
}
