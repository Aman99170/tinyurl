const API_BASE = "/api/links";

async function loadStats() {
  const status = document.getElementById("status");
  const statsBox = document.getElementById("statsBox");

  const code = window.location.pathname.split("/")[2]; // /code/XYZ

  try {
    const res = await fetch(`${API_BASE}/${code}`);

    if (!res.ok) {
      status.textContent = "Link not found or deleted.";
      return;
    }

    const data = await res.json();

    // Fill stats
    document.getElementById("codeVal").textContent = data.code;
    document.getElementById("targetVal").textContent = data.target_url;
    document.getElementById("clicksVal").textContent = data.total_clicks;
    document.getElementById("lastVal").textContent = data.last_clicked || "-";

    // Show stats box
    statsBox.classList.remove("hidden");

    // Remove loading
    status.classList.add("hidden");

  } catch (err) {
    status.textContent = "Error loading stats.";
  }
}

loadStats();
