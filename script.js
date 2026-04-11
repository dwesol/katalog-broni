const mapaModeli = {};

// Budowanie mapy modeli na podstawie katalogu
Object.values(katalog).flat().forEach(x => {
  mapaModeli[x.model] = x;
});

const glowniProducenci = [
  "Glock GmbH",
  "Walther",
  "SIG Sauer",
  "Ceska Zbrojovka",
  "Heckler & Koch",
  "Łucznik",
  "Smith & Wesson"
];

const kolejnoscKalibrow = [
  ".22 LR",
  "7.62x25",
  "9x18",
  "9x19",
  ".45 ACP",
  ".357 MAG",
  ".38 Special",
  "5.56x45",
  "7.62x39"
];

let currentView = "table"; // "table" lub "grid"
let currentCategory = "pistolety";
let currentSearch = "";

// Inicjalizacja hash routingu
function initHash() {
  const hash = location.hash.replace("#", "");
  if (hash && katalog[hash]) {
    currentCategory = hash;
  }
}

// Funkcja renderująca kategorię
function renderCategory(cat) {
  currentCategory = cat;
  location.hash = cat;

  const currentData = validateKatalog(cat);
  if (!currentData) return;

  // Aktualizacja liczników na zakładkach
  document.querySelectorAll(".tab-btn").forEach(btn => {
    const btnCat = btn.dataset.category;
    const count = katalog[btnCat] ? katalog[btnCat].length : 0;
    btn.innerHTML = `${btn.dataset.label} <span class="tab-count">${count}</span>`;
    btn.classList.toggle("active", btnCat === cat);
  });

  renderView();
}

// Renderowanie aktualnego widoku (tabela lub karty)
function renderView() {
  const currentData = validateKatalog(currentCategory);
  if (!currentData) return;

  const search = currentSearch.trim().toLowerCase();
  const filteredData = search
    ? currentData.filter(x => x.model.toLowerCase().includes(search))
    : currentData;

  const container = document.getElementById("table-container");

  if (currentView === "grid") {
    container.innerHTML = buildGrid(filteredData);
  } else {
    const kalibry = sortKalibry(new Set(filteredData.map(x => x.kaliber)));
    const producenci = [...new Set(filteredData.map(x => x.producent))].sort();
    const [glowni, pozostali] = splitProducenci(producenci);
    container.innerHTML = buildTable(kalibry, glowni, pozostali, filteredData);
  }

  attachHover();
}

// Walidacja danych katalogu
function validateKatalog(cat) {
  if (!katalog[cat] || !Array.isArray(katalog[cat])) {
    console.error("Nieprawidłowe dane dla kategorii:", cat);
    return null;
  }
  return katalog[cat];
}

// Sortowanie kalibrów według kolejności lub alfabetycznie
function sortKalibry(kalibry) {
  return Array.from(kalibry).sort((a, b) => {
    const indexA = kolejnoscKalibrow.indexOf(a);
    const indexB = kolejnoscKalibrow.indexOf(b);

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b);
    }

    return indexA !== -1 && indexB !== -1 ? indexA - indexB : indexA === -1 ? 1 : -1;
  });
}

// Podział producentów na głównych i pozostałych
function splitProducenci(producenci) {
  const glowni = producenci.filter(p => glowniProducenci.includes(p));
  const pozostali = producenci.filter(p => !glowniProducenci.includes(p));
  return [glowni, pozostali];
}

// Generowanie tabeli HTML
function buildTable(kalibry, glowni, pozostali, currentData) {
  let tableHTML = "<table><tr><th>Producent</th>";
  kalibry.forEach(k => {
    tableHTML += `<th>${sanitize(k)}</th>`;
  });
  tableHTML += "</tr>";

  glowni.forEach(p => {
    tableHTML += generateRow(p, null, kalibry, currentData);
  });

  if (pozostali.length) {
    tableHTML += generateRow("Pozostali", pozostali, kalibry, currentData);
  }

  tableHTML += "</table>";
  return tableHTML;
}

// Generowanie widoku kart
function buildGrid(data) {
  if (!data.length) {
    return `<p class="no-results">Brak wyników wyszukiwania.</p>`;
  }
  let html = `<div class="cards-grid">`;
  data.forEach(item => {
    html += `<div class="card model" data-id="${sanitize(item.model)}" data-img="${sanitize(item.img)}">
      <div class="card-img-wrap">
        <img src="${sanitize(item.img)}" alt="${sanitize(item.model)}" loading="lazy">
      </div>
      <div class="card-info">
        <span class="card-model">${sanitize(item.model)}</span>
        <span class="card-meta">${sanitize(item.producent)} · ${sanitize(item.kaliber)}</span>
      </div>
    </div>`;
  });
  html += `</div>`;
  return html;
}

