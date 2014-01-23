var data = [{
    id: 1,
    title: 'Сломалась машина',
    descr: 'Аккумулятор сдох, помогите прикурить',
    lat: '11.1111',
    long: '99.9999',
    userinfo: {
        name: 'amIwho',
        rating: 9
    }
}, {
    id: 2,
    title: 'Не успеваю купить билет',
    descr: '',
    lat: '22.2222',
    long: '88.8888',
    userinfo: {
        name: 'amIwho',
        rating: 9
    }
}];

var ls = localStorage;
var clientPosition = getClientPosition();
var geocoder = new google.maps.Geocoder();


function getClientPosition() {
    var string = ls.getItem('cp');
    if (string == null) {
        console.log('В локальном хранилище ничего нет');
        return null;
    }

    var latLng = string.replace(/[()]/g, '').split(",");
    return new google.maps.LatLng(latLng[0], latLng[1]);

}

function updateClientPosition(pos) {
    clientPosition = pos;
    ls.setItem('cp', clientPosition);
}

function show_list_of_requests() {
    var list = '';
    var len = data.length;
    for (var i = 0; i < len; i++) {
        list += '<li>';
        list += '<a href="#map_page" lat="' + data[i].lat + '" long="' + data[i].long + '" class="requestOnMap"><h3>' + data[i].title + '</h3>';
        list += '<p>' + data[i].descr + '</p>';
        list += '</a></li>';
    }

    $('#request_list').html(list);
}



function getAddress(pos) {
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            updateMarkerAddress(responses[0].formatted_address);
        } else {
            updateMarkerAddress('Cannot determine address at this location.');
        }
    });
}

function updateMarkerAddress(str) {
     $('#address').val(str);
}

function updateMarkerPosition(latLng) {
    $('#lat').val(latLng.ob);
    $('#long').val(latLng.pb);
}

function getClientPosition() {
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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
            console.log("Geolocation service failed.");
            clientPosition = clientPosition || new google.maps.LatLng(55.794941, 49.10504400000002)
        } else {
            console.log("Your browser doesn't support geolocation. We've placed you in Siberia.");
            clientPosition = clientPosition || new google.maps.LatLng(60, 105);
        }
    }

    ls.setItem('cp', clientPosition);
    return clientPosition;
}

$('#map-page').on('pageshow', function() {

    clientPosition = clientPosition || getClientPosition();
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: clientPosition,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true
    });

    var marker = new google.maps.Marker({
        position: clientPosition,
        title: 'Я здесь',
        map: map,
        draggable: true
    });

    updateMarkerPosition(clientPosition);
    getAddress(clientPosition);

    google.maps.event.addListener(marker, 'dragstart', function() {
        updateMarkerAddress('Dragging...');
    });
    google.maps.event.addListener(marker, 'drag', function() {
        updateMarkerPosition(marker.getPosition());
    });
    google.maps.event.addListener(marker, 'dragend', function() {
        updateMarkerPosition(marker.getPosition());
        updateClientPosition(marker.getPosition()); 
        getAddress(clientPosition);
    });
    google.maps.event.addListener(map, 'dblclick', function(event) {

        marker.setPosition(event.latLng);
        updateMarkerPosition(marker.getPosition());
        updateClientPosition(marker.getPosition()); 
        getAddress(clientPosition);
        map.panTo(event.latLng);
    });
});


$('#welcome-page').on('pageshow', show_list_of_requests());



$('.requestOnMap').on('vclick', function() {
    console.log($(this).attr('lat'), $(this).attr('long'));
});
