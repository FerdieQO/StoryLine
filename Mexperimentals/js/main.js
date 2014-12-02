var StoryLine = StoryLine || {};



StoryLine.Main = function () {
    StoryLine.ScenarioManager = new StoryLine.ScenarioManager();
    StoryLine.CommentManager = new StoryLine.CommentManager();
    StoryLine.DBConnect = new StoryLine.DBConnect();
};

StoryLine.Main.prototype = {
    create: function () {
        StoryLine.ScenarioManager.create();
        StoryLine.CommentManager.create();
    }
};

StoryLine.Main = new StoryLine.Main();
$(document).ready(StoryLine.Main.create);