// Oczyszczanie tekstu HTML
function sanitize(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

// Dodawanie efektów hover
function attachHover() {
  const models = document.querySelectorAll(".model");
  const preview = document.getElementById("preview");
  const img = document.getElementById("preview-img");

  models.forEach(m => {
    m.addEventListener("mouseenter", e => {
      img.src = "";
      img.src = m.dataset.img;
      preview.style.display = "block";
    });

    m.addEventListener("mousemove", e => {
      const previewWidth = preview.offsetWidth;
      const previewHeight = preview.offsetHeight;

      // Używamy clientX/Y (względem viewportu) zamiast pageX/Y
      let x = e.clientX + 20;
      let y = e.clientY + 20;

      if (x + previewWidth > window.innerWidth) x = e.clientX - previewWidth - 20;
      if (y + previewHeight > window.innerHeight) y = e.clientY - previewHeight - 20;

      preview.style.left = x + "px";
      preview.style.top = y + "px";
    });

    m.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });

    m.addEventListener("click", () => {
      const item = mapaModeli[m.dataset.id];
      showDetails(item);
    });
  });
}

// Generowanie wiersza tabeli
function generateRow(producent, grupa = null, kalibry, currentData) {
  let row = "<tr>";
  row += `<td>${sanitize(producent)}</td>`;

  kalibry.forEach(k => {
    let modele;
    if (grupa) {
      modele = currentData.filter(x => grupa.includes(x.producent) && x.kaliber === k);
    } else {
      modele = currentData.filter(x => x.producent === producent && x.kaliber === k);
    }

    if (modele.length === 0) {
      row += `<td class="empty-cell">—</td>`;
    } else {
      row += "<td><ul>";
      modele.forEach(m => {
        row += `<li class="model" data-id="${sanitize(m.model)}" data-img="${sanitize(m.img)}">${sanitize(m.model)}</li>`;
      });
      row += "</ul></td>";
    }
  });

  row += "</tr>";
  return row;
}

// Funkcja wyświetlająca szczegóły modelu
function showDetails(item) {
  if (!item) return;

  const container = document.getElementById("details");
  let html = `<div class="details-box"><div class="details-header">
    <div>
      <h2>${sanitize(item.model)}</h2>
      <p class="details-producer">${sanitize(item.producent)}</p>
    </div>
    <button class="close-btn" onclick="closeDetails()">✕</button>
  </div><div class="details-top">`;

  // Zdjęcie
  html += `
    <div class="details-img">
      <img src="${sanitize(item.img)}" alt="${sanitize(item.model)}">
    </div>`;

  // Specyfikacja
  html += `<div class="details-spec"><table class="spec-table">`;
  for (let key in item.spec) {
    html += `<tr><td>${sanitize(key)}</td><td>${sanitize(item.spec[key])}</td></tr>`;
  }
  html += `</table></div></div>`;

  // Opis
  html += `<div class="details-desc">${item.opis}</div></div>`;
  container.innerHTML = html;
  container.style.display = "flex";

  setTimeout(() => {
    container.classList.add("show");
  }, 10);
}

// Funkcja zamykająca szczegóły
function closeDetails() {
  const container = document.getElementById("details");
  container.classList.remove("show");
  setTimeout(() => {
    container.innerHTML = "";
    container.style.display = "none";
  }, 300);
}

// Przełącznik widoku tabela/karty
function toggleView(mode) {
  currentView = mode;
  document.getElementById("btn-view-table").classList.toggle("active", mode === "table");
  document.getElementById("btn-view-grid").classList.toggle("active", mode === "grid");
  renderView();
}

// Inicjalizacja
initHash();

// Ustawienie etykiet zakładek (przed pierwszym renderem, by liczniki się poprawnie ustawiły)
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.dataset.label = btn.textContent.trim();
});

renderCategory(currentCategory);

// Zamknięcie modalu kliknięciem w overlay
document.getElementById("details").addEventListener("click", function(e) {
  if (e.target === this) closeDetails();
});

// Zamknięcie modalu klawiszem ESC
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeDetails();
});

// Real-time search
document.getElementById("search-input").addEventListener("input", function() {
  currentSearch = this.value;
  renderView();
});
