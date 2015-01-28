function LoadStoryLine()
{
    var sJSON = localStorage.getItem("savedScenario");
    console.log(sJSON);
    
    var JSONObj = JSON.parse(sJSON);    
    var scenarios = JSONObj["scenarios"];
    
    var scenarioWrappers = $(".scenarioWrapper:not(.template)");
    var contextMenus = $(".contextMenu:not(.template)");
    
    //resetting the page
    for(var i=0;i<contextMenus.length;i++)
    {
        if($(contextMenus[i]).hasClass("active"))
        {
            var contextMenu = contextMenus[i];
            var scenarioWrapper = scenarioWrappers[i];
            StoryLine.ContextMenuManager.closeContextMenu($(scenarioWrappers[i]),function(){
                $(contextMenu).remove();
                $(scenarioWrapper).remove();
            });
        }
        else
        {
            $(contextMenus[i]).remove();
            $(scenarioWrappers[i]).remove();
        }
    }
    
    //reading the saved JSON string and creating the scenarios
    for(var i=0;i<scenarios.length;i++)
    {
        //setting new scenario
        var scInstance = StoryLine.ScenarioManager.cloneScenarioTemplate(),
                        cmInstance = StoryLine.ContextMenuManager.cloneContextMenuTemplate(),
                        list = $('.scenario-list'),
                        tmp = $('.scenarioWrapper.template'),
                        commentList;
        scInstance.insertBefore(tmp);
        cmInstance.insertAfter(scInstance);
        commentList = $(scInstance).children('.scenario').children('.comment-list-wrapper').children('.comment-list');

        StoryLine.ContextMenuManager.initContextMenu($(scInstance));
        StoryLine.CommentManager.initCommentList(commentList);
        StoryLine.ScenarioManager.showScenario($(scInstance));
        
        
        var eventButtons = $(".contextMenu.template .buttons .event .contextIcon");
        var emotionButtons = $(".contextMenu.template .buttons .emotion .contextIcon");
        
        //set correct action image
        var actie  = JSONObj["scenarios"][i]["actie"];
        
        for(var count=0;count<eventButtons.length;count++)
        {
            if(eventButtons[count].title == actie)
            {
                StoryLine.ScenarioManager.setScenarioEvent($(scInstance).children(".scenario").children(".event"), $(eventButtons[count]));
            }
        }
        
        //set correct emotion images
        var emotions = JSONObj["scenarios"][i]["emotions"];
        for(var count=0;count<emotionButtons.length;count++)
        {
            if(emotionButtons[count].title == emotions[0])
            {
                StoryLine.ScenarioManager.setScenarioEmotion($(scInstance), $(scInstance.children(".scenario").children(".emotions").children(".emotion")[0]), $(emotionButtons[count]));
            }
            
            if(emotionButtons[count].title == emotions[1])
            {
                StoryLine.ScenarioManager.setScenarioEmotion($(scInstance), $(scInstance.children(".scenario").children(".emotions").children(".emotion")[1]), $(emotionButtons[count]));
            }
        }
        
        //set correct comments
        var comments = JSONObj["scenarios"][i]["comments"];
        var template = $(scInstance).children(".scenario").children(".comment-list-wrapper").children(".comment-list").children(".commentWrapper.template");
        for(var count=0;count<comments.length;count++)
        {
            var text = comments[count][1];
            var newComment = StoryLine.CommentManager.addComment($(template));
            /*
            StoryLine.CommentManager.editComment(newComment, function () {
                StoryLine.CommentManager.prevText = text;
                StoryLine.CommentManager.finishEdit(newComment, false);
            });*/
            
            newComment.children(".content").text(text);
            StoryLine.CommentManager.closeComment($(newComment));
            StoryLine.CommentManager.resetEditing($(newComment));
        }
        
        StoryLine.ScenarioManager.initScenario($(scInstance));
    }
}