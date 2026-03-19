const glowniProducenci = [
"Glock",
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
return kolejnoscKalibrow.indexOf(a) - kolejnoscKalibrow.indexOf(b)
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

const container = document.getElementById("details")

let html = `<h2>${item.model}</h2>`

html += `<img src="${item.img}">`

// tabela specyfikacji
html += `<table class="spec-table">`

for (let key in item.spec){
html += `<tr>
<td>${key}</td>
<td>${item.spec[key]}</td>
</tr>`
}

html += `</table>`

// opis
html += `<p>${item.opis}</p>`

container.innerHTML = html
container.style.display = "block"

window.scrollTo({
top: container.offsetTop,
behavior: "smooth"
})

}
