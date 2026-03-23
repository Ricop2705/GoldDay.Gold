document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.querySelector("#loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/auth.html";
    });
  }

});
