data = [{
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

function make_list_of_requests() {
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

$('#welcome-page').on('pageshow', make_list_of_requests());

$('.requestOnMap').on('vclick', function() { 
    console.log($(this).attr('lat'), $(this).attr('long'));
});