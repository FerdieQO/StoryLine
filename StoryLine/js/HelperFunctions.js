var StoryLine = StoryLine || {};

// This class is for static functions, general functions that don't belong in any specific manager and are used by one or some of them.

StoryLine.HelperFunctions = function () {
    
};

StoryLine.HelperFunctions.prototype = {
    create: function () {
        
    },
    endsWith: function (str, suffix) {
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
    }
};