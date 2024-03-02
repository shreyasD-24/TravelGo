let taxToggle = document.getElementById("flexSwitchCheckDefault");
taxToggle.addEventListener("click", ()=>{
    let taxes = document.querySelectorAll(".tax-price");
    for(tax of taxes){
        if(tax.style.display == "inline"){
            tax.style.display = "none";
        }else{
            tax.style.display = "inline";
        }
    }
})


let mountains = document.querySelector(".mountains");
mountains.addEventListener("click", ()=>{
    let temp = mountains.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let trending = document.querySelector(".trending");
trending.addEventListener("click", ()=>{
    let temp = trending.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let rooms = document.querySelector(".rooms");
rooms.addEventListener("click", ()=>{
    let temp = rooms.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let iconicCities = document.querySelector(".iconicCities");
iconicCities.addEventListener("click", ()=>{
    let temp = iconicCities.innerText.toLowerCase();
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let arctic = document.querySelector(".arctic");
arctic.addEventListener("click", ()=>{
    let temp = arctic.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let castles = document.querySelector(".castles");
castles.addEventListener("click", ()=>{
    let temp = castles.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let amazingPools = document.querySelector(".amazingPools");
amazingPools.addEventListener("click", ()=>{
    let temp = amazingPools.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let camping = document.querySelector(".camping");
camping.addEventListener("click", ()=>{
    let temp = camping.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let farms = document.querySelector(".farms");
farms.addEventListener("click", ()=>{
    let temp = farms.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let coastal = document.querySelector(".coastal");
coastal.addEventListener("click", ()=>{
    let temp = coastal.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});

let nature = document.querySelector(".nature");
nature.addEventListener("click", ()=>{
    let temp = nature.innerText.toLowerCase()
    window.location.href = `https://travelgo-1ev7.onrender.com/listings?category=${temp}`;
});
