function getToken() {
  return localStorage.getItem("token");
}

function setToast(el, msg, ok = true) {
  el.style.display = "block";
  el.textContent = msg;
  el.className = "toast " + (ok ? "ok" : "err");
}

function clearToast(el) {
  el.style.display = "none";
}

async function api(path, method, body) {
  const token = getToken();
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadProfile() {
  const badge = document.getElementById("profileBadge");
  const { ok, data } = await api("/api/users/profile", "GET");
  badge.textContent = ok ? `${data.username} • ${data.email}` : "Not authorized";
}

async function loadBooks() {
  const tbody = document.getElementById("booksTbody");
  tbody.innerHTML = "";

  const { ok, status, data } = await api("/api/resource", "GET");
  if (!ok) {
    tbody.innerHTML = `<tr><td colspan="5">Error (${status}): ${escapeHtml(data.message || "Failed")}</td></tr>`;
    return;
  }

  if (!data.books || data.books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No books yet. Create one!</td></tr>`;
    return;
  }

  for (const b of data.books) {
    const available = !!b.available;
    const pill = available
      ? `<span class="pill"><span class="dot"></span> true</span>`
      : `<span class="pill off"><span class="dot"></span> false</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(b.title)}</td>
      <td>${escapeHtml(b.author)}</td>
      <td>${escapeHtml(b.category)}</td>
      <td>${pill}</td>
      <td>
        <div class="actions">
          <button class="btn small" data-action="toggle" data-id="${b._id}" data-available="${available}">Edit</button>
          <button class="btn small danger" data-action="delete" data-id="${b._id}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

async function createBook() {
  const msg = document.getElementById("bookMsg");
  clearToast(msg);

  const title = document.getElementById("bTitle").value.trim();
  const author = document.getElementById("bAuthor").value.trim();
  const category = document.getElementById("bCategory").value.trim();
  const available = document.getElementById("bAvailable").value === "true";

  const { ok, status, data } = await api("/api/resource", "POST", {
    title, author, category, available
  });

  if (ok) {
    setToast(msg, "✅ Book created", true);
    document.getElementById("bTitle").value = "";
    document.getElementById("bAuthor").value = "";
    document.getElementById("bCategory").value = "";
    document.getElementById("bAvailable").value = "true";
    await loadBooks();
  } else {
    const text = data.message || `Create failed (${status})`;
    const details = data.errors ? ` | ${data.errors.join(" , ")}` : "";
    setToast(msg, "❌ " + text + details, false);
  }
}

async function toggleAvailability(bookId, current) {
  const msg = document.getElementById("bookMsg");
  clearToast(msg);

  const { ok, status, data } = await api(`/api/resource/${bookId}`, "PUT", {
    available: !current
  });

  if (ok) {
    setToast(msg, "✅ Book updated", true);
    await loadBooks();
  } else {
    const text = data.message || `Update failed (${status})`;
    setToast(msg, "❌ " + text, false);
  }
}

async function deleteBook(bookId) {
  const msg = document.getElementById("bookMsg");
  clearToast(msg);

  const { ok, status, data } = await api(`/api/resource/${bookId}`, "DELETE");

  if (ok) {
    setToast(msg, "✅ Book deleted", true);
    await loadBooks();
  } else {
    const text = data.message || `Delete failed (${status})`;
    setToast(msg, "❌ " + text, false);
  }
}

document.getElementById("btnCreate").addEventListener("click", createBook);
document.getElementById("btnRefresh").addEventListener("click", loadBooks);

document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
});

// Table actions
document.getElementById("booksTbody").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const id = btn.getAttribute("data-id");

  if (action === "toggle") {
    const current = btn.getAttribute("data-available") === "true";
    await toggleAvailability(id, current);
  }

  if (action === "delete") {
    const yes = confirm("Delete this book?");
    if (yes) await deleteBook(id);
  }
});

// On load
(async () => {
  const token = getToken();
  if (!token) {
    window.location.href = "./index.html";
    return;
  }
  await loadProfile();
  await loadBooks();
})();
