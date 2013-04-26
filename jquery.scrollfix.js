/**
 * ScrollFix 1.0 / jQuery plugin
 * Support: all modern browsers and MSIE 7+
 * @author ShiraNai7 <shira.cz>
 */
void function ($) {

    "use_strict";

    /**
     * Get Y position of DOM element, relative to given offset parent
     * @param elem DOM element
     * @param offsetParent DOM element or null
     * @return integer
     */
    function getElementY(elem, offsetParent)
    {
        // do not check parent if window
        if (window === offsetParent || undefined === offsetParent) {
            offsetParent = null;
        }

        // determine position
        var y = 0;
        do y += elem.offsetTop;
        while ((elem = elem.offsetParent) && elem !== offsetParent);

        // return
        return y;
    }

    /**
     * Apply ScrollFix to given elements
     *
     * @param element
     * @param options
     * @return object
     */
    $.fn.scrollFix = function (element, options) {
        
        options = $.extend({}, $.fn.scrollFix.defaults, options);

        this.each(function () {

            console.log(this);

            var
                container = this,
                scroller = $(options.scroller),
                elementContainerOffset,
                elementOrigWidth,
                fixing = false
            ;

            // get element
            if (typeof element === 'string') {
                element = $(element, container);
                if (element.length > 0) {
                    element = element.get(0);
                }  else {
                    throw new Error('Could not find "' + element + '"');
                }
            } else if (element instanceof jQuery) {
                if (element.length > 0) {
                    element = element.get(0);
                } else {
                    throw new Error('Could not get the element (empty set?)');
                }
            }

            /**
             * Update elements according to current scroll offset
             */
            function update()
            {
                var scrollerTop = scroller.scrollTop();
                if (fixing) {
                    if (scrollerTop <= getElementY(container) + elementContainerOffset + options.unfixBoundaryOffset) {
                        fixing = false;
                        $(element)
                            .css('width', elementOrigWidth)
                            .removeClass(options.elementFixClass)
                        ;
                        if (options.containerFixClass) {
                            $(container).removeClass(options.containerFixClass);
                        }
                    }
                } else if (scrollerTop > getElementY(element, options.scroller) + options.fixBoundaryOffset) {
                    fixing = true;
                    elementOrigWidth = element.style.width;
                    elementContainerOffset = getElementY(element, container);
                    $(element)
                        .css('width', $(element).width())
                        .addClass(options.elementFixClass)
                    ;
                    if (options.containerFixClass) {
                        $(container).addClass(options.containerFixClass);
                    }
                }
            }

            // update on scroll
            $(options.scroller).scroll(update);

            // initial update
            update();

        });

        return this;

    };

    // defaults
    $.fn.scrollFix.defaults = {
        scroller: window,
        containerFixClass: 'scroll-fix',
        elementFixClass: 'scroll-fix',
        fixBoundaryOffset: 0,
        unfixBoundaryOffset: 0
    };

}(jQuery);