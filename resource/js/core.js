
// see how I would incorporate any and all transitions (and custom transition) and not just a scrolling animation.








$(function () {

    $('.carousel').html(function() {

        var html = '';
        var cats = [
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food',
            'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport', 'nightlife', 'food'
            ];
        for(var i=1;i<=15;i++) {
            html += '<li data-zcarousel-item-caption="' + i + ') This is caption number ' + i + '<br/> Second line of text" style="background: #' + Math.floor(Math.random() * 16777215).toString(16) + ' url(http://lorempixel.com/800/400/' + cats[i] + '/) no-repeat top left; background-size: cover;"><div class="item-inner"><p>This is item ' + i + '</p></div></li>'
        }

        return html;

    });

    $('.carousel.one').zcarousel({
        orientation: 'horizontal',
        start: 8,
        scroll: 3,
        speed: 1500,
        arrows: false,
        keyPress: true,
        //nav: false,
        //navActiveMarker: false,
        navHtml: function (index, el) {
            //console.log($(this).data());
            return (index + 1);
        },
        //navActiveMarker: false,
        //navActiveMarkerHtml: '<span>THIS IS THE MARKER</span>',
        //navActiveMarkerHtml: $('.test-item-marker').html(),
        /*navActiveMarkerHtml: (function () {
            var test = '';
            for (var i = 0; i < 10;i++) {
                test += '' + 1;
            }
            return test;
        })(),*/
        //scrollStraightToItem: true, // to be implemented. can be 'true', 'false', or object with specifics (example below).
        /*scrollStraightToItem: {
            'onArrowClick': false,
            'onNavClick': true
        }*/
        //autoScrollDelay: 2000,
        //pauseAutoScrollOnHover: true, // this doesn't come in to affect if you hover over the carousel when it is animating from the previous scroll.
        //draggable: false,
        snapToSpeed: 300
    });

})

// need to implement a _snapTo function to the the carousel snaps to the closest li when you let go of dragging. This should maybe change the way the general scroll animation works because it could
// maybe use this new _snapTo function.  The nav could have the active nav marker move when you drag (and scroll obviously, which it currently does). The active nav marker would move with the drag so
// that when you have dragged half way accross one item, the active nav marker would reflect the exact position in the carousel. this could hijack the _snapTo function too by having a snapNavTo
// function or something like that.