// wait until DOM is ready
$(document).ready(function(){
    //timeline
    let tl = new TimelineMax({repeat: -1});
    let tl2 = new TimelineMax({repeat: -1});

    //STOP/START Animation
    let start = document.getElementById('start');
    let stop = document.getElementById('stop');
    //getting loader content and waves
    let loaderCon = document.getElementById('loaderCon');
    let waves = document.getElementById('waves');
    //loading banner
    //getting dots
    let dots = document.querySelectorAll('.loaderDot');
    //Transform to array
    let dotsArray = Array.from(dots);

    //staggering Dots
    tl.staggerFrom(dotsArray, 1,{opacity:0}, 1);
    //ON/OFF Animation
    /*loaderCon.style.display = 'none';
    if (start.addEventListener('click', function (e) {
        loaderCon.style.display = 'block';
        tl2.fromTo(waves, 3,{ease: Power0.easeNone, x:-548},{ease: Power0.easeNone, x:0, repeat: -1 });
    }));
    if (stop.addEventListener('click', function (e) {
        loaderCon.style.display = 'none';

    }));*/


});
