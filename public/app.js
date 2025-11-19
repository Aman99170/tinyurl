const API_BASE = "/api/links";

document.addEventListener("DOMContentLoaded", () => {
  loadLinks();

  document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const targetUrl = document.getElementById("target_url").value;

    console.log("Creating link for:", targetUrl);

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_url: targetUrl })
    });

    if (res.status === 409) {
      alert("Shortcode already exists");
      return;
    }

    if (!res.ok) {
      alert("Error creating link");
      return;
    }

    document.getElementById("target_url").value = "";
    await loadLinks();
  });
});

async function loadLinks() {
  const tbody = document.getElementById("linksBody");
  const status = document.getElementById("status");
  const table = document.getElementById("linksTable");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  const res = await fetch(API_BASE);
  const data = await res.json();

   status.classList.add("hidden");

  // 🔥 Show table
  table.classList.remove("hidden");

  if (data.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>No links yet</td></tr>";
    return;
  }

  tbody.innerHTML = "";
  data.forEach((link) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><a href="/${link.code}" target="_blank">${link.code}</a></td>
      <td>${link.target_url}</td>
      <td>${link.total_clicks}</td>
      <td>${link.last_clicked || "-"}</td>
      <td>
        <button onclick="deleteLink('${link.code}')">Delete</button>
        <a href="/code/${link.code}" class="stats-btn">Stats</a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteLink(code) {
  if (!confirm("Delete this link?")) return;

  await fetch(`${API_BASE}/${code}`, {
    method: "DELETE",
  });

  loadLinks();
}
