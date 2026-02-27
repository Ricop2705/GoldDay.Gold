<<<<<<< HEAD
/* ===== CUSTOMER DASHBOARD GUARD ===== */

const token = localStorage.getItem("customer_token");

if(!token){
  location.href="/auth.html";
}

/* LOAD USER */

const nama = localStorage.getItem("customer_nama");

const dashNama = document.getElementById("dashNama");
const dashAvatar = document.getElementById("dashAvatar");

if(dashNama && nama){
  dashNama.innerText = nama;
}

if(dashAvatar && nama){
  dashAvatar.innerText = nama.charAt(0).toUpperCase();
}

/* ORDER COUNT FROM CART */

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderCount = document.getElementById("orderCount");

if(orderCount){
  orderCount.innerText = cart.length;
}

/* LOGOUT */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click",()=>{

  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_nama");

  location.href="/index.html";
});
=======
/* ===== CUSTOMER DASHBOARD GUARD ===== */

const token = localStorage.getItem("customer_token");

if(!token){
  location.href="/auth.html";
}

/* LOAD USER */

const nama = localStorage.getItem("customer_nama");

const dashNama = document.getElementById("dashNama");
const dashAvatar = document.getElementById("dashAvatar");

if(dashNama && nama){
  dashNama.innerText = nama;
}

if(dashAvatar && nama){
  dashAvatar.innerText = nama.charAt(0).toUpperCase();
}

/* ORDER COUNT FROM CART */

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderCount = document.getElementById("orderCount");

if(orderCount){
  orderCount.innerText = cart.length;
}

/* LOGOUT */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click",()=>{

  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_nama");

  location.href="/index.html";
});
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
