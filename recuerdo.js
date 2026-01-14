(function () {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("c") || "").trim().toUpperCase();

  const codigoEl = document.getElementById("codigo");
  const tituloEl = document.getElementById("titulo-recuerdo");
  const msgEl = document.getElementById("mensaje");
  const playerEl = document.getElementById("player");

  if (!codigoEl || !tituloEl || !msgEl || !playerEl) return;

  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUekUYBRPXlEo7cHOe0WUH64vUzo-nl87xrEnxIeev1FdsEhBvSpOeOkGI2DFpliKsCeiq_m_AZixC/pub?output=csv";

  codigoEl.textContent = code || "—";

  function showError(title, msg) {
    tituloEl.textContent = title;
    msgEl.textContent = msg;
    playerEl.innerHTML = "";
  }

  if (!code) {
    showError("Falta el código", "Escaneá el QR para abrir tu audio.");
    return;
  }

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(",").map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = (cols[idx] || "").trim();
      });
      rows.push(obj);
    }
    return rows;
  }

  fetch(SHEET_CSV_URL, { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("No se pudo leer la planilla");
      return r.text();
    })
    .then(csvText => {
      const rows = parseCSV(csvText);
      const item = rows.find(r => (r.code || "").toUpperCase() === code);

      if (!item || !item.url) {
        showError(
          "No encontramos tu audio",
          "El código puede estar mal o el audio todavía no fue cargado."
        );
        return;
      }

      // seguridad: si alguien se equivoca con dl=0
      const url = item.url.replace("dl=0", "dl=1");

      tituloEl.textContent = item.title || "Tu audio";
      msgEl.textContent = item.note || "";

      const audio = document.createElement("audio");
      audio.controls = true;
      audio.style.width = "100%";
      audio.src = url;

      playerEl.innerHTML = "";
      playerEl.appendChild(audio);
    })
    .catch(() => {
      showError(
        "Error",
        "No se pudo cargar la base de audios. Probá nuevamente."
      );
    });
})();

