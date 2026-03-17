function renderCategory(cat){

const data = katalog[cat]

const producenci = [...new Set(data.map(x=>x.producent))]
const kalibry = [...new Set(data.map(x=>x.kaliber))]

let html = "<table>"

html += "<tr><th>Producent</th>"

kalibry.forEach(k=>{
html += "<th>"+k+"</th>"
})

html += "</tr>"

producenci.forEach(p=>{

html += "<tr>"
html += "<td>"+p+"</td>"

kalibry.forEach(k=>{

const modele = data.filter(x=>x.producent==p && x.kaliber==k)

html += "<td><ul>"

modele.forEach(m=>{
html += `<li class="model" data-id="${m.model}">${m.model}</li>`
})

html += "</ul></td>"

})

html += "</tr>"

})

html += "</table>"

document.getElementById("table-container").innerHTML = html

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

const previewWidth = preview.offsetWidth
const previewHeight = preview.offsetHeight

const pageWidth = window.innerWidth
const pageHeight = window.innerHeight

let x = e.pageX + 20
let y = e.pageY + 20

// jeśli wychodzi poza prawą krawędź → pokaż po lewej
if (x + previewWidth > pageWidth) {
  x = e.pageX - previewWidth - 20
}

// jeśli wychodzi poza dół → pokaż wyżej
if (y + previewHeight > pageHeight) {
  y = e.pageY - previewHeight - 20
}

preview.style.left = x + "px"
preview.style.top = y + "px"

})

m.addEventListener("mouseleave",()=>{

preview.style.display="none"

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
