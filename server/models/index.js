import mongoose from 'mongoose';
const {Schema,model}=mongoose; const ref={type:Schema.Types.ObjectId,ref:'User'};
export const User=model('User',new Schema({name:String,email:{type:String,unique:true},password:String,
 role:{type:String,enum:['farmer','admin'],default:'farmer'},verified:{type:Boolean,default:false},
 farm:{name:String,location:String,size:Number}},{timestamps:true}));
export const Crop=model('Crop',new Schema({owner:ref,name:String,plantedOn:Date,harvestOn:Date,
 stage:{type:String,enum:['planted','growing','harvested'],default:'planted'}}));
export const Soil=model('Soil',new Schema({owner:ref,moisture:Number,nitrogen:Number,phosphorus:Number,potassium:Number,ph:Number,advice:[String]},{timestamps:true}));
export const Product=model('Product',new Schema({name:String,category:{type:String,enum:['seed','fertilizer','pesticide']},price:Number,stock:Number}));
export const Order=model('Order',new Schema({owner:ref,items:[{product:String,category:String,qty:Number,price:Number}],total:Number},{timestamps:true}));
export const Query=model('Query',new Schema({owner:ref,question:String,crop:String,answer:{type:String,default:''}},{timestamps:true}));
