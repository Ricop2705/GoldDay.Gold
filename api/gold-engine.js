let GOLD_STATE = {
  price: 2961000,
  lastUpdate: 0,
  running: false
};

const UPDATE_INTERVAL = 30000; // 30 detik
const KURS = 16800;
const PPH = 0.0025; // 0.25%

/* =========================
   FETCH GOLD WORLD PRICE
========================= */
async function fetchWorldGold(){

  const res = await fetch(
    "https://api.gold-api.com/price/XAU"
  );

  const data = await res.json();

  const ounceUSD = data.price;
  const gramUSD = ounceUSD / 31.1035;

  return gramUSD * KURS;
}

/* =========================
   KONVERSI → HARGA ANTAM
========================= */
function convertToAntam(worldPrice){

  // premium Antam (rata-rata pasar)
  const antamPremium = 1.18;

  let price = worldPrice * antamPremium;

  // tambah PPh 0.25%
  price = price * (1 + PPH);

  return Math.round(price);
}

/* =========================
   ENGINE LOOP (SINGLETON)
========================= */
async function updateGoldLoop(){

  try{

    const world = await fetchWorldGold();
    const antam = convertToAntam(world);

    GOLD_STATE.price = antam;
    GOLD_STATE.lastUpdate = Date.now();

    console.log("🟢 ANTAM LIVE:", antam);

  }catch(err){
    console.log("⚠️ Gold update gagal, pakai cache");

    return GOLD_STATE.price; // 
  }
}

/* =========================
   START ENGINE (HANYA SEKALI)
========================= */
export function startGoldEngine(){

  if(GOLD_STATE.running) return;

  GOLD_STATE.running = true;

  console.log("🚀 Gold Engine Started");

  updateGoldLoop(); // first run
}

/* =========================
   GET CURRENT PRICE
========================= */
export async function getGoldPrice(){

  const now = Date.now();

  // refresh tiap 30 detik
  if(!GOLD_STATE.lastUpdate ||
     now - GOLD_STATE.lastUpdate > 30000){

    console.log("🔄 Refresh gold price...");
    await updateGoldLoop();
  }

  return {
    price: GOLD_STATE.price || 2961000,
    time: GOLD_STATE.lastUpdate || Date.now()
  };

}
