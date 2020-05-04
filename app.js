/* // Iniciar leaflet.js
var L = require('leaflet');
require ('leaflet.locatecontrol') */

/*	Basemap */
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, CNES - DataSus, Mappea'
});

/* Dados */

// icones
var orangeC = L.icon({
    iconUrl: 'img/circulo-orange.png',
    iconSize: [13,13]
});

var blueC = L.icon ({
    iconUrl: 'img/circulo-blue.png',
    iconSize: [13,13]
});

var hospIcon = L.icon ({
    iconUrl: 'img/hospital.png',
    iconSize: [16,15]
});

var poliC = L.icon({
    iconUrl: 'img/polic.png',
    iconSize: [15,15]
})

//postos de atendimento
var hospitaisL = L.layerGroup();

var hospitais = $.getJSON("data/hospitais.geojson",function(data){
    L.geoJson(data,{
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {icon: hospIcon})
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup("<strong>"+feature.properties.Name+"</strong><br/> Tipo de Atendimento: " + feature.properties.SITUACAO + "<br/>Você poderá ser direcionado à este local em caso de sintomas graves.<br/>")
        }
    }).addTo(hospitaisL);
});

var policlinicaL = L.layerGroup();

var policlinica =$.getJSON("data/policlinica.geojson",function(data){
    L.geoJson(data,{
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {icon: poliC})
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup("<strong>"+feature.properties.Name+"</strong><br/> Tipo de Atendimento: " + feature.properties.SITUACAO + "<br/>Você deve ir à este local em caso de sintomas leves.<br/>A Policlinica <strong> NÃO FAZ TESTAGEM.</strong>")
        }
    }).addTo(policlinicaL);
});

var UPAS = L.layerGroup();

var UPA = $.getJSON("data/UPA.geojson",function(data){
    L.geoJson(data,{
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {icon: orangeC})
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup("<strong>"+feature.properties.Name+"</strong><br/> Tipo de Atendimento: " + feature.properties.SITUACAO + "<br/>Você poderá ser direcionado à este local em caso de sintomas graves.")
        }
    }).addTo(UPAS);
}); 

var UBSs = L.layerGroup();

var UBS = $.getJSON("data/UBS.geojson",function(data){
    L.geoJson(data,{
        pointToLayer: function (feature, latlng){
            return L.marker(latlng, {icon: blueC})
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup("<strong>"+feature.properties.Name+"</strong><br/> Tipo de Atendimento: " + feature.properties.SITUACAO+ "<br/>Você deve ir à este local em caso de sintomas leves.<br/>As UBS <strong> NÃO FAZEM TESTAGEM.</strong>")
        }
    }).addTo(UBSs);
});


// acessibilidade
var acessibilidadeL = L.layerGroup();

var acessibilidade = $.getJSON("acessibilidade.geojson", function(acessData){
    L.geoJSON(acessData, {
        style: function(feature){
            var fillColor,
                tempo = feature.properties.AA_MINS;
            if (tempo == 5) fillColor = "#ffffcc";
            else if (tempo == 10) fillColor = "#41b6c4";
            else if (tempo == 15) fillColor = "#253494";
            return {color:"#999",weight:0.02, fillColor: fillColor, fillOpacity: .3};
        },
        onEachFeature:function(feature, layer){
            layer.bindPopup("A partir dessa área, em aproximadamente " + "<strong>" + feature.properties.Name + "</strong>" + "<br/> é possível chegar a posto de atendimento, de carro.")
        }
    }).addTo(acessibilidadeL);
});

// Iniciar o mapa
var map = L.map('map', {center:[-1.32650735, -48.44244689], zoom: 11, layers:[osm_mapnik,hospitaisL,policlinicaL,UPAS,UBSs,acessibilidadeL]  });
  
  // Posição e zoom inicial
//map.setView([-1.32650735, -48.44244689], 11);

var baseMaps = {
    "Basemap": osm_mapnik
};

var overlayMaps = {
    "<img src='img/hospital.png'> <span class = 'my-layer-item'>Hospitais</span>":hospitaisL,
    "<img src='img/polic.png'> <span class = 'my-layer-item'>Policlinica</span>":policlinicaL,
    "<img src='img/circulo-orange.png', height='10'> <span class = 'my-layer-item'>UPAs</span>":UPAS,
    "<img src='img/circulo-blue.png' height='10'> <span class = 'my-layer-item'>UBSs</span>":UBSs
};

var lc = L.control.locate({
    position: 'topright',
    strings: {
        title: "Mostrar minha localização"
    }
}).addTo(map);

L.control.layers(baseMaps,overlayMaps, {collapsed: false}).addTo(map);


var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Acessibilidade</h4>";
  div.innerHTML += '<i style="background: #ffffcc"></i><span>5 minutos</span><br>';
  div.innerHTML += '<i style="background: #41b6c4"></i><span>10 minutos</span><br>';
  div.innerHTML += '<i style="background: #253494"></i><span>15 minutos</span><br>';
  

  return div;
};

legend.addTo(map);
