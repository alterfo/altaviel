var map;
var marker;
// simply new look
google.maps.visualRefresh = true;

$(function() {
    $('#map_page').on('pageshow', function(e) {
        $('#form_page_href').hide();
        navigator.geolocation.getCurrentPosition(function(loc) {
            if (loc) {
                var myPosition = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
                showMap(myPosition);
                placeMarker(myPosition);
                $('#form_page_href').show();
            } else {

                showMap();
                $('#message').append('Укажите ваше местоположение вручную');
                $('#form_page_href').hide();
                $('#find_by_addr').closest('.ui-btn').show();
            }
        });
    });
});



function showMap(center) {
    var mapOptions = {
        center: center || new google.maps.LatLng(55.80, 49.10),
        zoom: 16,
        disableDoubleClickZoom: true, // убивает зум по двойному клику
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    google.maps.event.addListener(map, 'dblclick', function(event) {
        placeMarker(event.latLng);
    });
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
}

/*
 * Функция помещает маркер на карту, либо перемещает существующий
 * Один маркер на карте
 * Сразу же на него вешается событие по обработке драгэндропа.
 * Координаты передаются функции getAddress для вывода адреса.
 */

function placeMarker(location) {
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

/**
 * Функция для выставления размеров канваса в зависимости от устройства.
 *
 *
 */
(function adjustCanvas() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map-canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '300px';
    } else {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '300px';
    }
})();
