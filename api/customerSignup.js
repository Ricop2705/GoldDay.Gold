<<<<<<< HEAD
let users = global.users || [];
global.users = users;

export default function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const {nama,email,password}=req.body;

  if(users.find(u=>u.email===email)){
    return res.status(400).json({
      success:false,
      message:"Email sudah terdaftar"
    });
  }

  users.push({nama,email,password});

  res.json({success:true});
}
=======
let users = global.users || [];
global.users = users;

export default function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).end();
  }

  const {nama,email,password}=req.body;

  if(users.find(u=>u.email===email)){
    return res.status(400).json({
      success:false,
      message:"Email sudah terdaftar"
    });
  }

  users.push({nama,email,password});

  res.json({success:true});
}
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
