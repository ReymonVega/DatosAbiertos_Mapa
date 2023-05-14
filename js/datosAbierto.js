let map;
let layer_marcador;

function centrarMapa(fromProjection, toProjection) {
  let lat = 41.3887900;
  let lon = 2.1589900;

  map = new OpenLayers.Map("demoMap");
  var mapnik = new OpenLayers.Layer.OSM();
  var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
  var zoom = 13;

  map.addLayer(mapnik);
  map.setCenter(position, zoom);

  return map;
}

function marcador(fromProjection, toProjection, lon, lat, nom) {
  if (!layer_marcador) {
    layer_marcador = new OpenLayers.Layer.Markers("Marcador");
    map.addLayer(layer_marcador);
  }

  var marker = new OpenLayers.Marker(
    new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection)
  );

  layer_marcador.addMarker(marker);

  marker.events.register("mousedown", marker, function() {
    const popup = new OpenLayers.Popup(
      "popup",
      this.lonlat,
      new OpenLayers.Size(150, 200),
      nom,
      true
    );
    map.addPopup(popup);
  });
}

let click = document.getElementById("enviar");

click.addEventListener("click", function() {
  event.preventDefault();
  let fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  let toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

  let latitud = document.getElementById("latitud").value;
  let longitud = document.getElementById("longitud").value;
  let nom = document.getElementById("nom").value;

  marcador(fromProjection, toProjection, longitud, latitud, nom);
});

function buscarMuseu() {
  let xhr = new XMLHttpRequest();
  let url = `http://dades.eicub.net/api/1/ateneus`;

  xhr.onreadystatechange = function() {
    if (this.status == 200 && this.readyState == 4) {
      let datos = JSON.parse(this.responseText);

      for (let i = 0; i < datos.length; i++) {
        let fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        let toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

        marcador(
          fromProjection,
          toProjection,
          datos[i].Longitud,
          datos[i].Latitud,
          datos[i].Equipament
        );
      }
    }
  };

  xhr.open("GET", url);
  xhr.send();
}

function inicio() {
  const fromProjection = new OpenLayers.Projection("EPSG:4326");
  const toProjection = new OpenLayers.Projection("EPSG:900913");

  const map = centrarMapa(fromProjection, toProjection);
  buscarMuseu();
}

window.addEventListener("load", inicio);
