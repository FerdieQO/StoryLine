var StoryLine = StoryLine || {};

StoryLine.HelperFunctions = function () {
    console.log('Huh?');
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