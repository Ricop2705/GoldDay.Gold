<<<<<<< HEAD
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req,res){

  if(req.method !== "POST")
    return res.status(405).end();

  const { email, password } = req.body;

  const conn = await client.connect();
  const db = conn.db("emasDB");

  const user =
    await db.collection("users")
    .findOne({email});

  if(!user)
    return res.status(401).json({error:"User tidak ditemukan"});

  const valid =
    await bcrypt.compare(password,user.password);

  if(!valid)
    return res.status(401).json({error:"Password salah"});

  const token = jwt.sign(
    { id:user._id, email:user.email },
    process.env.JWT_SECRET,
    { expiresIn:"7d" }
  );

  res.status(200).json({token});
}
=======
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req,res){

  if(req.method !== "POST")
    return res.status(405).end();

  const { email, password } = req.body;

  const conn = await client.connect();
  const db = conn.db("emasDB");

  const user =
    await db.collection("users")
    .findOne({email});

  if(!user)
    return res.status(401).json({error:"User tidak ditemukan"});

  const valid =
    await bcrypt.compare(password,user.password);

  if(!valid)
    return res.status(401).json({error:"Password salah"});

  const token = jwt.sign(
    { id:user._id, email:user.email },
    process.env.JWT_SECRET,
    { expiresIn:"7d" }
  );

  res.status(200).json({token});
}
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
