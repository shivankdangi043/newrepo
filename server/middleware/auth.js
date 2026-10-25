import jwt from 'jsonwebtoken';
export const auth=(role)=>(req,res,next)=>{try{
 req.user=jwt.verify(req.headers.authorization?.split(' ')[1],process.env.JWT_SECRET);
 if(role&&req.user.role!==role)return res.status(403).json({msg:'Forbidden'});next();
}catch{res.status(401).json({msg:'Please login'})}};
