import {Router} from 'express';import bcrypt from 'bcryptjs';import jwt from 'jsonwebtoken';import {User} from '../models/index.js';
const r=Router();
const out=u=>({token:jwt.sign({id:u._id,role:u.role},process.env.JWT_SECRET,{expiresIn:'7d'}),
 user:{id:u._id,name:u.name,email:u.email,role:u.role,verified:u.verified}});
r.post('/register',async(q,s)=>{const {name,email,password}=q.body;
 if(!name||!email||!password)return s.status(400).json({msg:'All fields required'});
 if(await User.findOne({email}))return s.status(400).json({msg:'Email already used'});
 s.json(out(await User.create({name,email,password:await bcrypt.hash(password,10)})));});
r.post('/login',async(q,s)=>{const u=await User.findOne({email:q.body.email});
 if(!u||!await bcrypt.compare(q.body.password||'',u.password))return s.status(400).json({msg:'Invalid credentials'});
 s.json(out(u));});
export default r;
