<<<<<<< HEAD
export default function handler(req,res){

  const token = req.headers.authorization;

  if(token==="customer_session_token"){
    return res.json({login:true});
  }

  res.json({login:false});
}
=======
export default function handler(req,res){

  const token = req.headers.authorization;

  if(token==="customer_session_token"){
    return res.json({login:true});
  }

  res.json({login:false});
}
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
