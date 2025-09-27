import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req,res)=>{
  const { username,email,password } = req.body;
  try{
    const user = await User.create({ username,email,password });
    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{ expiresIn:'7d' });
    res.json({ token, user: { id:user._id, username, email, role:user.role } });
  }catch(err){
    res.status(400).json({message:err.message});
  }
}

export const login = async (req,res)=>{
  const { email,password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({message:'User not found'});
  const match = await user.comparePassword(password);
  if(!match) return res.status(400).json({message:'Wrong password'});
  const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET,{ expiresIn:'7d' });
  res.json({ token, user: { id:user._id, username:user.username, email, role:user.role } });
}
