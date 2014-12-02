var StoryLine = StoryLine || {};



StoryLine.Main = function () {
    
    StoryLine.CommentManager = new StoryLine.CommentManager();
    StoryLine.DatabaseManager = new StoryLine.DatabaseManager();
    StoryLine.ScenarioManager = new StoryLine.ScenarioManager();
};

StoryLine.Main.prototype = {
    create: function () {
        StoryLine.CommentManager.create();
        StoryLine.DatabaseManager.create();
        StoryLine.ScenarioManager.create();
    }
};

StoryLine.Main = new StoryLine.Main();
$(document).ready(StoryLine.Main.create);
