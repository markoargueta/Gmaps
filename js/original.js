  var map, lat, lng;
    //localStorage.clear();
    localStorage.string_array_puntos = (localStorage.string_array_puntos || '[]');
    var array_puntos = JSON.parse(localStorage.string_array_puntos);
    
    $(function(){

      function enlazarMarcador(e){

       // muestra ruta entre marcas anteriores y actuales
        map.drawRoute({
          origin: [lat, lng],  // origen en coordenadas anteriores
          // destino en coordenadas del click o toque actual
          destination: [e.latLng.lat(), e.latLng.lng()],
          travelMode: 'driving',
          strokeColor: '#000000',
          strokeOpacity: 0.6,
          strokeWeight: 5
        });

        lat = e.latLng.lat();   // guarda coords para marca siguiente
        lng = e.latLng.lng();

        map.addMarker({ lat: lat, lng: lng});  // pone marcador en mapa

        array_puntos.push([lat,lng]);
        localStorage.string_array_puntos = JSON.stringify(array_puntos);
      };

      function geolocalizar(){
        GMaps.geolocate({
          success: function(position){
            if(!array_puntos[0]) {
              lat = position.coords.latitude;  // guarda coords en lat y lng
              lng = position.coords.longitude;
            }else{
              lat = array_puntos[array_puntos.length-1][0] || position.coords.latitude;  // guarda coords en lat y lng
              lng = array_puntos[array_puntos.length-1][1] || position.coords.longitude;
            }
            
            array_puntos.push([lat,lng]);

            map = new GMaps({  // muestra mapa centrado en coords [lat, lng]
              el: '#map',
              lat: lat,
              lng: lng,
              click: enlazarMarcador,
              tap: enlazarMarcador
            });

            pinta_rutas();
            
            map.addMarker({ lat: lat, lng: lng});  // marcador en [lat, lng]
          },
          error: function(error) { alert('Geolocalización falla: '+error.message); },
          not_supported: function(){ alert("Su navegador no soporta geolocalización"); },
        });
      };
      
      function pinta_rutas(){
        for (var i=0; i<array_puntos.length-1; i++){
          map.drawRoute({
            origin: [array_puntos[i][0], array_puntos[i][1]],  // origen en coordenadas anteriores
            // destino en coordenadas del click o toque actual
            destination: [array_puntos[i+1][0], array_puntos[i+1][1]],
            travelMode: 'driving',
            strokeColor: '#000000',
            strokeOpacity: 0.6,
            strokeWeight: 5
          });
          map.addMarker({ lat: array_puntos[i][0], lng: array_puntos[i][1]});
        }
      }

      function inicializar(){
        localStorage.string_array_puntos = '[]';
        array_puntos = JSON.parse(localStorage.string_array_puntos);
        geolocalizar();  
      }
      
      $("#inicializar").on('click', inicializar);

      geolocalizar();
    });