var myPos;
var browserSupportFlag = new Boolean();
var map;
var map2;
var geocoder = new google.maps.Geocoder();

function getMyPos() {
    var lat = $('#lat').val(),
        long = $('#lat').val();
    if (lat && long) {
        myPos = new google.maps.LatLng(lat, long);
    }

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
            initialLocation = new google.maps.LatLng(55.80, 49.10);
        } else {
            alert("Ваш браузер не поддерживает геолокацию. Вы в Сибири.");
            initialLocation = new google.maps.LatLng(60, 105);
        }
        myPos = initialLocation;
    }
}
getMyPos();


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
};

Map.prototype.getAddress = function(location) {
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
    $('#lat').val(location.ob);
    $('#long').val(location.pb);
}


Map.prototype.newMarker = function(location) {
    getAddress(location);
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

};




$(function() {
    /**
     *   Показываем страницу с картой
     */
    $('#map_page').on('pageshow', function() {
        var map = map || new Map('map-canvas', myPos, []);

        $('#form_page_href').show();
        $('#form_page_href').on('click', function() {

        });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.map.getCenter();
            google.maps.event.trigger(map.map, "resize");
            map.map.setCenter(center);
        });
    });

    $('#search_page').on('pageshow', function(loc) {
        var map2 = map2 || new Map('map-search-canvas', myPos, []);
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map2.map.getCenter();
            google.maps.event.trigger(map2.map, "resize");
            map2.map.setCenter(center);
        });
    });
    //TODO: взять с сервера данные и разместить на карте

});
