

function offsetToGeo(clickX, clickY) {

    //TODO: map offset

    var map = $('#heatmap');

    let width = map.width();
    let height = map.height();

    let lat = (clickY / (height / 180) -90) / -1;
    let lng = (clickX / (width / 360)) -180;

    return {lat:lat.toFixed(1), lng:lng.toFixed(1)};
}


// Click on in svg ...
$('#svg').click(function(event) {
    var target = $( event.target );
    if (target.is( "svg" )) {

        let clickX = event.offsetX;
        let clickY = event.offsetY;



        let geoClick = offsetToGeo(clickX, clickY);

        document.getElementById('lat').innerHTML = geoClick.lat;
        document.getElementById('lng').innerHTML = geoClick.lng;
        document.getElementById('country').innerHTML = 'Ocean';

        console.log('Water:', clickX, clickY, geoClick.lat, geoClick.lng);

        downloadDataNik(geoClick.lat, geoClick.lng);
    }

    else {

        let clickX = event.offsetX;
        let clickY = event.offsetY;

        let geoClick = offsetToGeo(clickX, clickY);

        document.getElementById('lat').innerHTML = geoClick.lat;
        document.getElementById('lng').innerHTML = geoClick.lng;
        document.getElementById('country').innerHTML = target.attr('data-name');



        let countryName = target.attr('data-name');
        console.log('Land:', countryName, clickX, clickY, geoClick.lat, geoClick.lng);

    }

});