function LoadStoryLine()
{
    var sJSON = localStorage.getItem("savedScenario");
    console.log(sJSON);
    
    var JSONObj = JSON.parse(sJSON);    
    var scenarios = JSONObj["scenarios"];
    
    var scenarioWrappers = $(".scenarioWrapper:not(.template)");
    var contextMenus = $(".contextMenu:not(.template)");
    
    console.log(scenarioWrappers.length);
    console.log(contextMenus.length);
    
    //resetting the page
    for(var i=0;i<contextMenus.length;i++)
    {
        if($(contextMenus[i]).hasClass("active"))
        {
            var contextMenu = contextMenus[i];
            var scenarioWrapper = scenarioWrappers[i];
            StoryLine.ContextMenuManager.closeContextMenu($(scenarioWrappers[i]),function(){
                console.log("Deletiiiiiiiing......");
                $(contextMenu).remove();
                $(scenarioWrapper).remove();
                console.log("DELETE AND DESTROY!!!");
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
        StoryLine.ScenarioManager.initScenario($(scInstance));
        StoryLine.ScenarioManager.selectScenario($(scInstance));
        
        var actie  = JSONObj["scenarios"][i]["actie"];
        //console.log(actie);
        var emotions = JSONObj["scenarios"][i]["emotions"];
        var comments = JSONObj["scenarios"][i]["comments"];
        
        for(var j=0;j<emotions.length;j++)
        {
            //console.log(emotions[j]);
        }
        
        for(var k=0;k<comments.length;k++)
        {
            //console.log(comments[k][1]);
        }
    }
}