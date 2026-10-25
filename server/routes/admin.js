import {Router} from 'express';import {auth} from '../middleware/auth.js';import {User,Product,Order,Crop} from '../models/index.js';
const r=Router();r.use(auth('admin'));
r.get('/users',async(q,s)=>s.json(await User.find({role:'farmer'}).select('-password')));
r.patch('/users/:id/verify',async(q,s)=>s.json(await User.findByIdAndUpdate(q.params.id,{verified:true},{new:true}).select('-password')));
r.post('/products',async(q,s)=>s.json(await Product.create(q.body)));
r.patch('/products/:id',async(q,s)=>s.json(await Product.findByIdAndUpdate(q.params.id,{stock:q.body.stock},{new:true})));
r.get('/orders',async(q,s)=>s.json(await Order.find().populate('owner','name').sort('-createdAt')));
r.get('/crops',async(q,s)=>s.json(await Crop.find().populate('owner','name')));
export default r;
