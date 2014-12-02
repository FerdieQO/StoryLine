var StoryLine = StoryLine || {};

StoryLine.DBConnect = function () {
    var suggestions = null;
};

StoryLine.DBConnect.prototype = {
    collectSuggestions: function () {
        $.ajax('../php/api.php', {
            type: 'GET',
            dataType: "text",
            success: function (data, textStatus, jqXHR) {
                console.log(textStatus);
                console.log(data);
                
                /*
                //console.log(textStatus);
                //console.log(jqXHR);
                var i, row, word;
                for (i in data) {
                    row = data[i];
                    word = row[0];
                    this.suggestions.add(word);
                    
                }*/
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
                //console.error(textStatus);
                //console.error(jqXHR);
            }
        });
    }
};