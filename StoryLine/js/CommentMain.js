var StoryLine = StoryLine || {};

StoryLine.CommentMain = function () {
    StoryLine.DatabaseManager = new StoryLine.DatabaseManager();
    StoryLine.CommentManager = new StoryLine.CommentManager();
};

StoryLine.CommentMain.prototype = {
    create: function () {
        StoryLine.DatabaseManager.create();
        StoryLine.CommentManager.templateComment = $('.commentWrapper.template');
        StoryLine.CommentManager.create();
    }
};

StoryLine.CommentMain = new StoryLine.CommentMain();
$(document).ready(StoryLine.CommentMain.create);