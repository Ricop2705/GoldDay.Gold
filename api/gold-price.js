import { getGoldPrice, startGoldEngine }
  from "../lib/gold-engine.js";

import getClient from "../lib/mongodb.js";

export default async function handler(req, res){

  startGoldEngine();

  const gold = await getGoldPrice();

  const client = await getClient();
  const db = client.db("emasDB");

  console.log("✅ MongoDB READY");
  console.log("✅ REAL SPOT GOLD:", gold);

  res.status(200).json(gold);
}