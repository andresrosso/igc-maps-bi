const mapa = document.getElementById("mapatroncales")

const map = L.map(mapa).setView([4.69,-74.1],14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([4.69,-74.1],14).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

const getData = async () => {
    const responsePatios = await fetch('https://datosabiertos.bogota.gov.co/dataset/292c191a-8985-48fa-9e40-cc96021a144d/resource/aae2976f-3b8c-4e32-99db-c3dc4f9c34cf/download/patios-actuales.json')
    const dataPatios = await responsePatios.json();
    patios = dataPatios.features;
    
    
    //const getLine = (nameLine) => patios.filter(patio => patio.attributes.linea.includes(nameLine))

    //const patiosRUTA1 = getLine("PORTAL 80");

    //rutaSelector.addEventListener('change',(e)=>{
        //if(e.target.value == )
    //})

}
 
getData()