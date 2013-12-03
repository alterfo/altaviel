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

var myPos;
var browserSupportFlag = new Boolean();

function getMyPos() {
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            myPos = initialLocation;
        }, function() {
            handleNoGeolocation(browserSupportFlag);
        });
    }
    // Browser doesn't support Geolocation
    else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }

    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
            alert("Геолокация не сработала.");
            initialLocation = new google.maps.LatLng(55.80, 49.10);;
        } else {
            alert("Ваш браузер не поддерживает геолокацию. Вы в Сибири.");
            initialLocation = new google.maps.LatLng(60, 105);;
        }
        myPos = initialLocation;
    }
}
getMyPos();


function getAddress(location) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
            'latLng': location
        },
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $('.address').val(results[0].formatted_address);
                } else {
                    $('.address').val("No results");
                }
            } else {
                $('.address').val(status);
            }

        });
}

var Map = function(canvas, center, markers) {
    this.markers = markers;
    this.canvas = canvas;
    this.center = center;

    var mapOptions = {
        center: this.center,
        zoom: 16,
        disableDoubleClickZoom: true, // убивает зум по двойному клику
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById(this.canvas), mapOptions);

    this.addressField = $('#' + canvas).closest('.address');


    google.maps.event.addDomListener(window, "resize", function() {
        var center = this.map.getCenter();
        google.maps.event.trigger(this.map, "resize");
        this.map.setCenter(center);
    });
}

Map.prototype.newMarker = function(location) {
    var markers = this.markers;
    var len = markers.length;
    markers[len] = new google.maps.Marker({
        draggable: true,
        position: location,
        map: this.map,
        animation: google.maps.Animation.DROP
    });
    var marker = markers[len];

    google.maps.event.addListener(marker, 'dragend', function(event) {
        var point = marker.getPosition();
        getAddress(point);
    });
        google.maps.event.addListener(this.map, 'dblclick', function(event) {
        marker.setPosition(event.latLng);
        getAddress(event.latLng);
    });
        getAddress(location);
};




$(function() {
    google.maps.visualRefresh = true;
    /**
     *   Показываем страницу с картой
     */
    $('#map_page').on('pageshow', function() {
        var map = new Map('map-canvas', myPos, []);
        map.newMarker(myPos);
        $('#form_page_href').show();
    });

    $('#search_page').on('pageshow', function(loc) {
        var map2 = new Map('map-search-canvas', myPos, []);
        map2.newMarker(myPos);

    });
    //TODO: взять с сервера данные и разместить на карте

});
