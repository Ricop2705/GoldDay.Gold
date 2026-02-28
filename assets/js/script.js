// GLOBAL GOLD STATE
let lastLiveGold = 0;

let priceReady = false;

let CART = JSON.parse(localStorage.getItem("cart")) || [];

console.log("SCRIPT CONNECTED");
document.addEventListener("DOMContentLoaded", () => {

console.log("JS READY");

/* ===== GOLD PRICE HISTORY ===== */
let goldHistory = [];


/* ==== DEBUG LOGIN BUTTON ==== */
const loginBtn = document.getElementById("loginBtn");
console.log("LOGIN BUTTON =", loginBtn);

});

/* FORMAT */
function toNumber(rp){
  return Number(rp.replace(/[^\d]/g,""));
}

/* LOAD PRODUK */
async function loadProduk() {
  try {
    const res = await fetch("/api/produk");

    if (!res.ok) {
      const text = await res.text();
      console.error("API ERROR:", text);
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("API bukan array:", data);
      return;
    }

    const produkList = document.getElementById("produkList");
    if (!produkList) return;

 produkList.innerHTML = "";

  data.forEach(p => {

  produkList.innerHTML += `
    <div class="produk-card">

      <img src="${p.gambar}" class="produk-img">

      <h3>${p.nama}</h3>

      <p class="produk-price"
         data-weight="${p.weight}">
         Rp 0
      </p>

      <button class="buy-btn"
        disabled
        onclick="addToCart('${p.nama}', this)">
        Beli Sekarang
      </button>

    </div>
  `;
  });

  } catch (e) {
    console.error("Fetch error:", e);
  }
}


function updateProductPrices(goldPrice){

  const MARKUP = 1.15;

  document.querySelectorAll(".produk-price")
    .forEach(el=>{

      const weight = Number(el.dataset.weight);
      if(!weight) return;

      const MARKUP = 1.15;

      // ⭐ hitung dulu
      const newPrice =
        Math.round(weight * goldPrice * MARKUP);

      const oldPrice =
        Number(el.dataset.last || newPrice);

      el.dataset.last = newPrice;

      // reset animasi
      el.classList.remove("price-up","price-down");
      void el.offsetWidth;

      if(newPrice > oldPrice){
        el.classList.add("price-up");
      }else if(newPrice < oldPrice){
        el.classList.add("price-down");
      }

      el.innerText =
        "Rp " + newPrice.toLocaleString("id-ID");

        priceReady = true;

        document.querySelectorAll(".buy-btn")
          .forEach(btn => btn.disabled = false);
    });
}

/* CART */
function saveCart(){
  localStorage.setItem("cart",JSON.stringify(CART));
}

function updateCartCount(){
  const count=document.getElementById("cartCount");
  if(!count) return;
  count.innerText=CART.reduce((a,b)=>a+b.qty,0);
}

function renderCart(){
  const cartItems=document.getElementById("cartItems");
  if(!cartItems) return;

  cartItems.innerHTML="";
  const subtotalEl=document.getElementById("cartSubtotal");
  const oldSubtotal=
    Number(subtotalEl?.dataset.value || 0);
  let subtotal=0;

  CART.forEach((item,index)=>{
    subtotal += item.harga*item.qty;

    const div=document.createElement("div");
    div.className="cart-row";
    div.innerHTML=`
      <div>
        <b>${item.nama}</b>
        <p>Rp ${item.harga.toLocaleString()}</p>
      </div>

      <div class="cart-qty">
        <button class="qty-btn minus">−</button>
        <span class="qty-number">${item.qty}</span>
        <button class="qty-btn plus">+</button>
      </div>
      <button class="cart-remove">✕</button>
    `;

    div.querySelector(".plus").onclick=()=>{
      item.qty++;
      saveCart();

      const num = div.querySelector(".qty-number");
      animateQty(num);

      renderCart();
      updateCartCount();
    };

    div.querySelector(".minus").onclick=()=>{
      item.qty--;
      if(item.qty<=0) CART.splice(index,1);

      saveCart();

      const num = div.querySelector(".qty-number");
      animateQty(num);

      renderCart();
      updateCartCount();
    };

    div.querySelector(".cart-remove").onclick=()=>{
      const panel = document.getElementById("cartPanel");
      panel.classList.add("shake");

      setTimeout(()=>{
        panel.classList.remove("shake");
      },350 );

      CART.splice(index,1);
      saveCart();
      renderCart();
      updateCartCount();
    };

    cartItems.appendChild(div);
  });

  /* ⭐ HANYA SEKALI UPDATE SUBTOTAL */
  subtotalEl.dataset.value = subtotal;

  animateNumber(
    subtotalEl,
    oldSubtotal,
    subtotal
  );

  buildWhatsApp(subtotal);
}

