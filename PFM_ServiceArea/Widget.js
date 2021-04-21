function ocultar(esto) {

  vista = document.getElementById(esto).style.display;
  if (vista == 'none') vista = 'flex';else vista = 'none';

  document.getElementById(esto).style.display = vista;
  document.getElementById(esto).style.flexDirection = 'column';
}

function ocultarPro(bueno, malo1, malo2, malo3, malo4) {
  var vbueno = document.getElementById(bueno).style.display;
  var vmalo1 = document.getElementById(malo1).style.display;
  var vmalo2 = document.getElementById(malo2).style.display;
  var vmalo3 = document.getElementById(malo3).style.display;
  var vmalo4 = document.getElementById(malo4).style.display;

  if (vbueno == 'none') {
    vbueno = 'flex';
    vmalo1 = 'none';
    vmalo2 = 'none';
    vmalo3 = 'none';
    vmalo4 = 'none';
  } else {
    vbueno = 'none';
  }

  document.getElementById(bueno).style.display = vbueno;
  document.getElementById(malo1).style.display = vmalo1;
  document.getElementById(malo2).style.display = vmalo2;
  document.getElementById(malo3).style.display = vmalo3;
  document.getElementById(malo4).style.display = vmalo4;

}
define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',

  "esri/SpatialReference",
  "esri/layers/layer",
  "esri/tasks/FeatureSet",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/ServiceAreaParameters",
  "esri/tasks/QueryTask",
  "esri/tasks/query",

  "esri/toolbars/draw",
  "esri/geometry/Point",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic", 
  "esri/Color",

  "esri/dijit/Search",

  "dojo/on"
], function(
  declare, 
  BaseWidget,
  
  SpatialReference,
  Layer,
  FeatureSet,
  ServiceAreaTask,
  ServiceAreaParameters,
  QueryTask,
  Query,

  Draw,
  Point,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  Graphic,
  Color,

  Search,

  on
  ) {
  
  return declare([BaseWidget], {

    baseClass: 'pfm-service-area',
  
    postCreate: function() {
      this.inherited(arguments);
    },

    onOpen: function(){

      // AL ABRIR EL WIDGET SE ALMACENAN LAS VARIABLES NECESARIAS A LO LARGO DEL CÓDIGO

      var miMapa = this.map;
      
      miMapa.graphics.clear();

      var capaPuntosRecarga = this.map.itemInfo.itemData.operationalLayers[0];

      var miPunto;

      var miUbicacion;

      var miSimboloUbicacion = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_SQUARE, 
        10,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),
        new Color([255,255,255])
      );

      on(dojo.byId("ubicacion"), "click", function(){

        miMapa.graphics.remove(miUbicacion);

        var herramientaDibujo = new Draw(miMapa);
        herramientaDibujo.activate(Draw.POINT);
        herramientaDibujo.on("draw-end", crearPunto);

        function crearPunto(eventoUbicacion){

          miPunto = new Point(eventoUbicacion.geometry);

          miUbicacion = new Graphic(miPunto, miSimboloUbicacion);
          miMapa.graphics.add(miUbicacion);

          herramientaDibujo.deactivate();

          miMapa.centerAndZoom(miPunto, 13);

        };    

      });

      var miBuscadorUbicacion = new Search({map: miMapa, enableInfoWindow: false, autoNavigate: true}, "buscadorUbicacion");
      miBuscadorUbicacion.startup();
      miBuscadorUbicacion.on("select-result", function(eventoBuscadorUbicacion){

        miMapa.graphics.remove(miUbicacion);

        miPunto = new Point(eventoBuscadorUbicacion.result.feature.geometry);

        miUbicacion = new Graphic(miPunto, miSimboloUbicacion);
        miMapa.graphics.add(miUbicacion);

        miBuscadorUbicacion.clear();
        
      });

      on(dojo.byId("seleccion"), "click", function(){

        miMapa.graphics.remove(miUbicacion);

        var herramientaSeleccion = new Draw(miMapa);
        herramientaSeleccion.activate(Draw.EXTENT);
        herramientaSeleccion.on("draw-end", function(eventoSeleccion){

          var consultaSeleccion = new Query();
          consultaSeleccion.geometry = eventoSeleccion.geometry;

          var puntoSeleccionado = capaPuntosRecarga.layerObject.selectFeatures(consultaSeleccion);

          herramientaSeleccion.deactivate();
          
          miPunto = new Point(puntoSeleccionado.results[0][0][0].geometry);

          miUbicacion = new Graphic(miPunto, miSimboloUbicacion);
          miMapa.graphics.add(miUbicacion);

        });

        capaPuntosRecarga.layerObject.clearSelection();

      });
      
      var capa1 = this.capa1
      var capa2 = this.capa2
      var capa3 = this.capa3
      var capa4 = this.capa4
      var capa5 = this.capa5
      var capa6 = this.capa6
      var capa7 = this.capa7
      var capa8 = this.capa8
      var capa9 = this.capa9
      var capa10 = this.capa10
      var capa11 = this.capa11
      var capa12 = this.capa12
      var capa13 = this.capa13
      var capa14 = this.capa14
      var capa15 = this.capa15

      var errorUbicacion = this.hayQueSeleccionarUbicacion;
      var errorImpedancia = this.hayQueSeleccionarImpedancia;

      var impedanciaTiempoPie = this.tiempoPie;
      var impedanciaDistancia = this.distancia;

      on(dojo.byId("tiempoPie"), "click", function(){
        dojo.byId("intervalo1").value = 3;
        dojo.byId("intervalo2").value = 6;
        dojo.byId("intervalo3").value = 12;
      });

      on(dojo.byId("distancia"), "click", function(){
        dojo.byId("intervalo1").value = 250;
        dojo.byId("intervalo2").value = 500;
        dojo.byId("intervalo3").value = 1000;
      });

      on(dojo.byId("ejecutar"), "click", generarAreaServicio);

      function generarAreaServicio(){

        capaPuntosRecarga.layerObject.hide();

        var capasSeleccionadas = [];
        if (capa1.checked == true){capasSeleccionadas.push(capa1.value)};
        if (capa2.checked == true){capasSeleccionadas.push(capa2.value)};
        if (capa3.checked == true){capasSeleccionadas.push(capa3.value)};
        if (capa4.checked == true){capasSeleccionadas.push(capa4.value)};
        if (capa5.checked == true){capasSeleccionadas.push(capa5.value)};
        if (capa6.checked == true){capasSeleccionadas.push(capa6.value)};
        if (capa7.checked == true){capasSeleccionadas.push(capa7.value)};
        if (capa8.checked == true){capasSeleccionadas.push(capa8.value)};
        if (capa9.checked == true){capasSeleccionadas.push(capa9.value)};
        if (capa10.checked == true){capasSeleccionadas.push(capa10.value)};
        if (capa11.checked == true){capasSeleccionadas.push(capa11.value)};
        if (capa12.checked == true){capasSeleccionadas.push(capa12.value)};
        if (capa13.checked == true){capasSeleccionadas.push(capa13.value)};
        if (capa14.checked == true){capasSeleccionadas.push(capa14.value)};
        if (capa15.checked == true){capasSeleccionadas.push(capa15.value)};

        var impedanciaSeleccionada;
        if (impedanciaTiempoPie.checked == true) {
          impedanciaSeleccionada = impedanciaTiempoPie.value;
        } else if (impedanciaDistancia.checked == true) {
          impedanciaSeleccionada = impedanciaDistancia.value;
        };

        if (miPunto == null) {
          errorUbicacion.innerHTML = "Seleccione una ubicación desde la que calcular el área de servicio."
        } else {

          errorUbicacion.innerHTML = ""
          
          var entidades = [];
          entidades.push(miUbicacion);

          var ubicaciones = new FeatureSet();
          ubicaciones.features = entidades

          tareaAreaDeServicio = new ServiceAreaTask("https://localhost:6443/arcgis/rest/services/DatosPFM/NetworkDatasetPFM_NetworkAnalystServices/NAServer/Service%20Area");

          parametrosAreaDeServicio = new ServiceAreaParameters();

          if (impedanciaSeleccionada == "distancia") {
            var intervalo1 = dojo.byId("intervalo1").value;
            var intervalo2 = dojo.byId("intervalo2").value;
            var intervalo3 = dojo.byId("intervalo3").value;
            errorImpedancia.innerHTML = "";
          } else if (impedanciaSeleccionada == "tiempoPie") {
            var intervalo1 = (dojo.byId("intervalo1").value)*(250/3);
            var intervalo2 = (dojo.byId("intervalo2").value)*(250/3);
            var intervalo3 = (dojo.byId("intervalo3").value)*(250/3);
            errorImpedancia.innerHTML = "";
          } else {
            errorImpedancia.innerHTML = "Seleccione una impedancia para calcular el área de servicio";
            return;
          };

          parametrosAreaDeServicio.facilities = ubicaciones;
          parametrosAreaDeServicio.defaultBreaks = [intervalo1, intervalo2, intervalo3];
          parametrosAreaDeServicio.outSpatialReference = miMapa.spatialReference;
          parametrosAreaDeServicio.returnFacilities = false;
          parametrosAreaDeServicio.impedanceAttribute = "Length";

          tareaAreaDeServicio.solve(parametrosAreaDeServicio, function(resultado){
              
            var simboloPoligono = new SimpleFillSymbol(
              "solid",  
              new SimpleLineSymbol("solid", new Color([255,255,255]), 1),
              new Color([0,255,0,0.25])
            );
              
            dojo.forEach(resultado.serviceAreaPolygons,function(areaServicio){
  
              areaServicio.setSymbol(simboloPoligono);
              miMapa.graphics.add(areaServicio);
  
            });
  
            var poligonoConsulta = resultado.serviceAreaPolygons[0].geometry;
            miMapa.setExtent(poligonoConsulta.getExtent(), true);
  
            var consulta = new Query();
            consulta.where = "1=1";
            consulta.outFields = ["*"];
            consulta.geometry = poligonoConsulta;
            consulta.returnGeometry = true;
            consulta.outSpatialReference = new SpatialReference(102100);

            dojo.forEach(capasSeleccionadas, function(parametro){

              var miURLConsulta = miMapa.itemInfo.itemData.operationalLayers[parametro].url;
              var miSimbolo = miMapa.itemInfo.itemData.operationalLayers[parametro].layerObject.renderer.symbol;

              var miTareaDeConsulta = new QueryTask(miURLConsulta);
              miTareaDeConsulta.execute(consulta, function(resultado) {
  
                if (resultado.features.length > 0) {
  
                  for (var i = 0; i < resultado.features.length; i++){
  
                    var geometria = resultado.features[i].geometry;

                    var simboloGenerico = new SimpleMarkerSymbol(
                      SimpleMarkerSymbol.STYLE_SQUARE, 
                      10,
                      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),
                      new Color([0,0,0])
                    );
  
                    punto = new Graphic(geometria, miSimbolo);
  
                    miMapa.graphics.add(punto);
  
                  };
                    
                }; 
  
              });

            });

            miPunto = null;
            impedanciaSeleccionada = "";
  
          }, function(err){
            console.log(err.message);
          });

        }
      
      };

    },

    onClose: function(){

      this.map.graphics.clear();
      this.map.itemInfo.itemData.operationalLayers[0].layerObject.show();     

    },

  });

});

