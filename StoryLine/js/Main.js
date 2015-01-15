var StoryLine = StoryLine || {};

StoryLine.Main = function () {
    this.scrolling = true;
    
    StoryLine.DatabaseManager = new StoryLine.DatabaseManager();
    StoryLine.ScenarioManager = new StoryLine.ScenarioManager();
    StoryLine.CommentManager = new StoryLine.CommentManager();
    StoryLine.ContextMenuManager = new StoryLine.ContextMenuManager();
};

StoryLine.Main.prototype = {
    create: function () {
        StoryLine.DatabaseManager.create();
        StoryLine.ScenarioManager.create(function () {
            console.log("created scenariomanager");
            StoryLine.CommentManager.create();
            StoryLine.ContextMenuManager.create();
        });
    },
    lockScrolling: function () {
        this.scrolling = false;
        $('body, .scenario-list').addClass('fix');
    },
    unlockScrolling: function () {
        this.scrolling = true;
        $('body, .scenario-list').removeClass('fix');
    }
};

StoryLine.Main = new StoryLine.Main();
$(document).ready(StoryLine.Main.create);