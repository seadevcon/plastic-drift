

//----------------------------------------------------------------------------------------


function getDataIndex(lat, lng){
    lng = Math.floor(lng);
      lat = Math.floor(  lat);
      lat += 90;
    if (lng < 0) {
        lng += 361;
    }
    return (((lat-1) * 361) + lng);
}


function csvToObject(csv){

    var lines= csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++) {

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}


let data = [];

let heatmapInstance;

let mapWidth;
let mapHeight;



function downloadDataNik(lat, lng) {

    let url = 'http://assets.plasticadrift.org/globalfwdCsv/Global_index' + getDataIndex(lat, lng) + '_startsinJan.csv';

    $.ajax({
        url: url,
        type: 'get',

        async: false,

        success: function(response) {

            data = csvToObject(response);

            console.log(data);


            //------------------------------------------------------

           // data = dataNik;

            //Callback
            startSimulation();


        }
    });

}

function startSimulation() {

    let map = $('#heatmap');

    mapWidth = map.width();
    mapHeight = map.height();

    console.log(mapWidth, mapHeight);

    // minimal heatmap instance configuration
    heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: document.querySelector('#heatmap')
    });


    drawEachMonth();
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function convertGeoToPixel(lat, lng){
   // let mapWidth = 860;
   // let mapHeight = 400;

    let mapLonLeft = 180;//-180;
    let mapLonRight = 540;//180;
    let mapLonDelta = mapLonRight - mapLonLeft;

    //http://stackoverflow.com/questions/2103924/mercator-longitude-and-latitude-calculations-to-x-and-y-on-a-cropped-map-of-the/10401734#10401734
    //-169.4531,-44.8403,177.8906,77.9157
    //-180,-56.1700,180,83.6769

    //let mapLatBottom = -56.1700;
    let mapLatBottom = -56;

    let mapLatBottomDegree = mapLatBottom * Math.PI / 180;

    //  global $mapWidth, $mapHeight, $mapLonLeft, $mapLonDelta, $mapLatBottom, $mapLatBottomDegree;

    let x = (lng - mapLonLeft) * (mapWidth / mapLonDelta);

    lat = lat * Math.PI / 180;

    let worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * Math.PI);
    let mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
    let y = mapHeight - ((worldMapWidth / 2 * Math.log((1 + Math.sin(lat)) / (1 - Math.sin(lat)))) - mapOffsetY);

    //console.log(x, y);
    
    return {x:x,y:y};
}



async function drawEachMonth() {

    console.log('DRAWING...');

    /*
    let firstPoint = data[0];
    let fpPixel = convertGeoToPixel(firstPoint.lat, firstPoint.lng);
    console.log(firstPoint);
    console.log(fpPixel);
    */


    let month = 2;

    let i = 1;



    let nextPoint = data[i];

    let len = data.length;

    while (i < len) {

        let monthPoints = [];

        let max = 0;

        while (nextPoint && month === nextPoint.month) {

            //TODO: delegate data reduce
            let val = nextPoint.probability;

            max = Math.max(max, val);

            let geoToPixel = convertGeoToPixel(nextPoint.lat, nextPoint.lng);

            /*
            let finalPoint = {
                x: nextPoint.lat + 50,
                y: nextPoint.lng,
                value: val
            };
            */
            let finalPoint = {
                x: geoToPixel.x,
                y: geoToPixel.y,
                value: val
            };


            monthPoints.push(finalPoint);

            i++;
            nextPoint = data[i];
        }

        heatmapInstance.setData({max:max * 30, data:monthPoints});

        await sleep(200);


        if (i < len) {
            //TODO: fix that shit

            month = nextPoint.month;

            document.getElementById('month').innerHTML = month;
            //$('span#month').val(month);

           // console.log($('span#month'));
            document.getElementById('year').innerHTML = nextPoint['year'];

           // $('#year').val(year);



        }

    }

    data = [];

    document.getElementById('month').innerHTML = 0;
    document.getElementById('year').innerHTML = 0;

    var canvas = heatmapInstance._renderer.canvas;

    $(canvas).remove();

    heatmapInstance = null;



}











