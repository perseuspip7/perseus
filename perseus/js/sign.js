function initSignPanel() {
  const openBtn = document.getElementById("openPanel");
  const openBtn2 = document.getElementById("openPanel2");
  const closeBtn = document.getElementById("gsign");
  const closeBtn2 = document.getElementById("gsign2");
  const overlay = document.getElementById("overlay");
  const overlay2 = document.getElementById("overlay2");

  if (openBtn && overlay) {
    openBtn.addEventListener("click", () => {
      overlay.style.display = "block";
    });
  }

  if (openBtn2 && overlay2) {
    openBtn2.addEventListener("click", () => {
      overlay2.style.display = "block";
    });
  }

  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });
  }

  if (closeBtn2 && overlay2) {
    closeBtn2.addEventListener("click", () => {
      overlay2.style.display = "none";
    });
  }

  // backdrop bosilganda yopish
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.style.display = "none";
    });
  }

  if (overlay2) {
    overlay2.addEventListener("click", (e) => {
      if (e.target === overlay2) overlay2.style.display = "none";
    });
  }

  

  // Escape tugmasi bilan yopish
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (overlay) overlay.style.display = "none";
      if (overlay2) overlay2.style.display = "none";
    }
  });
}

  // Hamma .eyeicon elementlarini tanlab chiqamiz
  document.querySelectorAll("#eyeicon, #eyeicon1").forEach((eye, index) => {
    eye.addEventListener("click", () => {
      // O‘sha container ichidagi inputni topamiz
      let passwordInput = eye.previousElementSibling;

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eye.src = "/assets/eye-open.png";
      } else {
        passwordInput.type = "password";
        eye.src = "/assets/eye-close.png";
      }
    });
  });

