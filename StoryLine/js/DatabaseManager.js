var StoryLine = StoryLine || {};

StoryLine.DatabaseManager = function () {
    var suggestions = null;
};

StoryLine.DatabaseManager.prototype = {
    create: function () {
        this.suggestions = new Array();
    },
    collectSuggestions: function () {
        this.ajaxCollect();
    },
    ajaxCollect: function () {
        $.ajax('php/api.php', {
            type: 'GET',
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log("Query status: success, returned " + data.length + " results");
                StoryLine.DatabaseManager.clearSuggestions();
                var i, row, word;
                for (i in data) {
                    row = data[i];
                    word = row[0];
                    StoryLine.DatabaseManager.addSuggestion(word);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Query status: " + textStatus + ", error: " + errorThrown);
                console.log("Working in brackets liveview? Database won't work! Use wamp or something.");
            }
        });
    },
    addSuggestion: function (word) {
        this.suggestions.push(word);
    },
    clearSuggestions: function () {
        this.suggestions = new Array();
    }
};