function animateQty(el){
  el.style.transform = "scale(1.35)";
  el.style.opacity = "0.4";

  setTimeout(()=>{
    el.style.transform = "scale(1)";
    el.style.opacity = "1";
  },150);
}

function addToCart(nama,harga){

  if(typeof harga === "string"){
    harga = harga.replace(/[^\d]/g,"");
  }

  harga = Number(harga);

  const exist = CART.find(i=>i.nama===nama);

  if(exist){
    exist.qty++;
  }else{
    CART.push({nama,harga:Number(harga),qty:1});
  }

  if(!priceReady){
    alert("Harga sedang update...");
    return;
  }

  saveCart();
  renderCart();
  updateCartCount();

  document.getElementById("cartPanel")
    ?.classList.add("active");

  // bounce icon
  const cartIcon = document.getElementById("cartIcon");

  if(cartIcon){
    cartIcon.classList.add("bounce");
    setTimeout(()=>{
      cartIcon.classList.remove("bounce");
    },450);
  }
}

// ⭐ WAJIB DI LUAR
window.addToCart = addToCart;

function buildWhatsApp(subtotal){
  const btn=document.getElementById("checkoutWA");
  if(!btn) return;

  let text="Halo Admin, saya ingin order:%0A%0A";
  CART.forEach(item=>{
    text+=`• ${item.nama} x${item.qty} - Rp ${(item.harga*item.qty).toLocaleString()}%0A`;
  });
  text+=`%0ATotal: Rp ${subtotal.toLocaleString()}`;
  btn.href="https://wa.me/6285717442694?text="+text;
}

/* ===== DOM READY (SATU SAJA) ===== */
document.addEventListener("DOMContentLoaded",()=>{

  /* CART INIT */
  renderCart();
  updateCartCount();

  if(document.getElementById("produkList")) loadProduk();

  document.getElementById("cartIcon")?.addEventListener("click",()=>{
    document.getElementById("cartPanel")?.classList.add("active");
    document.body.classList.add("cart-open");
  });

  document.getElementById("closeCart")?.addEventListener("click",()=>{
    document.getElementById("cartPanel")?.classList.remove("active");
    document.body.classList.remove("cart-open");
  });

  
  /* LOGIN STATE */
  const user=JSON.parse(localStorage.getItem("user"));
  const loginBtn=document.getElementById("loginBtn");
  const userMenu=document.getElementById("userMenu");

  if(user){
    loginBtn && (loginBtn.style.display="none");
    userMenu && (userMenu.style.display="flex");
  }

  document.getElementById("logoutBtn")?.addEventListener("click",()=>{
    localStorage.removeItem("user");
    location.reload();
  });

  /* LOGIN / REGISTER TAB */

 const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");

const loginAction = document.getElementById("doLogin");
const registerAction = document.getElementById("doRegister");

if (tabLogin && tabRegister && loginAction && registerAction) {
   tabRegister.onclick = () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");

    loginAction.style.display = "none";
    registerAction.style.display = "block";
  };

  tabLogin.onclick = () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");

    loginAction.style.display = "block";
    registerAction.style.display = "none";
  };

  registerAction.addEventListener("click", async () => {

  const email =
    document.getElementById("regEmail").value;

  const password =
    document.getElementById("regPassword").value;

  if (!email || !password) {
    alert("Isi email & password");
    return;
  }

  try {

    const res = await fetch("/api/register.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Account berhasil dibuat 🎉");
    } else {
      alert(data.error);
    }

  } catch (e) {
    console.log(e);
    alert("Server error");
  }
  

});

}

  /* NAVBAR SHRINK */
  const navbar=document.querySelector(".navbar");
  window.addEventListener("scroll",()=>{
    if(window.scrollY>40){
      navbar.classList.add("scrolled");
    }else{
      navbar.classList.remove("scrolled");
    }
  });

  /* CINEMATIC OBSERVER */
  const items=document.querySelectorAll(".cinematic");
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      }
    });
  },{threshold:0.2});
  items.forEach(el=>observer.observe(el));
});

