
import getClient from "../lib/mongodb.js";
import { getGoldPrice } from "./gold-engine.js";

export default async function handler(req, res) {
  try {

    /* CONNECT MONGODB */
    const client = await getClient();
    const db = client.db("emasDB");

    console.log("✅ MongoDB READY");

    /* START GOLD ENGINE SEKALI SAJA */
    if (!global.goldEngineStarted) {
      startGoldEngine();
      global.goldEngineStarted = true;
      console.log("🚀 Gold Engine Started (GLOBAL)");
    }

    /* AMBIL LIVE GOLD */
    const { price: gold } = await getGoldPrice();

    console.log("✅ REAL SPOT GOLD:", gold);

    /* AMBIL PRODUK */
    const raw = await db.collection("produk").find({}).toArray();

    const MARKUP = 1.15;

    console.log("PRODUK RAW:", raw);
    const data = raw.map(p => {

    const weight =
      p.weight ||
      Number(p?.nama?.match(/\d+/)?.[0] || 0);

    const harga =
      Math.round(weight * gold.price * MARKUP);

    return {
      ...p,
      weight,
      harga
    };
  });

    console.log("✅ Produk ditemukan:", data.length);

    res.status(200).json(data);

  } catch (err) {
    console.error("🔥 PRODUK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

