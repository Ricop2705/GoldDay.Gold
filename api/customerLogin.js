<<<<<<< HEAD
export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).json({success:false});
  }

  const { email, password } = req.body;

  console.log("CUSTOMER LOGIN:",email,password);

  /* ===== DEMO LOGIN CUSTOMER ===== */

  if(email && password){

    return res.status(200).json({
      success:true,
      token:"gold_customer_token",
      nama: email.split("@")[0] // ambil nama dari email
    });

  }

  return res.status(401).json({
    success:false,
    message:"Login gagal"
  });

}
=======
export default async function handler(req,res){

  if(req.method !== "POST"){
    return res.status(405).json({success:false});
  }

  const { email, password } = req.body;

  console.log("CUSTOMER LOGIN:",email,password);

  /* ===== DEMO LOGIN CUSTOMER ===== */

  if(email && password){

    return res.status(200).json({
      success:true,
      token:"gold_customer_token",
      nama: email.split("@")[0] // ambil nama dari email
    });

  }

  return res.status(401).json({
    success:false,
    message:"Login gagal"
  });

}
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