/* ===== ACTIVE NAVBAR ===== */
const navlinks = document.querySelectorAll(".menu a");

if(navlinks.length){
  navlinks.forEach(link=>{
    link.addEventListener("click",()=>{
      navlinks.forEach(l=>l.classList.remove("active"));
      link.classList.add("active");
    });
  });
}


navlinks.forEach(link=>{
  link.addEventListener("click",()=>{

    const page=link.dataset.page;
    if(!page) return;

    history.pushState({page}, "","#"+page);
  });
});

window.addEventListener("popstate",(e)=>{
  if(e.state && e.state.page){
    const page=e.state.page;
    document.querySelector(
      `.menu a[data-page="${page}"]`
    )?.click();
  }
});

/* ===== CLEAN LOGIN SYSTEM ===== */

const loginBtn   = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginEmail = document.getElementById("loginEmail");
const doLogin    = document.getElementById("doLogin");

loginBtn.addEventListener("click", () => {

  loginModal.classList.add("active");
  document.body.classList.add("auth-open");

  // fokus otomatis
  setTimeout(()=>{
    loginEmail.focus();
  },200);

});


closeLogin.addEventListener("click", closeModal);

function closeModal(){
  loginModal.classList.remove("active");
  document.body.classList.remove("auth-open");
}


loginModal.addEventListener("click",(e)=>{
  if(e.target === loginModal){
    closeModal();
  }
});

doLogin.addEventListener("click", async ()=>{

  const email = 
    document.getElementById("loginEmail").value;

  const password =
    document.getElementById("loginPassword").value;

  const res = await fetch("/api/login",{
    method:"POST",
    headers:{ 
      "Content-Type":"application/json" 
    },
    body: JSON.stringify({ email, password })
  });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      location.reload();
    } else {
      alert(data.error || "Login gagal");
    }

      if(!email){
    alert("Isi email dulu");
    return;
  }

  // ambil nama dari email
  const nama = email.split("@")[0];

  localStorage.setItem("user",
    JSON.stringify({ nama })
  );

  location.reload();
});


document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape"){
    closeModal();
  }
});

document.addEventListener("keydown",(e)=>{
  if(e.key === "Enter" && loginModal.classList.contains("active")){
    doLogin.click();
  }
});

/* ===== LOGIN STATE ENGINE ===== */

document.addEventListener("DOMContentLoaded",()=>{

  const user = JSON.parse(localStorage.getItem("user"));

  const loginBtn = document.getElementById("loginBtn");
  const userMenu = document.getElementById("userMenu");
  const avatar   = document.getElementById("avatar");

  if(user){
    loginBtn.style.display = "none";
    userMenu.style.display = "flex";

    // huruf avatar
    avatar.textContent = user.nama.charAt(0).toUpperCase();
  }
  /* ===== AUTH SWITCH SAFE ===== */

  const loginFormEl = document.getElementById("loginForm");
  const registerForm =
  document.getElementById("registerForm");

if(registerForm){

  registerForm.addEventListener("submit",async(e)=>{
    e.preventDefault();

    const data = {
      name: registerForm[0].value,
      email: registerForm[1].value,
      phone: registerForm[2].value,
      password: registerForm[3].value
    };

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if(result.success){
      alert("Account berhasil dibuat ✅");
    }else{
      alert(result.msg);
    }
  });
}

  const goLogin = document.getElementById("goLogin");


  if(goLogin){
    goLogin.onclick = () => {
      loginFormEl.style.display = "block";
      registerFormEl.style.display = "none";
    };
  }

});

document.getElementById("logoutBtn")?.addEventListener("click",(e)=>{
  e.preventDefault();

  localStorage.removeItem("user");
  location.reload();
});

/* ===== APP NAVIGATION ===== */

document.addEventListener("click", async (e)=>{

  const link = e.target.closest("a");

  if(!link) return;

  // hanya dashboard
  if(link.getAttribute("href") === "dashboard.html"){

    e.preventDefault();

    loadPage("dashboard.html");
  }

});

async function loadPage(url){

  const container = document.getElementById("appContent");

  container.style.opacity="0";

  const res = await fetch(url);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html,"text/html");

  setTimeout(()=>{
    container.innerHTML = doc.body.innerHTML;
    container.style.opacity="1";
    window.scrollTo(0,0);
  },200);
}

