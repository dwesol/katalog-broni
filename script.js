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
  "9x18",
  "9x19",
  ".45 ACP",
  ".357 MAG",
  ".38 Special",
  "5.56x45",
  "7.62x39"
];

// Funkcja renderująca kategorię
function renderCategory(cat) {
  const currentData = validateKatalog(cat);
  if (!currentData) return;

  // Kalibry - sortowanie
  const kalibry = sortKalibry(new Set(currentData.map(x => x.kaliber)));

  // Podział producentów
  const producenci = [...new Set(currentData.map(x => x.producent))].sort();
  const [glowni, pozostali] = splitProducenci(producenci);

  // Generacja tabeli
  const tableHTML = buildTable(kalibry, glowni, pozostali);
  document.getElementById("table-container").innerHTML = tableHTML;

  // Aktywowanie efektów hover
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
function buildTable(kalibry, glowni, pozostali) {
  let tableHTML = "<table><tr><th>Producent</th>";
  kalibry.forEach(k => {
    tableHTML += `<th>${sanitize(k)}</th>`;
  });
  tableHTML += "</tr>";

  glowni.forEach(p => {
    tableHTML += generateRow(p);
  });

  if (pozostali.length) {
    tableHTML += generateRow("Pozostali", pozostali);
  }

  tableHTML += "</table>";
  return tableHTML;
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
  let timeout;

  models.forEach(m => {
    m.addEventListener("mouseenter", e => {
      timeout = setTimeout(() => {
        img.src = m.dataset.img;
        preview.style.display = "block";
      }, 100);
    });

    m.addEventListener("mousemove", e => {
      const previewWidth = preview.offsetWidth;
      const previewHeight = preview.offsetHeight;

      let x = e.pageX + 20;
      let y = e.pageY + 20;

      if (x + previewWidth > window.innerWidth) x = e.pageX - previewWidth - 20;
      if (y + previewHeight > window.innerHeight) y = e.pageY - previewHeight - 20;

      preview.style.left = x + "px";
      preview.style.top = y + "px";
    });

    m.addEventListener("mouseleave", () => {
      clearTimeout(timeout);
      preview.style.display = "none";
    });
  });
}

// Generowanie wiersza tabeli
function generateRow(producent, grupa = null) {
  let row = "<tr>";
  row += `<td>${sanitize(producent)}</td>`;

  kalibry.forEach(k => {
    let modele;
    if (grupa) {
      modele = currentData.filter(x => grupa.includes(x.producent) && x.kaliber === k);
    } else {
      modele = currentData.filter(x => x.producent === producent && x.kaliber === k);
    }

    row += "<td><ul>";
    modele.forEach(m => {
      row += `<li class="model" data-id="${sanitize(m.model)}" data-img="${sanitize(m.img)}">${sanitize(m.model)}</li>`;
    });
    row += "</ul></td>";
  });

  row += "</tr>";
  return row;
}

// Funkcja wyświetlająca szczegóły modelu
function showDetails(item) {
  if (!item) return;

  const container = document.getElementById("details");
  let html = `<h2>${sanitize(item.model)}</h2><div class="details-top">`;

  // Zdjęcie
  html += `
    <div class="details-img">
      <img src="${sanitize(item.img)}">
    </div>`;

  // Specyfikacja
  html += `<div class="details-spec"><table class="spec-table">`;
  for (let key in item.spec) {
    html += `<tr><td>${sanitize(key)}</td><td>${sanitize(item.spec[key])}</td></tr>`;
  }
  html += `</table></div></div>`;

  // Opis
  html += `<div class="details-desc">${sanitize(item.opis)}</div>`;
  container.innerHTML = html;
  container.style.display = "block";

  window.scrollTo({
    top: container.offsetTop,
    behavior: "smooth"
  });
}
