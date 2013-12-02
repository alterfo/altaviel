var Map = function() {
    this.markers = [];


    this.createMap = function(canvas, center) {
        var mapOptions = {
            center: center,
            zoom: 16,
            disableDoubleClickZoom: true, // убивает зум по двойному клику
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById(canvas), mapOptions);

        newMarker(center);

        google.maps.event.addListener(this.map, 'dblclick', function(event) {
            replaceMarker(marker, event.latLng);
        });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = this.map.getCenter();
            google.maps.event.trigger(this.map, "resize");
            this.map.setCenter(center);
        });
    };

    this.replaceMarker = function(marker, location) {
        marker.setPosition(location);
    };

    this.newMarker = function(location) {
        var len = markers.length;
        this.markers[len] = new google.maps.Marker({
            draggable: true,
            position: location,
            map: map,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(this.markers[len], 'dragend', function(event) {
            var point = this.markers[len].getPosition();
            getAddress(point);
        });
    };

    this.getAddress = function(location) {
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

    this.myPos = (function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(loc) {
                    return new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);
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
                    return new google.maps.LatLng(55.80, 49.10);
                });
        }
    })();
}


var mapObject = new Map();
var center = mapObject.getAddress(mapObject.myPos);
mapObject.createMap('map-canvas');
mapObject.newMarker(center);
