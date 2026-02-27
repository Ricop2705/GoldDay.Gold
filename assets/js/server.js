<<<<<<< HEAD
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

/* ===== API FIRST ===== */
app.post("/api/register", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success:false,
      error:"Data tidak lengkap"
    });
  }

  let users = [];

  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
  }

  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.json({
      success:false,
      error:"Email sudah terdaftar"
    });
  }

  users.push({ email, password });

  fs.writeFileSync("users.json", JSON.stringify(users,null,2));

  res.json({ success:true });
});

/* ===== STATIC LAST ===== */
app.use(express.static("public"));

app.listen(3000, () =>
  console.log("Server running http://localhost:3000")
);
=======
const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

/* ===== API FIRST ===== */
app.post("/api/register", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success:false,
      error:"Data tidak lengkap"
    });
  }

  let users = [];

  if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
  }

  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.json({
      success:false,
      error:"Email sudah terdaftar"
    });
  }

  users.push({ email, password });

  fs.writeFileSync("users.json", JSON.stringify(users,null,2));

  res.json({ success:true });
});

/* ===== STATIC LAST ===== */
app.use(express.static("public"));

app.listen(3000, () =>
  console.log("Server running http://localhost:3000")
);
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
