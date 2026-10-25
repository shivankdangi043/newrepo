import express from 'express';import mongoose from 'mongoose';import cors from 'cors';import dotenv from 'dotenv';import helmet from 'helmet';
import rateLimit from 'express-rate-limit';import path from 'path';import {fileURLToPath} from 'url';import bcrypt from 'bcryptjs';
import auth from './routes/auth.js';import farm from './routes/farm.js';import admin from './routes/admin.js';import extra from './routes/extra.js';
import {User,Product} from './models/index.js';
dotenv.config();
const app=express();app.use(helmet({contentSecurityPolicy:false}));app.use(cors());app.use(express.json());
app.use('/api/auth',rateLimit({windowMs:15*60*1000,max:100}),auth);
app.use('/api',extra);app.use('/api/admin',admin);app.use('/api',farm);
app.get('/health',(q,s)=>s.send('ok'));
const dist=path.join(path.dirname(fileURLToPath(import.meta.url)),'../client/dist');
app.use(express.static(dist));app.get('*',(q,s)=>s.sendFile(path.join(dist,'index.html')));
let uri=process.env.MONGO_URI;
if(!uri||uri.includes('xxxx')){
  const {MongoMemoryServer}=await import('mongodb-memory-server');
  uri=(await MongoMemoryServer.create()).getUri('agritech');
  console.log('Using in-memory database (data resets on restart)');
}
await mongoose.connect(uri);
if(!await User.findOne({role:'admin'}))await User.create({name:'Admin',email:process.env.ADMIN_EMAIL,password:await bcrypt.hash(process.env.ADMIN_PASSWORD,10),role:'admin',verified:true});
if(!await Product.countDocuments())await Product.insertMany([
 {name:'Wheat Seeds HD-2967 (10kg)',category:'seed',price:450,stock:100},{name:'Basmati Rice Seeds (5kg)',category:'seed',price:620,stock:70},
 {name:'Hybrid Tomato Seeds (100g)',category:'seed',price:540,stock:45},{name:'Urea (50kg)',category:'fertilizer',price:300,stock:80},
 {name:'DAP (50kg)',category:'fertilizer',price:1350,stock:60},{name:'Potash MOP (50kg)',category:'fertilizer',price:900,stock:15},
 {name:'Vermicompost (25kg)',category:'fertilizer',price:350,stock:90},{name:'Neem Oil (1L)',category:'pesticide',price:380,stock:50},
 {name:'Mancozeb Fungicide (500g)',category:'pesticide',price:290,stock:40},{name:'Sticky Traps (pack of 20)',category:'pesticide',price:250,stock:12}]);
app.listen(process.env.PORT||5000,()=>console.log('Server running'));
