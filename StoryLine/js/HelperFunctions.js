var StoryLine = StoryLine || {};

// This class is for static functions, general functions that don't belong in any specific manager and are used by one or some of them.

StoryLine.HelperFunctions = function () {

};

StoryLine.HelperFunctions.prototype = {
    create: function () {

    }

};

var EndsWith = function (str, suffix) {
    // http://stackoverflow.com/questions/280634/endswith-in-javascript
    if (!str) {
        return false;
    }
    if (!suffix) {
        return false;
    }
    if (suffix.length > str.length) {
        return false;
    }
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

var GetParent = function (element, type, depth) {
    if (depth === 0) {
        return false;
    }
    if (element.hasClass(type)) {
        return element;
    }
    depth -= 1;
    if (depth === 0) {
        return false;
    } else {
        return GetParent(element.parent(), type, depth);
    }
};

var GetAbsoluteCenterY = function (scenarioWrapper, element) {
    // http://stackoverflow.com/questions/3714628/jquery-get-the-location-of-an-element-relative-to-window
    var elementTop = element.offset().top;
    var scrollViewTop = scenarioWrapper.children('.scenario').scrollTop();
    
    var elementHeight = GetElementHeight(element);
    
    console.log(elementTop - scrollViewTop + (elementHeight / 2));

    return (elementTop - scrollViewTop) + (elementHeight / 2);
};

var GetElementHeight = function (element) {
    if (!element) {
        return 0;
    }
    if (element.height() > 0) {

        return element.height();
    }
    var height;
    var parent = element.parent();
    var pPreviousCss = openElement(parent);
    var previousCss = openElement(element);

    height = element.height();
    if (previousCss) {
        closeElement(element, previousCss);
    }
    if (pPreviousCss) {
        closeElement(parent, pPreviousCss);
    }
    return height;
};

var openElement = function (element) {
    if (!element) {
        return false;
    }
    var previousCss = element.attr('style');
    element.css({
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
    });
    return previousCss;
};

var closeElement = function (element, previousCss) {
    element.attr('style', previousCss ? previousCss : '');
};
