(function ($) {

    //"use strict"
    var namespace = 'zcarousel';
    var namespace_lc = namespace.toLowerCase();

    /************************************************************************/
    /** PRIVATE METHODS START                                              **/
    /************************************************************************/

    function _showError(name, message) {

        //try {
        var err = new Error();
        err.name = name;
        err.message = message;
        //throw (err);

        //} catch (err) {

        // deprecated.
        //if ($.browser.msie) {
        //	alert(err.name + ':\n' + err.message);
        //} else if ($.browser.webkit) {
        //	alert(err.name + ':\n' + err.message);
        //} else if ($.browser.mozilla && console) {
        //	console.debug(err);

        if (console) {

            console.error(err.name + ' ' + err.message);

        } else {

            alert(err.name + '\n' + err.message);

        }
        //}

    }

    // _privateFunction.apply(this, ['hello', 'hello2']);
    //function _privateFunction(parameter, parameter) {
    //var $this = $(this);
    //var settings = $this.data("settings");
    //}

    function _setupCarousel() {

        var $this = $(this);
        var i, j;

        var from = $this.data(namespace_lc + '.items').currentPosition - $this.data(namespace_lc + '.settings').scroll;
        var to = $this.data(namespace_lc + '.items').currentPosition + $this.data(namespace_lc + '.settings').scroll;
        var focus = $this.data(namespace_lc + '.settings').scroll;

        _buildCarouselItems.apply(this, [from, to, focus]);

        var ulHeight, ulWidth;

        if ($this.data(namespace_lc + '.settings').orientation == 'horizontal') {

            ulHeight = $this.data(namespace_lc + '.items').height;
            ulWidth = ($this.data(namespace_lc + '.items').width * $this.data(namespace_lc + '.items').count);
            //$this.data(namespace_lc + '.items').offsetLeft = ($this.data(namespace_lc + '.items').outerWidth * $this.data(namespace_lc + '.settings').scroll * (-1));
            //$this.css({
            //'left': $this.data(namespace_lc + '.items').offsetLeft + 'px'
            //});

        } else if ($this.data(namespace_lc + '.settings').orientation == 'vertical') {

            ulHeight = ($this.data(namespace_lc + '.items').height * $this.data(namespace_lc + '.items').count);
            ulWidth = $this.data(namespace_lc + '.items').width;
            //$this.data(namespace_lc + '.items').offsetTop = ($this.data(namespace_lc + '.items').outerHeight * $this.data(namespace_lc + '.settings').scroll * (-1));
            //$this.css({
            //'top': $this.data(namespace_lc + '.items').offsetTop + 'px'
            //});

        } else if ($this.data(namespace_lc + '.settings').orientation == 'both') {

        }

        $this.closest('.' + namespace_lc + '-carousel-clip')
            //.width(($this.data(namespace_lc + '.items').outerWidth * $this.data(namespace_lc + '.settings').columns))
            .height(($this.data(namespace_lc + '.items').height * $this.data(namespace_lc + '.settings').rows))
            .css({
                'overflow': 'hidden'
            })
            .end()
            .css({
                'height': ulHeight +'px',
                'width': ulWidth + 'px'
            });

    }

    // index from, index to, and item number of the set created with the from and to. e.g. (3, 7, 2).
    function _buildCarouselItems(from, to, focus) {

        //console.log("from: " + from);
        //console.log("to: " + to);
        //console.log("focus: " + focus);

        var $this = $(this);

        // remove all the items from the <ul>. ready to populate with relevant <li>s
        $this.find('li').remove();

        // build initial <ul> <li>s. This could be faster, but it is the easiest and cleanest way of doing it. (.append() method is being called each time the loop runs, this is slow).
        if (from < to) {

            for (var i = from ; i <= to ; i++) {

                j = i < 0 ? (i + $this.data(namespace_lc + '.items').count) : i;

                if (i < 0) {
                    j = i + $this.data(namespace_lc + '.items').count;
                } else if (i >= $this.data(namespace_lc + '.items').count) {
                    j = i - $this.data(namespace_lc + '.items').count;
                }
                $this.data(namespace_lc + '.items').items.filter(':eq(' + j + ')').appendTo($this);
            }

        } else {

            for (var i = from; i < $this.data(namespace_lc + '.items').count;i++) {
                $this.data(namespace_lc + '.items').items.filter(':eq(' + i + ')').appendTo($this);
            }

            for (var i = 0; i <= to; i++) {
                $this.data(namespace_lc + '.items').items.filter(':eq(' + i + ')').appendTo($this);
            }

        }


        if ($this.data(namespace_lc + '.settings').orientation == 'horizontal') {

            $this.data(namespace_lc + '.items').offsetLeft = ($this.data(namespace_lc + '.items').outerWidth * focus * (-1));
            $this.css({
                'left': $this.data(namespace_lc + '.items').offsetLeft + 'px'
            });

        } else if ($this.data(namespace_lc + '.settings').orientation == 'vertical') {

            $this.data(namespace_lc + '.items').offsetTop = ($this.data(namespace_lc + '.items').outerHeight * focus * (-1));
            $this.css({
                'top': $this.data(namespace_lc + '.items').offsetTop + 'px'
            });
        }

        $this.data(namespace_lc + '.items').from = from;
        $this.data(namespace_lc + '.items').to = to;
        $this.data(namespace_lc + '.items').focus = focus;
    }

    function _createNavigation(userFunction) {

        var $this = $(this);
        var navEl = '<ul class="' + namespace_lc + '-carousel-nav">';
        var j;
        var activeClass;
        var customString;
        var customFunctionResult;

        $this.data(namespace_lc + '.items').items.each(function (index, el) {

            customFunctionResult = userFunction.apply($this, [index, el]);

            activeClass = index == $this.data(namespace_lc + '.items').currentPosition ? 'active' : '';
            customString = typeof customFunctionResult == 'string' || typeof customFunctionResult == 'number' ? customFunctionResult : (index + 1);

            navEl += '<li class="' + namespace_lc + '-carousel-nav-item ' + activeClass + '"><a href="#" data-zcarousel-nav-id="' + index + '">' + customString + '</a></li>';
            
        });

        var navActiveMarkerHtml = $this.data(namespace_lc + '.settings').navActiveMarkerHtml;

        if (typeof navActiveMarkerHtml != 'string' && typeof navActiveMarkerHtml != 'number') {
            navActiveMarkerHtml = '';
        }

        if ($this.data(namespace_lc + '.settings').navActiveMarker) {
            navEl += '<li class="' + namespace_lc + '-carousel-nav-item-active-marker">' + navActiveMarkerHtml + '</li></ul>';
        }

        navEl = $(navEl);
        
        if ($this.data(namespace_lc + '.settings').navActiveMarker) {
            navEl.find('.' + namespace_lc + '-carousel-nav-item-active-marker').css({
                'position': 'absolute',
                'top': 0,
                'left': navEl.find('.active').position().left + 'px',
            });
        }
        $this.after(navEl);
        
        if ($this.data(namespace_lc + '.settings').navActiveMarker) {
            navEl.find('.' + namespace_lc + '-carousel-nav-item-active-marker').css({
                'left': navEl.find('.active').position().left + 'px'
            });
        }
        navEl.on('mouseenter', $this, function () {
            $(this).addClass(namespace_lc + '-carousel-state-hover');
        }).on('mouseleave', $this, function () {
            $(this).removeClass(namespace_lc + '-carousel-state-hover');
        }).find('li').on('mouseenter', $this, function () {
            $(this).addClass(namespace_lc + '-carousel-state-hover');
        }).on('mouseleave', $this, function () {
            $(this).removeClass(namespace_lc + '-carousel-state-hover');
        }).find('a').on('click', $this, function (e) {
            e.preventDefault();
            $this[namespace]('scrollTo', (parseInt($(this).attr('data-' + namespace_lc + '-nav-id'), 10) + 1));
        });

        _updateActiveNavItem.apply(this, [$this.data(namespace_lc + '.items').currentPosition]);

    }

    // this is needs to be amended because there are hard-coded numbers in this function.
    function _updateActiveNavItem(index, speed) {

        var $this = $(this);
        var navLis = $this.siblings('.' + namespace_lc + '-carousel-nav').find('li.' + namespace_lc + '-carousel-nav-item');
        navLis.removeClass('active').filter(':eq(' + index + ')').addClass('active');

        speed = speed || $this.data(namespace_lc + '.settings').speed;
        
        // animate the marker if it is there.
        if ($this.data(namespace_lc + '.settings').navActiveMarker) {
            navLis
                .filter(':eq(0)')
                .siblings('.' + namespace_lc + '-carousel-nav-item-active-marker')
                .addClass(namespace_lc + '-carousel-nav-item-active-marker-animating')
                .animate({ 'left': navLis.filter('.active').position().left + 'px' }, speed, function () {
                    $(this).removeClass(namespace_lc + '-carousel-nav-item-active-marker-animating');
                    $this.data(namespace_lc + '.isAnimating', false);
                });

        // or set only animation indicator to false.
        } else {
            $this.data(namespace_lc + '.isAnimating', false);
        }

    }
    function _getArrayItemValue(array, value) {

        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
        return false;
    }

    // returns the modulus of the scroll value with respect to the total item count.
    function _getFriendlyScrollValue(scrollValue) {

        var $this = $(this);

        // make the scroll positive and divide it down to a number less than the
        // total number of items to save us some work.
        scrollValue = Math.abs(scrollValue);

        if (scrollValue == $this.data(namespace_lc + '.items').count) {

            scrollValue = 0;

        } else if (scrollValue > $this.data(namespace_lc + '.items').count) {

            scrollValue = scrollValue % $this.data(namespace_lc + '.items').count;

        }

        return scrollValue;
    }

    function _createGUID() {

        var $this = $(this);

        $this.data(namespace_lc + '.GUID', 'xxxxxx-xxxxxxxxx-xxx-xxxxxx-xxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));

        return $this.data(namespace_lc + '.GUID');
    }

    function _getGUID() {

        return $this.data(namespace_lc + '.GUID');
    }

    // custom standalone draggable function.
    function _dragCar(el) {

        var $this = $(this);
        var el = el || $this;

        el.data(namespace_lc + '.dragcar', {
            'dragging': false,
            'startPosition': {
                'top': el.position().top,
                'left': el.position().left,
            },
            'axis': $this.data(namespace_lc + '.settings').orientation == 'horizontal' ? 'x' : $this.data(namespace_lc + '.settings').orientation == 'vertical' ? 'y' : 'xy',
            'dragStart': 0, // timestamp
            'dragEnd': 0, // timestamp
            'dragDistance': 0, // distance in pixels
            'dragSpeed': 0, // duration / distance
            'dragDuration': 0, // in milliseconds. calculated from dragStart and dragEnd.
            'cssProp': $this.data(namespace_lc + '.settings').orientation == 'horizontal' ? 'left' : $this.data(namespace_lc + '.settings').orientation == 'vertical' ? 'top' : 'left and top'
        });


        var mouseDownEvent = (document.ontouchstart !== null) ? 'mousedown' : 'touchstart';
        var mouseMoveEvent = (document.ontouchstart !== null) ? 'mousemove' : 'touchmove';
        var mouseUpEvent = (document.ontouchstart !== null) ? 'mouseup' : 'touchend';

        //alert(mouseDownEvent + ' ' + mouseUpEvent + ' ' + mouseMoveEvent);
        // this needs work.
        // doesn't work on iphone properly.
        // drags but new location is not updated for start of next dragging.

        el.on(mouseDownEvent, function (e) {

            // for mobile.
            if (mouseDownEvent != 'mousedown') {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            }

            e.preventDefault();
            el.data(namespace_lc + '.dragcar').dragging = true;

            el.data(namespace_lc + '.dragcar').cursorPosition = {
                'top': e.pageY,
                'left': e.pageX
            };

            el.data(namespace_lc + '.dragcar').dragStart = Date.now();

        });
        
        $(document).on(mouseMoveEvent, el, function (e) {

            if (mouseMoveEvent != 'mousemove') {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            }

            if (el.data(namespace_lc + '.dragcar').dragging) {

                if (el.data(namespace_lc + '.dragcar').axis.indexOf('x') != -1) {
                    el[0].style[$this.data(namespace_lc + '.dragcar').cssProp] = parseInt(el.data(namespace_lc + '.dragcar').startPosition[$this.data(namespace_lc + '.dragcar').cssProp], 10) + parseInt(e.pageX, 10) - parseInt(el.data(namespace_lc + '.dragcar').cursorPosition[$this.data(namespace_lc + '.dragcar').cssProp], 10) + 'px';
                }
                if (el.data(namespace_lc + '.dragcar').axis.indexOf('y') != -1) {
                    el[0].style.top = parseInt(el.data(namespace_lc + '.dragcar').startPosition.top, 10) + parseInt(e.pageY, 10) - parseInt(el.data(namespace_lc + '.dragcar').cursorPosition.top, 10) + 'px';
                }

            }

        })

        $(document).on(mouseUpEvent, el, function (e) {

            if (mouseUpEvent != 'mouseup') {
                e.pageX = e.originalEvent.touches[0].pageX;
                e.pageY = e.originalEvent.touches[0].pageY;
            }

            // use the below time time/distance to work out how fast the drag was.
            el.data(namespace_lc + '.dragcar').dragEnd = Date.now();
            el.data(namespace_lc + '.dragcar').dragDuration = ((el.data(namespace_lc + '.dragcar').dragEnd - el.data(namespace_lc + '.dragcar').dragStart) / 1000);
            el.data(namespace_lc + '.dragcar').dragDistance = (el.data(namespace_lc + '.dragcar').startPosition[$this.data(namespace_lc + '.dragcar').cssProp] - el[0].style[$this.data(namespace_lc + '.dragcar').cssProp].replace('px', ''));
            el.data(namespace_lc + '.dragcar').dragSpeed = (el.data(namespace_lc + '.dragcar').dragDistance / el.data(namespace_lc + '.dragcar').dragDuration).toFixed(2) * 1;

            el.data(namespace_lc + '.dragcar').dragging = false;
            el.data(namespace_lc + '.dragcar').startPosition.top = el[0].style.top.replace('px', '');
            el.data(namespace_lc + '.dragcar').startPosition[$this.data(namespace_lc + '.dragcar').cssProp] = el[0].style[$this.data(namespace_lc + '.dragcar').cssProp].replace('px', '');

            if ((Math.abs($this.data(namespace_lc + '.dragcar').dragSpeed) > 0) && Math.abs($this.data(namespace_lc + '.dragcar').dragDistance) > 0) {
                _snapTo.apply(el);
            }


        }); /*.on('mouseleave', function () {

            if ($this.data(namespace_lc + '.dragcar').dragging) {

                $this.data(namespace_lc + '.dragcar').dragging = false;
                $this[0].style.top = $this.data(namespace_lc + '.dragcar').startPosition.top;
                $this[0].style.left = $this.data(namespace_lc + '.dragcar').startPosition.left;
                $this.data(namespace_lc + '.dragcar').startPosition.top = $this[0].style.top.replace('px', '');
                $this.data(namespace_lc + '.dragcar').startPosition.left = $this[0].style.left.replace('px', '');

                _snapTo.apply(this);

            }

        });*/

    }

    // snaps to nearest item.
    function _snapTo() {

        var $this = $(this);
        var $thisPos = $this.position()[$this.data(namespace_lc + '.dragcar').cssProp];
        var itemNumber;

        if ($this.data(namespace_lc + '.dragcar').cssProp == 'left') {
            itemNumber = Math.round(Math.abs($thisPos / $this.data(namespace_lc + '.items').width) + parseInt(($this.children(':eq(0)').attr('data-' + namespace_lc + '-id')), 10));
        } else if ($this.data(namespace_lc + '.dragcar').cssProp == 'top') {
            itemNumber = Math.round(Math.abs($thisPos / $this.data(namespace_lc + '.items').height) + parseInt(($this.children(':eq(0)').attr('data-' + namespace_lc + '-id')), 10));
        }

        // if drag speed is fast enough, snapTo next item.
        //
        //
        //
        //
        //
        //
        //
        //
        //
        // this is needs to test wether you let go before or after the half way point of an item.
        if ((Math.abs($this.data(namespace_lc + '.dragcar').dragSpeed) >= 700) 
            && (Math.abs($this.data(namespace_lc + '.dragcar').dragDistance) > ($this.data(namespace_lc + '.items').width / 7))
            && (Math.abs($this.data(namespace_lc + '.dragcar').dragDistance) < ($this.data(namespace_lc + '.items').width / 2))) {

            itemNumber = $this.data(namespace_lc + '.dragcar').dragDistance < 0 ? itemNumber -= 1 : itemNumber += 1;

            if(itemNumber >= $this.data(namespace_lc + '.items').count) {
                itemNumber -= $this.data(namespace_lc + '.items').count;
            } else if(itemNumber < 0) {
                itemNumber += $this.data(namespace_lc + '.items').count;
            }
        }

        var animation = {};
        animation[$this.data(namespace_lc + '.dragcar').cssProp] = -$this.data(namespace_lc + '.items').items.filter('[data-' + namespace_lc + '-id=' + itemNumber + ']').position()[$this.data(namespace_lc + '.dragcar').cssProp] + 'px';

        $this.animate(animation, $this.data(namespace_lc + '.settings').snapToSpeed, function () {

            $this.data(namespace_lc + '.dragcar').startPosition.top = $this[0].style.top.replace('px', '');
            $this.data(namespace_lc + '.dragcar').startPosition[$this.data(namespace_lc + '.dragcar').cssProp] = $this[0].style[$this.data(namespace_lc + '.dragcar').cssProp].replace('px', '');
            var scrollAmount = $this.data(namespace_lc + '.items').currentPosition - itemNumber;
            $this.data(namespace_lc + '.items').currentPosition = itemNumber;

            var nextFrom = $this.data(namespace_lc + '.items').from - scrollAmount;
            var nextTo = $this.data(namespace_lc + '.items').to - scrollAmount;

            if (nextFrom < 0) {
                nextFrom += $this.data(namespace_lc + '.items').count;
            } else if (nextFrom >= $this.data(namespace_lc + '.items').count) {
                nextFrom -= $this.data(namespace_lc + '.items').count;
            }

            if (nextTo < 0) {
                nextTo += $this.data(namespace_lc + '.items').count;
            } else if (nextTo >= $this.data(namespace_lc + '.items').count) {
                nextTo -= $this.data(namespace_lc + '.items').count;
            }

            _buildCarouselItems.apply(this, [nextFrom, nextTo, $this.data(namespace_lc + '.items').focus]);

            $this.data(namespace_lc + '.dragcar').startPosition.top = $this[0].style.top.replace('px', '');
            $this.data(namespace_lc + '.dragcar').startPosition[$this.data(namespace_lc + '.dragcar').cssProp] = $this[0].style[$this.data(namespace_lc + '.dragcar').cssProp].replace('px', '');

        });
        _updateActiveNavItem.apply(this, [itemNumber, $this.data(namespace_lc + '.settings').snapToSpeed]);

        // trigger events/callbacks for everything like beforesnapto, aftersnapto, beforescroll, afterscroll, beforenavchange, 
        // afternavchange, oninit,
        // ondestroy (name all events be in the "mouseenter.{{namespace}}" so that I can destroy all event listeners with .off('.{{namespace}}'),
        // beforechangespeed, afterchangespeed, beforechangescroll, afterchangescroll, beforeresize, afterresize...
        // and many more, 

    }

    /************************************************************************/
    /** PRIVATE METHODS END                                                **/
    /************************************************************************/

    /************************************************************************/
    /** PUBLIC METHODS START                                               **/
    /************************************************************************/

    var methods = {

        init: function (options) {

            if (!this.length) {
                return this;
            }

            return this.each(function () {

                console.time('init');

                var $this = $(this);
                var carouselDirections = ['left', 'right', 'up', 'down'];
                var dataObjectArrows = {};
                var currentArrow;
                //var currentPosition = 0;

                $this.data(namespace_lc + '.isInitd', true);

                // sets the options passed in to the plugin.
                $this[namespace]('setSettings', options);
                $this.data(namespace_lc + '.settings', $.extend({}, $.fn[namespace].defaults, options));

                $this.data(namespace_lc + '.settings').orientation = ($this.data(namespace_lc + '.settings').orientation == 'horizontal' || $this.data(namespace_lc + '.settings').orientation == 'vertical' || $this.data(namespace_lc + '.settings').orientation == 'both') ? $this.data(namespace_lc + '.settings').orientation.toLowerCase() : 'horizontal';
                $this.data(namespace_lc + '.settings').rows = $this.data(namespace_lc + '.settings').rows < 1 ? $this.data(namespace_lc + '.settings').rows = 1 : Math.ceil($this.data(namespace_lc + '.settings').rows);
                $this.data(namespace_lc + '.settings').columns = $this.data(namespace_lc + '.settings').columns < 0 ? $this.data(namespace_lc + '.settings').columns = 1 : Math.ceil($this.data(namespace_lc + '.settings').columns);

                // helper classes for styling the carousel.
                classes = '';
                classes += namespace_lc + '-carousel ';
                classes += namespace_lc + '-carousel-orientation-' + $this.data(namespace_lc + '.settings').orientation + ' ';
                classes += namespace_lc + '-carousel-rows-' + $this.data(namespace_lc + '.settings').rows + ' ';
                classes += namespace_lc + '-carousel-columns-' + $this.data(namespace_lc + '.settings').columns + ' ';
                $this.addClass(classes);

                $this.children().attr('data-' + namespace_lc + '-id', function (index, attr) {
                    return index;
                }).attr('data-' + namespace_lc + '-item-caption', function (index, attr) {
                    $(this).append('<span class="' + namespace_lc + '-item-caption">' + attr + '</span>');
                });

                // cache of the carousel items. We do this after the classes have been added (above) so that the CSS can take affect before any measuring is done.
                $this.data(namespace_lc + '.items', {
                    'items': $this.children(),
                    'count': $this.children().length,
                    'width': $this.children(':eq(0)').width(),
                    'height': $this.children(':eq(0)').height(),
                    'outerWidth': $this.children().filter(':eq(0)').outerWidth(true),
                    'outerHeight': $this.children().filter(':eq(0)').outerHeight(true)
                });

                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                // this is shite!!!!!!!!!!!!!!!!
                $this.data(namespace_lc + '.items').items.on('mouseenter', function () {
                    console.log("hello");
                    console.log($(this).find('.' + namespace_lc + '-item-caption').html());
                    $(this).find('.' + namespace_lc + '-item-caption').addClass('zcarousel-carousel-state-hover');
                }).on('mouseleave', function () {
                    $(this).find('.' + namespace_lc + '-item-caption').removeClass('zcarousel-carousel-state-hover');
                });

                // make sure all the settings are plugin-friendly.
                $this.data(namespace_lc + '.settings').snapToSpeed = isNaN($this.data(namespace_lc + '.settings').snapToSpeed) == true ? 250 : $this.data(namespace_lc + '.settings').snapToSpeed;
                // test to see if all the plugin options are what they need to be or revert to defaults.
                // scroll is numeric.
                // speed is numeric.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.
                // etc.

                // reference the index.
                $this.data(namespace_lc + '.items').currentPosition = ($this.data(namespace_lc + '.settings').start - 1);

                // if the start position is less than or greater than the items count set the start position to the relative outer item.
                if ($this.data(namespace_lc + '.settings').start < 1) {

                    $this.data(namespace_lc + '.items').currentPosition = 0;

                } else if (($this.data(namespace_lc + '.settings').start >= $this.data(namespace_lc + '.items').count)) {

                    $this.data(namespace_lc + '.items').currentPosition = $this.data(namespace_lc + '.items').count - 1;

                }

                $this.data(namespace_lc + '.settings').scroll = _getFriendlyScrollValue.apply(this, [$this.data(namespace_lc + '.settings').scroll]);

                // not animating yet.
                $this.data(namespace_lc + '.isAnimating', false);

                // DOM setup.
                $this.css({
                    'position': 'relative'
                }).wrap('<div class="' + namespace_lc + '-carousel-wrapper ' + namespace_lc + '-carousel-id-' + _createGUID.apply(this) + '"><div class="' + namespace_lc + '-carousel-clip"></div></div>');


                //if ($this.data(namespace_lc + '.settings').arrows === true) {

                    // arrow creation.
                    $.each(carouselDirections, function (index, value) {

                        // returns before any arrows are created if the orientation and arrows to match up.
                        if (($this.data(namespace_lc + '.settings').orientation == 'horizontal' && (value == 'up' || value == 'down')) ||
                            ($this.data(namespace_lc + '.settings').orientation == 'vertical' && (value == 'left' || value == 'right'))) {
                            return;
                        }

                        currentArrow = $('<span class="' + namespace_lc + '-carousel-arrow ' + namespace_lc + '-carousel-arrow-' + value + '"></span>');
                        $(currentArrow).insertAfter($this);
                        dataObjectArrows[value] = currentArrow;

                    });

                    // for ease of accessing the arrows.
                    $this.data(namespace_lc + '.arrow', dataObjectArrows);

                //}

                _setupCarousel.apply(this);

                if ($this.data(namespace_lc + '.settings').nav) {

                    var navHtml = $this.data(namespace_lc + '.settings').navHtml || null;

                    _createNavigation.apply(this, [navHtml]);
                }
                
                //if ($this.data(namespace_lc + '.settings').arrows === true) {

                    $this.siblings('.' + namespace_lc + '-carousel-arrow').on('click', $this, function (e) {

                        e.preventDefault();

                        if (!$this.data(namespace_lc + '.isAnimating')) {

                            $this.data(namespace_lc + '.isAnimating', true);

                            if ($(this).hasClass(namespace_lc + '-carousel-arrow-left')) {

                                $this[namespace]('scroll', $this.data(namespace_lc + '.settings').scroll, $this.data(namespace_lc + '.settings').speed);
                                return;

                            } else if ($(this).hasClass(namespace_lc + '-carousel-arrow-right')) {

                                $this[namespace]('scroll', ($this.data(namespace_lc + '.settings').scroll * (-1)), $this.data(namespace_lc + '.settings').speed);
                                return;

                            } else if ($(this).hasClass(namespace_lc + '-carousel-arrow-up')) {

                                $this[namespace]('scroll', $this.data(namespace_lc + '.settings').scroll, $this.data(namespace_lc + '.settings').speed);
                                return;

                            } else if ($(this).hasClass(namespace_lc + '-carousel-arrow-down')) {

                                $this[namespace]('scroll', ($this.data(namespace_lc + '.settings').scroll * (-1)), $this.data(namespace_lc + '.settings').speed);
                                return;
                            }

                        }

                    });

                //}

                $(window).resize(function () {
                    $this[namespace]('resizeCarousel');
                });

                if ($this.data(namespace_lc + '.settings').keyPress === true) {

                    $(document).on('keyup', $this, function (e) {

                        var keyCode = e.which.toString();

                        switch (keyCode) {

                            case '37':
                                $this.data(namespace_lc + '.arrow').left && $this.data(namespace_lc + '.arrow').left.trigger('click');
                                break;

                            case '38':
                                $this.data(namespace_lc + '.arrow').up && $this.data(namespace_lc + '.arrow').up.trigger('click');
                                break;

                            case '39':
                                $this.data(namespace_lc + '.arrow').right && $this.data(namespace_lc + '.arrow').right.trigger('click');
                                break;

                            case '40':
                                $this.data(namespace_lc + '.arrow').down && $this.data(namespace_lc + '.arrow').down.trigger('click');
                                break;

                            default:
                                break;
                        }

                    });

                }

                $this.on('mouseenter', $this, function () {

                    $(this).addClass(namespace_lc + '-carousel-state-hover');

                }).on('mouseleave', $this, function () {

                    $(this).removeClass(namespace_lc + '-carousel-state-hover');

                }).siblings('.' + namespace_lc + '-carousel-arrow').on('mouseenter', function () {

                    $(this).addClass(namespace_lc + '-carousel-state-hover');
                    $this.addClass(namespace_lc + '-carousel-state-hover');

                }).on('mouseleave', function () {

                    $(this).removeClass(namespace_lc + '-carousel-state-hover');
                    $this.removeClass(namespace_lc + '-carousel-state-hover');

                });

                $this[namespace]('resizeCarousel');

                var autoScrollDelay = $this.data(namespace + '.settings').autoScrollDelay;

                if (autoScrollDelay && !isNaN(autoScrollDelay) && autoScrollDelay > 0) {

                    var autoScrollTimeout = setTimeout(doAutoScroll, autoScrollDelay);
                    $this.on('scrollEnd.' + namespace_lc, function () {
                        autoScrollTimeout = setTimeout(doAutoScroll, autoScrollDelay);
                    });

                    function doAutoScroll() {
                        $this.data(namespace_lc + '.arrow').right.trigger('click');
                    }

                    if ($this.data(namespace + '.settings').pauseAutoScrollOnHover == true) {

                        $this.on('mouseenter', function () {
                            clearTimeout(autoScrollTimeout);
                        }).on('mouseleave', function () {
                            clearTimeout(autoScrollTimeout);
                            autoScrollTimeout = setTimeout(doAutoScroll, autoScrollDelay);
                        });

                    }

                    if ($this.data(namespace + '.settings').stopAutoScrollOnInteraction == true) {
                        // when nav/arrrow is clicked or when the carousel is dragged.... then stop the autoscroll.
                    }
                }

                // makes the carousel draggable.
                if ($this.data(namespace_lc + '.settings').draggable === true) {
                    _dragCar.apply(this);
                }

                console.timeEnd('init');

            });

        },
        scrollTo: function (index) {

            var $this = $(this);
            var scrollAmount;

            // change it from 0-based index to 1-based index.
            index -= 1;

            if (index == $this.data(namespace_lc + '.items').currentPosition) {
                return false;
            }
            // will be negative or positive. negative for right and positive for left.
            scrollAmount = $this.data(namespace_lc + '.items').currentPosition - index;
            console.log(scrollAmount);
            $this[namespace]('scroll', scrollAmount, $this.data(namespace_lc + '.settings').speed);

        },
        scroll: function (scrollAmount, speed) {

            var $this = $(this);
            var animationCSSProperty = $this.data(namespace_lc + '.settings').orientation == 'horizontal' ? 'left' : 'top';
            var animationValue = animationCSSProperty == 'left' ? '+=' + ($this.data(namespace_lc + '.items').outerWidth * scrollAmount) : '+=' + ($this.data(namespace_lc + '.items').outerHeight * scrollAmount);
            var animation = {};

            var nextFrom = $this.data(namespace_lc + '.items').from - scrollAmount;
            var nextTo = $this.data(namespace_lc + '.items').to - scrollAmount;
            //var nextFocus = $this.data(namespace_lc + '.items').focus;

            if (nextFrom < 0) {
                nextFrom += $this.data(namespace_lc + '.items').count;
            } else if (nextFrom >= $this.data(namespace_lc + '.items').count) {
                nextFrom -= $this.data(namespace_lc + '.items').count;
            }

            if (nextTo < 0) {
                nextTo += $this.data(namespace_lc + '.items').count;
            } else if (nextTo >= $this.data(namespace_lc + '.items').count) {
                nextTo -= $this.data(namespace_lc + '.items').count;
            }

            // have to calculate this because we don't know the next position of the nav yet as the animation has not happend yet.
            var nextNavPosition = nextFrom + $this.data(namespace_lc + '.items').focus;

            if (nextNavPosition >= $this.data(namespace_lc + '.items').count) {
                nextNavPosition -= $this.data(namespace_lc + '.items').count;
            } else if (nextNavPosition < 0) {
                nextNavPosition += $this.data(namespace_lc + '.items').count; 
            }

            if ($this.data(namespace_lc + '.settings').scrollStraightToItem == true) {

                var newScrollAmount;

                animationValue = '+=' + $this.data(namespace_lc + '.items').outerWidth;

                if (scrollAmount > 0) {
                    newScrollAmount = scrollAmount - 1;
                    animationValue = '+=' + $this.data(namespace_lc + '.items').outerWidth;
                } else if (scrollAmount < 0) {
                    newScrollAmount = scrollAmount + 1;
                    animationValue = '-=' + $this.data(namespace_lc + '.items').outerWidth;
                }

                $this.data(namespace_lc + '.items').items.filter(':eq(' + nextNavPosition + ')').css({
                    'position': 'relative',
                    'left': newScrollAmount * $this.data(namespace_lc + '.items').outerWidth
                    
                });
            }

            // we need to build the carousel items before the animation so that there is not a white gap where items should be.
            if (scrollAmount < 0) {

                var from = $this.data(namespace_lc + '.items').currentPosition;
                var to = ($this.data(namespace_lc + '.items').currentPosition + Math.abs(scrollAmount));
                var focus = $this.data(namespace_lc + '.items').focus;

                _buildCarouselItems.apply(this, [from, to, 0]);

            } else if (scrollAmount > 0) {

                var from = ($this.data(namespace_lc + '.items').currentPosition - Math.abs(scrollAmount));
                var to = $this.data(namespace_lc + '.items').currentPosition;
                var focus = $this.data(namespace_lc + '.items').focus;

                _buildCarouselItems.apply(this, [from, to, Math.abs(to - from)]);

            }

            animation[animationCSSProperty] = animationValue;

            $this.animate(animation, speed, function () {
                
                $this.triggerHandler('scrollStart.' + namespace_lc);
                $this.data(namespace_lc + '.items').focus = $this.data(namespace_lc + '.settings').scroll;

                _buildCarouselItems.apply(this, [nextFrom, nextTo, $this.data(namespace_lc + '.items').focus]);

                if ($this.data(namespace_lc + '.settings').scrollStraightToItem == true) {
                    $this.data(namespace_lc + '.items').items.filter(':eq(' + nextNavPosition + ')').css({
                        'position': 'relative',
                        'left': '0'

                    });
                }

                $this.triggerHandler('scrollEnd.' + namespace_lc);

            });

            $this.data(namespace_lc + '.items').currentPosition = nextNavPosition;
            _updateActiveNavItem.apply(this, [$this.data(namespace_lc + '.items').currentPosition]);

        },
        // update speed.
        changeSpeed: function (speed) {

            var $this = $(this);
            speed = speed || $this.data(namespace_lc + '.settings').speed;
            $this.data(namespace_lc + '.settings').speed = speed;

        },
        // update scroll amount.
        changeScroll: function (scroll, callback) {

            // make is positive.
            scroll = Math.abs(scroll);

            try {

                if (!scroll) {

                    throw "jQuery." + namespace + ".changeScroll(): This method requires at least 1 parameter 'scroll'";

                }

                if (isNaN(scroll)) {

                    throw "jQuery." + namespace + ".changeScroll(): The passed-in value is not a number.";

                } else if (!isFinite(scroll)) {

                    throw "jQuery." + namespace + ".changeScroll(): The passed-in value is not a finite number.";

                } else if (isFinite(scroll) && !isNaN(scroll)) {

                    var $this = $(this);

                    $this.data(namespace_lc + '.settings').scroll = _getFriendlyScrollValue.apply(this, [scroll]);
                    _setupCarousel.apply(this);


                }

                callback && callback();

            } catch (error) {

                _showError('', error);

            }

        },
        resizeCarousel: function () {

            var $this = $(this);

        },
        isInitd: function () {
            return $(this).data(namespace_lc + '.isInitd') == true ? true : false;
        },
        isEnabled: function () {
            return $(this).data(namespace_lc + '.isEnabled') == true ? true : false;
        },
        // stores plugin settings using the data method.
        setSettings: function (options) {
            this.data(namespace_lc + '.settings', $.extend({}, this.data(namespace_lc + '.settings'), options));
            this.data(namespace_lc + '.settingsDefault', $.extend({}, this.data(namespace_lc + '.settings'), options));
        }

    };

    /************************************************************************/
    /** PUBLIC METHODS END                                                 **/
    /************************************************************************/

    $.fn[namespace] = function (method) {

        if (methods[method]) {

            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        } else if (typeof method === 'object' || !method) {

            return methods.init.apply(this, arguments);

        } else {

            $.error('Method ' + method + ' does not exist on jQuery.' + namespace);

        }

    };

    // default plugin options
    $.fn[namespace].defaults = {
        'orientation': 'horizontal', // carousel direction. Can be 'horizonal', 'vertical', or 'both'.
        'start': 1, // 
        'scroll': 1, // number of items to scroll on click.
        'transition': 'scroll',
        //'autoScroll': false, // boolean indicating if the carousel will scroll automatically.
        'arrows': true, // boolean indicating if the arrows are dispayed or not. ////////////////////////// NOT IMPLEMENTED!!
        'keyPress': true, // boolean indicating if a key press will move the carousel.
        'autoScrollDelay': 0, // integer indicating the number of milliseconds until the autoscroll fires.
        'stopAutoScrollOnInteraction': true, // boolean indicating if the auto scrolling will stop when a user interacts with it.
        'pauseAutoScrollOnHover': true, // boolean indicating if the auto scrolling will stop when a user interacts with it.
        'rows': 1, // number of rows of items in a carousel. 0 will result in 1.
        'columns': 1, // number of columns of items in a carousel. 0 for natural width.
        'speed': 400, // duration of transition (in milliseconds).
        'nav': true, // show slide navigation. Can be 'true' or 'false'.
        'navHtml': function() {}, // function to return the inner html of the nav item.
        'navActiveMarker': true, // have an extra li that animates between the current and next active nav <li>.
        'navActiveMarkerHtml': null, // inner html of the active nav marker. must be string
        'draggable': true, // carousel is draggable.
        'snapToSpeed': 250 // speed (in milliseconds) of the carousel snapTo.
    };

})(jQuery);