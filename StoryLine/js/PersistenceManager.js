var StoryLine = StoryLine || {};

StoryLine.PersistenceManager = function(){};
StoryLine.PersistenceManager.prototype = {
    create:function(){
        $(".save").click(function(){
            SaveStoryLine();
        });
        $(".load").click(function(){
            LoadStoryLine();
        });
    }
};