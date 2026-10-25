import {Router} from 'express';import {auth} from '../middleware/auth.js';import {User,Crop,Soil,Product,Order,Query} from '../models/index.js';
const r=Router();
// ---- Weather (Open-Meteo, no API key) ----
r.get('/weather',auth(),async(q,s)=>{try{const {lat,lon}=q.query;
 const u=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=5&timezone=auto`;
 const d=await (await fetch(u)).json();const rain=d.daily.precipitation_sum;
 s.json({current:d.current,daily:d.daily,tip:rain.slice(0,3).some(x=>x>5)?'Rain expected in 3 days: delay irrigation and pesticide spraying.':d.current.temperature_2m>35?'Heat alert: irrigate early morning or evening.':'Good conditions: ideal window for sowing and field work.'});
}catch{s.status(500).json({msg:'Weather unavailable'})}});
// ---- Disease detection (rule engine) ----
const D=[
{k:/yellow/,name:'Nitrogen deficiency / Yellow rust',sev:'Medium',treat:'Apply urea; spray propiconazole 1 ml/L if rust pustules are seen.',fert:'Urea 50 kg/acre'},
{k:/spot|blight|brown/,name:'Fungal leaf spot / Blight',sev:'High',treat:'Spray mancozeb 2 g/L, remove infected leaves, avoid overhead irrigation.',fert:'Potash 25 kg/acre'},
{k:/wilt|droop/,name:'Wilt (root rot)',sev:'High',treat:'Improve drainage and drench Trichoderma 5 g/L.',fert:'Reduce nitrogen, add FYM'},
{k:/hole|insect|chew|worm/,name:'Caterpillar / leaf-eating pests',sev:'Medium',treat:'Spray neem oil 5 ml/L; use pheromone traps.',fert:'Balanced NPK 19:19:19'},
{k:/white|powder|mildew/,name:'Powdery mildew',sev:'Medium',treat:'Wettable sulphur 2 g/L every 10 days.',fert:'Avoid excess nitrogen'},
{k:/curl/,name:'Leaf curl virus (whitefly)',sev:'High',treat:'Yellow sticky traps, imidacloprid 0.3 ml/L, remove infected plants.',fert:'Zn + Boron micronutrients'},
{k:/stunt/,name:'Nutrient deficiency / nematodes',sev:'Low',treat:'Soil test; add compost and neem cake.',fert:'DAP 40 kg/acre'}];
r.post('/disease',auth(),(q,s)=>{const t=(q.body.symptoms||'').toLowerCase();
 const m=D.filter(x=>x.k.test(t)).map((x,i)=>({name:x.name,severity:x.sev,treatment:x.treat,fertilizer:x.fert,confidence:92-i*9}));
 s.json(m.length?m:[{name:'No clear match',severity:'Low',treatment:'Contact your local KVK or use the Expert Desk.',fertilizer:'-',confidence:40}])});
// ---- Orders ----
r.get('/orders',auth(),async(q,s)=>s.json(await Order.find({owner:q.user.id}).sort('-createdAt')));
r.post('/orders',auth(),async(q,s)=>{let total=0;const items=[];
 for(const i of q.body.items||[]){const p=await Product.findById(i.id);
  if(!p||p.stock<i.qty)return s.status(400).json({msg:`${p?.name||'Item'} out of stock`});
  p.stock-=i.qty;await p.save();total+=p.price*i.qty;items.push({product:p.name,category:p.category,qty:i.qty,price:p.price})}
 s.json(await Order.create({owner:q.user.id,items,total}))});
// ---- Expert consultancy ----
r.get('/queries',auth(),async(q,s)=>s.json(await Query.find({owner:q.user.id}).sort('-createdAt')));
r.post('/queries',auth(),async(q,s)=>s.json(await Query.create({owner:q.user.id,question:q.body.question,crop:q.body.crop})));
// ---- Farmer dashboard stats ----
r.get('/stats',auth(),async(q,s)=>{const id=q.user.id;
 const crops=await Crop.find({owner:id}),soil=(await Soil.find({owner:id}).sort('-createdAt').limit(7)).reverse(),orders=await Order.find({owner:id});
 const st=n=>crops.filter(c=>c.stage===n).length;
 s.json({crops:crops.length,stages:['planted','growing','harvested'].map(n=>({name:n,value:st(n)})),
  soil:soil.map(x=>({d:x.createdAt.toLocaleDateString('en-IN',{day:'numeric',month:'short'}),moisture:x.moisture,nitrogen:x.nitrogen,phosphorus:x.phosphorus,potassium:x.potassium})),
  advice:soil.at(-1)?.advice||[],orders:orders.length,spent:orders.reduce((a,o)=>a+o.total,0),open:await Query.countDocuments({owner:id,answer:''})})});
// ---- Admin analytics ----
r.get('/admin/stats',auth('admin'),async(q,s)=>{const o=await Order.find(),by={};
 o.forEach(x=>x.items.forEach(i=>by[i.category]=(by[i.category]||0)+i.price*i.qty));
 s.json({farmers:await User.countDocuments({role:'farmer'}),verified:await User.countDocuments({role:'farmer',verified:true}),orders:o.length,
  revenue:o.reduce((a,x)=>a+x.total,0),byCategory:Object.entries(by).map(([name,value])=>({name,value})),
  lowStock:await Product.find({stock:{$lt:20}}),crops:await Crop.countDocuments(),openQueries:await Query.countDocuments({answer:''})})});
r.get('/admin/queries',auth('admin'),async(q,s)=>s.json(await Query.find().populate('owner','name').sort('-createdAt')));
r.patch('/admin/queries/:id',auth('admin'),async(q,s)=>s.json(await Query.findByIdAndUpdate(q.params.id,{answer:q.body.answer},{new:true})));
export default r;