function animateNumber(element, start, end, duration = 400){

  let startTime = null;

  function update(currentTime){
    if(!startTime) startTime = currentTime;

    const progress = Math.min((currentTime - startTime)/duration,1);

    const value = Math.floor(start + (end - start)*progress);

    element.innerText =
      "Subtotal : Rp " + value.toLocaleString();

    if(progress < 1){
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
/* ===== GLOBAL LOGOUT SYSTEM ===== */
  document.addEventListener("click",(e)=>{
    const logoutBtn = e.target.closest("button");
    if(!logoutBtn) return;

    //cek tombol logout
    if(logoutBtn.textContent.trim().toLowerCase() === "logout"){
      localStorage.removeItem("user");

      //kembali ke halaman utama
      location.href = "index.html";
    }
  });

let lastPrice = 0;

/* ===== LIVE PRICE FLASH EFFECT ===== */

function flashPriceChange(up){

  document.querySelectorAll(".product-price")
  .forEach(el=>{

    el.classList.remove("price-up","price-down");

    // reset animation
    void el.offsetWidth;

    el.classList.add(
      up ? "price-up" : "price-down"
    );

  });
}

/* ================================
   GOLD ROLLING DIGIT ENGINE
================================ */
let lastGoldPrice = 0;
let displayedGoldPrice = 0;
let targetGoldPrice = 0;
let rollingAnimation = null;
let livePrice = 0;
let targetPrice = 0;
let tickTimer = null;

function animateGoldPrice(){

  if(rollingAnimation) cancelAnimationFrame(rollingAnimation);

  function step(){

    const diff = targetGoldPrice - displayedGoldPrice;

    // easing movement (biar smooth)
    displayedGoldPrice += diff * 0.12;

    if(Math.abs(diff) < 1){
      displayedGoldPrice = targetGoldPrice;
    }

    const el = document.getElementById("goldPrice");

    if(el){
      el.innerText =
        "Rp " +
        Math.floor(displayedGoldPrice)
        .toLocaleString("id-ID");
    }

    if(displayedGoldPrice !== targetGoldPrice){
      rollingAnimation = requestAnimationFrame(step);
    }
  }

  step();
}

function startRealtimeTick(){

  if(tickTimer) return;

  tickTimer = setInterval(()=>{

    if(!targetPrice) return;

    const diff = targetPrice - livePrice;

    // smooth easing
    livePrice += diff * 0.08;

    if(Math.abs(diff) < 1){
      livePrice = targetPrice;
    }

    const priceEl = document.getElementById("goldPrice");

    if(priceEl){

      priceEl.classList.remove("price-up","price-down");
      void priceEl.offsetWidth;

      if(livePrice > lastLiveGold){
        priceEl.classList.add("price-up");
      }else if(livePrice < lastLiveGold){
        priceEl.classList.add("price-down");
      }

      priceEl.innerText =
        "Rp " + Math.floor(livePrice).toLocaleString("id-ID");
    }

    // ⭐ update produk tiap tick
    updateProductPrices(livePrice);

    // ⭐ simpan harga terakhir
    lastLiveGold = livePrice;

  }, 1000);
}
/* ===== MARKET BAR UPDATE ===== */

let LAST_PRICE = 0;

async function updateGoldTicker(){

  try{
    const res = await fetch("/api/gold-price");
    const data = await res.json();
    
    console.log("GOLD API:", data);

    const directionEl = document.getElementById("goldDirection");
    const percentEl   = document.getElementById("goldPercent");
    const priceEl     = document.getElementById("goldPrice");
    const timeEl = document.getElementById("goldTime");

targetPrice = data.price;
livePrice = data.price;

startRealtimeTick();
updateProductPrices(data.price);

if(!livePrice){
  livePrice = data.price;
}



/* ===== HITUNG PERUBAHAN ===== */

if(lastGoldPrice !== 0){

  const diff = data.price - lastGoldPrice;
  let percent = 0;

  if(lastGoldPrice > 0){
    percent = (diff / lastGoldPrice) * 100;
  }

  percentEl.textContent =
    Math.abs(percent).toFixed(2) + "%";

  priceEl.classList.remove("price-up","price-down","price-flash");

  void priceEl.offsetWidth;

  if(diff > 0){
    directionEl.textContent = "▲";
    priceEl.classList.add("price-up");
  }else if(diff < 0){
    directionEl.textContent = "▼";
    priceEl.classList.add("price-down");
  }

  priceEl.classList.add("price-flash");
}

lastGoldPrice = data.price;

animateGoldPrice();


    if(!priceEl) return;

    const price = Number(data.price);

    // ===== percentage =====
    if(LAST_PRICE){
      const diff = ((price - LAST_PRICE)/LAST_PRICE)*100;
      changeEl.textContent =
        `${diff >= 0 ? "▲" : "▼"} ${Math.abs(diff).toFixed(2)}%`;
    }

    // ===== update time =====
    if(timeEl){
  const d = new Date(data.time);

  timeEl.textContent =
    "Updated " +
    d.getHours().toString().padStart(2,"0")
    + ":" +
    d.getMinutes().toString().padStart(2,"0");
}


  }catch(err){
    console.log("Ticker error", err);
  }
}

/* ===== MINI CHART DRAW ===== */

function drawGoldChart(price){

  const canvas = document.getElementById("goldMiniChart");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  // simpan history max 20 data
  goldHistory.push(price);
  if(goldHistory.length > 20){
    goldHistory.shift();
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const max = Math.max(...goldHistory);
  const min = Math.min(...goldHistory);

  ctx.beginPath();

  goldHistory.forEach((p,i)=>{

    const x =
      (i/(goldHistory.length-1))*canvas.width;

    const y =
      canvas.height -
      ((p-min)/(max-min || 1))*canvas.height;

    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });

  ctx.strokeStyle="#e6c35a";
  ctx.lineWidth=2;
  ctx.stroke();
}
/* ===== LIVE GOLD PRICE UPDATE ===== */

function animateRolling(el, start, end, duration=700){

  let startTime=null;

  function frame(time){
    if(!startTime) startTime=time;

    const progress=Math.min((time-startTime)/duration,1);

    const value=Math.floor(
      start+(end-start)*progress
    );

    el.textContent =
      "Rp " + value.toLocaleString("id-ID");

    if(progress<1){
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

/* ==========================
   MINI GOLD LIVE CHART
========================== */
function drawGoldChart(price){

  const canvas = document.getElementById("goldChart");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  goldHistory.push(price);

  // simpan max 40 titik
  if(goldHistory.length > 40){
    goldHistory.shift();
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const min = Math.min(...goldHistory);
  const max = Math.max(...goldHistory);

  ctx.beginPath();

  goldHistory.forEach((p,i)=>{

    const x =
      (i/(goldHistory.length-1))*canvas.width;

    const y =
      canvas.height -
      ((p-min)/(max-min || 1))*canvas.height;

    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#FFD700";
  ctx.stroke();
}
/* =========================
   REGISTER ACCOUNT
========================= */

const registerBtn = document.getElementById("registerSubmit");

if(registerBtn){

  registerBtn.onclick = async ()=>{

  const nameEl = document.getElementById("regName");
  const emailEl = document.getElementById("regEmail");
  const phoneEl = document.getElementById("regPhone");
  const passEl = document.getElementById("regPassword");
  const confirmEl = document.getElementById("regConfirm");

  if(!nameEl || !emailEl || !passEl){
    console.error("Register input tidak ditemukan");
    return;
  }

  const name = nameEl.value;
  const email = emailEl.value;
  const phone = phoneEl.value;
  const pass = passEl.value;
  const confirm = confirmEl.value;


    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password: pass
      })
    });

    const data = await res.json();

    if(data.success){
      alert("Account berhasil dibuat ✅");

      // pindah ke login otomatis
      document.getElementById("registerBox").style.display="none";
      document.getElementById("loginBox").style.display="block";

    }else{
      alert(data.msg || "Register gagal");
    }
  };
}

/* SWITCH FORM */

const openRegister =
  document.getElementById("openRegister");

const goLogin =
  document.getElementById("goLogin");

const registerBox = 
  document.getElementById("registerBox");

if(openRegister){
  openRegister.onclick = ()=>{
    loginBox.style.display="none";
    registerBox.style.display="block";
  };
}

if(goLogin){
  goLogin.onclick = ()=>{
    registerBox.style.display="none";
    loginBox.style.display="block";
  };
}

setInterval(()=> {
  if(document.getElementById("produkList")){
    loadProduk();
  }
},30000);

  updateGoldTicker();
