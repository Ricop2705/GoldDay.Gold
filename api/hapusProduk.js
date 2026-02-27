<<<<<<< HEAD
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const clientPromise = client.connect();

const ADMIN_TOKEN = "EMAS_ADMIN_2026";

export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const token = req.headers["authorization"];

  if(token !== ADMIN_TOKEN){
    return res.status(401).json({error:"Unauthorized"});
  }

  try{

    const client = await clientPromise;
    const db = client.db("emasDB");
    const koleksi = db.collection("produk");

    const { id } = req.body;

    await koleksi.deleteOne({_id:new ObjectId(id)});

    res.status(200).json({success:true});

  }catch(err){
    res.status(500).json({error:"Gagal hapus"});
  }
}
=======
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const clientPromise = client.connect();

const ADMIN_TOKEN = "EMAS_ADMIN_2026";

export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const token = req.headers["authorization"];

  if(token !== ADMIN_TOKEN){
    return res.status(401).json({error:"Unauthorized"});
  }

  try{

    const client = await clientPromise;
    const db = client.db("emasDB");
    const koleksi = db.collection("produk");

    const { id } = req.body;

    await koleksi.deleteOne({_id:new ObjectId(id)});

    res.status(200).json({success:true});

  }catch(err){
    res.status(500).json({error:"Gagal hapus"});
  }
}
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
