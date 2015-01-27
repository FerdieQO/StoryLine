var JSONString = '{"scenarios":[';

function SaveStoryLine()
{   
    StoryLineToJSON();
}

function StoryLineToJSON()
{
    $(".scenarioWrapper:not(.template)").each(function(){
                                            ConvertToJSON($(this));
                                        });
    
    JSONString = JSONString.substr(0, JSONString.length-1);
    JSONString += ']}';
    
    localStorage.setItem("savedScenario", JSONString);
}

function ConvertToJSON(scenario)
{   
    var eventImage = scenario.find(".event").attr("title");
    var emotions = scenario.contents().find(".emotion");
    var comments = scenario.contents().find(".commentWrapper:not(.template):not(.editing)").find(".content");
    
    //add action to JSON string
    JSONString += '{"actie":';
    JSONString += '"' + eventImage + '",';
    
    //add emotions to JSON string
    JSONString += '"emotions":["' + emotions[0].title + '","' + emotions[1].title + '"],';
    
    //add comments to JSON string
    JSONString += '"comments":[';
    for(var i=0;i<comments.length;i++)
    {
        var commentString = '["';
        commentString += $(comments[i]).find("img").attr("src") + '",';
        if(i == comments.length - 1)
        {
            commentString += '"' + $(comments[i]).text() + '"]';
        }
        else
        {
            commentString += '"' + $(comments[i]).text() + '"],';
        }
        JSONString += commentString; 
    }
    
    JSONString += ']},';
    
    //ar json = JSON.stringify(lastObj);
}

//$(document).ready(testFunction);