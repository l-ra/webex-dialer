window.addEventListener("load",()=>{
    document.querySelector("#ok").addEventListener("click",()=>{
        const ent = {
            kod:document.querySelector("#kod").value.replace(/[^0-9]+/g,""),
            nazev:s(document.querySelector("#nazev").value),
            telefon:document.querySelector("#telefon").value,
        }
        const stored = loadStored();
        stored[ent.nazev]=ent
        saveStored(stored)
        displayStored(stored);
    })
    const hash = window.location.hash.substring(1)
    if (hash){
        const decodedHash = decodeURIComponent(hash)
        //console.log(decodedHash)
        const fromHash = JSON.parse(decodedHash)
        const stored = loadStored()
        saveStored({...stored,...fromHash})
    }
    displayStored()
})

function loadStored(){
    return ( localStorage['stored'] && JSON.parse(localStorage['stored'] ) ) || {}
}

function saveStored(s){
    localStorage['stored']=JSON.stringify(s,null,"  ")
}

function displayStored(storedIn){
    const stored = storedIn || loadStored();
    const out = document.querySelector("#out");
    out.innerHTML=""
    for ( let key of Object.keys(stored) ){
        const ent = stored[key]
        const href = `tel:${ent.telefon};${ent.kod}${encodeURI('*')}`
        const display = `${ent.nazev}: ${ent.telefon};${ent.kod}*`
        const li = document.createElement("li");
        li.classList.add("list-group-item")
        li.innerHTML = `<div class="d-flex flex-row align-items-center">
          <a class="flex-grow-1" href="${s(href)}">${s(display)}</a> 
          <button class="btn btn-outline-danger" onclick="removeEntry(event)" data-nazev="${s(ent.nazev)}">🗑️</button>
        </div>`
        out.appendChild(li)
    }
    const hash =encodeURIComponent(JSON.stringify(stored))

    window.location.hash=hash
}

//sanitize
function s(x){
    let val = String(x)
    return val.replace(/["'<>]/g,"🥱");
}

function removeEntry(ev){
    const nazev = ev.target.dataset.nazev
    //console.log("remove stored:",nazev)
    const stored = loadStored();
    delete stored[nazev]
    saveStored(stored)
    displayStored(stored)
}