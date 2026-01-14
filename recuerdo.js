(function () {
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("c") || "").trim().toUpperCase();

  const codigoEl = document.getElementById("codigo");
  const tituloEl = document.getElementById("titulo-recuerdo");
  const msgEl = document.getElementById("mensaje");
  const playerEl = document.getElementById("player");

  if (!codigoEl || !tituloEl || !msgEl || !playerEl) return;

  const AUDIO_MAP = {
    "PRUEBA1": {
      url: "https://www.dropbox.com/scl/fi/izfnrb0ugihy0x0u8jpj9/WhatsApp-Ptt-2026-01-14-at-11.05.16.mp3?rlkey=7bguec0tp0a4xaum42z1ibaum&st=pzz810th&dl=1",
      title: "Un recuerdo especial",
      note: "Este mensaje fue grabado con mucho amor 🤍"
    }
  };

  codigoEl.textContent = code || "—";

  if (!code) {
    tituloEl.textContent = "Falta el código";
    msgEl.textContent = "Escaneá el QR para abrir tu audio.";
    return;
  }

  const item = AUDIO_MAP[code];
  if (!item) {
    tituloEl.textContent = "No encontramos tu audio";
    msgEl.textContent = "El código puede estar mal o el audio todavía no fue cargado. Escribinos y lo resolvemos.";
    return;
  }

  tituloEl.textContent = item.title || "Tu audio";
  msgEl.textContent = item.note || "";

  const audio = document.createElement("audio");
  audio.controls = true;
  audio.style.width = "100%";
  audio.src = item.url;

  playerEl.innerHTML = "";
  playerEl.appendChild(audio);
})();
