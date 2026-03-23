export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).json({msg:"Method not allowed"});
  }

  const {username,password} = req.body;

  // TODO nanti ganti database asli
  if(!username || !password){
    return res.status(400).json({msg:"Data kosong"});
  }

  return res.status(200).json({
    success:true,
    token:"GOLD_USER_TOKEN"
  });

}
