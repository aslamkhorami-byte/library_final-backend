function showToast(el, msg, ok = true) {
  el.style.display = "block";
  el.textContent = msg;
  el.className = "toast " + (ok ? "ok" : "err");
}

function hideToast(el) {
  el.style.display = "none";
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

async function api(path, method, body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/* ---------- UI: Switch panels (Register / Login) ---------- */
function showPanel(which) {
  const reg = document.getElementById("panelRegister");
  const log = document.getElementById("panelLogin");
  const tabR = document.getElementById("tabRegister");
  const tabL = document.getElementById("tabLogin");

  const isRegister = which === "register";
  reg.style.display = isRegister ? "block" : "none";
  log.style.display = isRegister ? "none" : "block";

  tabR.classList.toggle("active", isRegister);
  tabL.classList.toggle("active", !isRegister);

  hideToast(document.getElementById("regMsg"));
  hideToast(document.getElementById("loginMsg"));
}

document.getElementById("tabRegister").addEventListener("click", () => showPanel("register"));
document.getElementById("tabLogin").addEventListener("click", () => showPanel("login"));

/* ---------- Buttons ---------- */
document.getElementById("btnClear").addEventListener("click", () => {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  hideToast(document.getElementById("loginMsg"));
});

document.getElementById("btnGoLogin").addEventListener("click", () => {
  showPanel("login");
  document.getElementById("loginEmail").focus();
});

/* ---------- Register ---------- */
document.getElementById("btnRegister").addEventListener("click", async () => {
  const msg = document.getElementById("regMsg");
  hideToast(msg);

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  const { ok, status, data } = await api("/api/auth/register", "POST", {
    username, email, password
  });

  if (ok) {
    showToast(msg, "✅ Registered successfully. Moving to login...", true);

    // Prefill login email for convenience
    document.getElementById("loginEmail").value = email;

    setTimeout(() => {
      showPanel("login");
      document.getElementById("loginPassword").focus();
    }, 650);
  } else {
    const text = data.message || `Register failed (${status})`;
    showToast(msg, "❌ " + text, false);
  }
});

/* ---------- Login ---------- */
document.getElementById("btnLogin").addEventListener("click", async () => {
  const msg = document.getElementById("loginMsg");
  hideToast(msg);

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { ok, status, data } = await api("/api/auth/login", "POST", { email, password });

  if (ok) {
    if (data.token) setToken(data.token);

    showToast(msg, "✅ Login success. Redirecting to dashboard...", true);

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 600);
  } else {
    const text = data.message || `Login failed (${status})`;
    showToast(msg, "❌ " + text, false);
  }
});

/* ---------- Default view: Register first ---------- */
showPanel("register");

/* ---------- Optional: if already logged in, go dashboard ---------- */
if (getToken()) {
  // window.location.href = "./dashboard.html";
}
