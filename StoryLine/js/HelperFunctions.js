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

var GetElementTopOffset = function (element, evenIfHidden) {
    if (!element) {
        return 0;
    }
    if (!evenIfHidden) {
        return element.offset().top;
    }
    var top;
    var parent = element.parent();
    var pPreviousCss = openElement(parent);
    var previousCss = openElement(element);

    top = element.offset().top;
    closeElement(element, previousCss);

    if (pPreviousCss) {
        closeElement(parent, pPreviousCss);
    }
    return top;
};

var GetElementHeight = function (element, evenIfHidden, exclParent) {
    if (!element) {
        return 0;
    }
    if (!evenIfHidden) {
        return element.height();
    }
    var height;
    var parent = element.parent();
    var pPreviousCss;
    if (!exclParent) {
        pPreviousCss = openElement(parent);
    }
    var previousCss = openElement(element);

    height = element.height();
    closeElement(element, previousCss);

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
