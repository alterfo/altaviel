var myPos;
var browserSupportFlag = new Boolean();
var map;
var map2;
var geocoder = new google.maps.Geocoder();
var marker;

var Singleton = {
    myPos: null

}

function Map(canvas, center) {
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

Map.prototype.getMyPos = function() {
    var lat = $('#lat').val(),
        long = $('#lat').val();
    if (lat && long) {
        myPos = new google.maps.LatLng(lat, long);
        return;
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

Map.prototype.getAddress = function(loc) {
    geocoder.geocode({
            'latLng': loc
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
    if (loc) {
        $('#lat').val(loc.ob || 0);
        $('#long').val(loc.pb || 0);
    }


}


Map.prototype.newMarker = function(location) {
    this.getAddress(location);
    var map = this.map;
    marker = marker || new google.maps.Marker({
        draggable: true,
        position: location,
        map: map,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, 'dragend', function(event) {
        var point = marker.getPosition();
        Map.prototype.getAddress(point);
        map.panTo(point);
    });
    google.maps.event.addListener(map, 'dblclick', function(event) {
        marker.setPosition(event.latLng);
        Map.prototype.getAddress(event.latLng);
        map.panTo(event.latLng);
    });

};


myPos = myPos || Map.prototype.getMyPos();

$(function() {
    /**
     *   Показываем страницу с картой
     */
    $('#map_page').on('pageshow', function() {
        map = map || new Map('map', myPos);

        map.newMarker(myPos);
        $('#form_page_href').show();

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.map.getCenter();
            google.maps.event.trigger(map.map, "resize");
            map.map.setCenter(center);
        });
    });

    $('#form_page').on('pageshow', function() {
        $('#submit_request').on('vclick', function(e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/requests',
                data: $('#request_form').serialize(),
                dataType: 'json',
                success: $.mobile.changePage('#map_page')
            });
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
