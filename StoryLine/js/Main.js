var StoryLine = StoryLine || {};

StoryLine.Main = function () {
    StoryLine.DatabaseManager = new StoryLine.DatabaseManager();
    StoryLine.ScenarioManager = new StoryLine.ScenarioManager();
    StoryLine.CommentManager = new StoryLine.CommentManager();
};

StoryLine.Main.prototype = {
    create: function () {
        StoryLine.DatabaseManager.create();
        StoryLine.ScenarioManager.create(function () {
            console.log("created scenariomanager");
            StoryLine.CommentManager.create();
        });
    }
};

StoryLine.Main = new StoryLine.Main();
$(document).ready(StoryLine.Main.create);