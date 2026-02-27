<<<<<<< HEAD
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { connectDB } from "../mongodb.js";

export default async function handler(req,res){

  if(req.method !== "POST")
    return res.status(405).end();

  await connectDB();

  const { name,email,phone,password } = req.body;

  if(!email || !password)
    return res.status(400).json({msg:"Data tidak lengkap"});

  const exist = await User.findOne({ email });

  if(exist)
    return res.status(400).json({msg:"Email sudah terdaftar"});

  const hash = await bcrypt.hash(password,10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hash
  });

  res.json({
    success:true,
    userId:user._id
  });
=======
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { connectDB } from "../mongodb.js";

export default async function handler(req,res){

  if(req.method !== "POST")
    return res.status(405).end();

  await connectDB();

  const { name,email,phone,password } = req.body;

  if(!email || !password)
    return res.status(400).json({msg:"Data tidak lengkap"});

  const exist = await User.findOne({ email });

  if(exist)
    return res.status(400).json({msg:"Email sudah terdaftar"});

  const hash = await bcrypt.hash(password,10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hash
  });

  res.json({
    success:true,
    userId:user._id
  });
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
}