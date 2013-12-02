

/**
 * Функция для выставления размеров канваса в зависимости от устройства.
 *
 *
 */
(function adjustCanvas() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map-canvas");
    var mapdiv2 = document.getElementById("map-search-canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '300px';
        mapdiv2.style.width = '100%';
        mapdiv2.style.height = '300px';
    } else {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '300px';
        mapdiv2.style.width = '100%';
        mapdiv2.style.height = '300px';
    }
})();

$(function() {
    var map;
    var map2;
    var marker;
    google.maps.visualRefresh = true;
    /**
     *   Показываем страницу с картой
     */
    $('#map_page').on('pageshow', function(loc) {
        $('#form_page_href').hide();
        var myPosition;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(loc) {
                    myPosition = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
                    showMap(myPosition, 'map-canvas', map, marker);
                    placeMarker(myPosition, map, marker);
                    $('#form_page_href').show();
                },
                // if error

                function(e) {
                    switch (e.code) {
                        case error.PERMISSION_DENIED:
                            $('#message').append = "User denied the request for Geolocation."
                            break;
                        case error.POSITION_UNAVAILABLE:
                            $('#message').append = "Location information is unavailable."
                            break;
                        case error.TIMEOUT:
                            $('#message').append = "The request to get user location timed out."
                            break;
                        case error.UNKNOWN_ERROR:
                            $('#message').append = "An unknown error occurred."
                            break;
                    }
                    myPosition = new google.maps.LatLng(55.80, 49.10);
                    showMap(myPosition, 'map-canvas', map, marker);
                    placeMarker(myPosition, marker, map);
                    $('#message').append('Укажите ваше местоположение вручную');
                    $('#form_page_href').hide();
                });
        }

    });


    $('#search_page').on('pageshow', function(loc) {
        var myPosition;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(loc) {
                myPosition = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
                showMap(myPosition, 'map-search-canvas', map2, marker);
                // TODO: разукрасить маркер
                placeMarker(myPosition, marker, map2);

            }, function(e) {
                switch (e.code) {
                    case error.PERMISSION_DENIED:
                        $('#message').append = "User denied the request for Geolocation."
                        break;
                    case error.POSITION_UNAVAILABLE:
                        $('#message').append = "Location information is unavailable."
                        break;
                    case error.TIMEOUT:
                        $('#message').append = "The request to get user location timed out."
                        break;
                    case error.UNKNOWN_ERROR:
                        $('#message').append = "An unknown error occurred."
                        break;
                }

                myPosition = new google.maps.LatLng(55.80, 49.10);
                showMap(myPosition, 'map-search-canvas', map2, marker);
                $('#message').append('Укажите ваше местоположение вручную');
            });
        }

        //TODO: взять с сервера данные и разместить на карте

    });

    /*
     * Функция помещает маркер на карту, либо перемещает существующий
     * Один маркер на карте
     * Сразу же на него вешается событие по обработке драгэндропа.
     * Координаты передаются функции getAddress для вывода адреса.
     */

    function placeMarker(location, map, marker) {
        if (marker) {
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                draggable: true,
                position: location,
                map: map,
                animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'dragend', function(event) {
                var point = marker.getPosition();
                getAddress(point);
            });

        }
        getAddress(location);
    }

    function showMap(center, canvas, map, marker) {
        var mapOptions = {
            center: center,
            zoom: 16,
            disableDoubleClickZoom: true, // убивает зум по двойному клику
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById(canvas), mapOptions);
        google.maps.event.addListener(map, 'dblclick', function(event) {
            placeMarker(event.latLng, map, marker);
        });
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    }

});







/**
 * Функция принимает координаты в формате gmap.latLng
 * и выводит информацию в поле address.
 * TODO: создать обратный процесс - найти точку по адресу.
 */

function getAddress(latLng) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
            'latLng': latLng
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    document.getElementById('address').value = results[0].formatted_address;
                } else {
                    document.getElementById('address').value = "No results";
                }
            } else {
                document.getElementById('address').value = status;
            }

        });
}
