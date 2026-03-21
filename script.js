const glowniProducenci = [
"Glock GmbH",
"Walther",
"SIG Sauer"
]

const kolejnoscKalibrow = [
".22 LR",
"9x19",
".45 ACP",
".357 SIG",
".357 Magnum",
"5.56x45",
"7.62x39"
]

// zmienne globalne
let currentData = []
let kalibry = []
let tableHTML = ""


function renderCategory(cat){

currentData = katalog[cat]

// kalibry (globalne)
kalibry = [...new Set(currentData.map(x=>x.kaliber))]

// sortowanie kalibrów
kalibry.sort((a,b)=>{

const indexA = kolejnoscKalibrow.indexOf(a)
const indexB = kolejnoscKalibrow.indexOf(b)

// jeśli obu nie ma → sortuj alfabetycznie
if (indexA === -1 && indexB === -1) {
  return a.localeCompare(b)
}

// jeśli tylko A nie ma → na koniec
if (indexA === -1) return 1

// jeśli tylko B nie ma → na koniec
if (indexB === -1) return -1

// normalne sortowanie
return indexA - indexB

})

// producenci
let producenci = [...new Set(currentData.map(x=>x.producent))]

// sortowanie alfabetyczne
producenci.sort((a,b)=>a.localeCompare(b))

// podział
const glowni = producenci.filter(p=>glowniProducenci.includes(p))
const pozostali = producenci.filter(p=>!glowniProducenci.includes(p))

// start tabeli
tableHTML = "<table>"

// nagłówek
tableHTML += "<tr><th>Producent</th>"

kalibry.forEach(k=>{
tableHTML += "<th>"+k+"</th>"
})

tableHTML += "</tr>"

// główni producenci
glowni.forEach(p=>{
generateRow(p)
})

// pozostali
if (pozostali.length > 0){
generateRow("Pozostali", pozostali)
}

tableHTML += "</table>"

// wstawienie do HTML
document.getElementById("table-container").innerHTML = tableHTML

attachHover()

}

function attachHover(){

const models=document.querySelectorAll(".model")
const preview=document.getElementById("preview")
const img=document.getElementById("preview-img")

models.forEach(m=>{

m.addEventListener("mouseenter",(e)=>{

img.src=m.dataset.img
preview.style.display="block"

})

m.addEventListener("mousemove",(e)=>{

preview.style.left = (e.pageX + 20) + "px"
preview.style.top = (e.pageY + 20) + "px"

})

m.addEventListener("mouseleave",()=>{

preview.style.display="none"

})

})

models.forEach(m=>{

m.addEventListener("click",()=>{

const name = m.dataset.id

const item = Object.values(katalog)
.flat()
.find(x=>x.model === name)

showDetails(item)

})

})
  
}

function showDetails(item){

if (!item) return

const container = document.getElementById("details")

let html = `<h2>${item.model}</h2>`

html += `<div class="details-top">`

// LEWA STRONA (zdjęcie)
html += `
<div class="details-img">
  <img src="${item.img}">
</div>
`

// PRAWA STRONA (specyfikacja)
html += `<div class="details-spec">`
html += `<table class="spec-table">`

for (let key in item.spec){
html += `<tr>
<td>${key}</td>
<td>${item.spec[key]}</td>
</tr>`
}

html += `</table>`
html += `</div>`

html += `</div>` // koniec details-top

// OPIS (na całą szerokość)
html += `<div class="details-desc">${item.opis}</div>`

container.innerHTML = html
container.style.display = "block"

window.scrollTo({
top: container.offsetTop,
behavior: "smooth"
})

}

function generateRow(producent, grupa = null){

let html = "<tr>"
html += `<td>${producent}</td>`

kalibry.forEach(k=>{

let modele

if (grupa){
modele = currentData.filter(x=>grupa.includes(x.producent) && x.kaliber==k)
} else {
modele = currentData.filter(x=>x.producent==producent && x.kaliber==k)
}

html += "<td><ul>"

modele.forEach(m=>{
html += `<li class="model" data-id="${m.model}" data-img="${m.img}">${m.model}</li>`
})

html += "</ul></td>"

})

html += "</tr>"

tableHTML += html

}
