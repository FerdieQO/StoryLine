function testFunction()
{
    var json = JSON.stringify(lastObj);
    console.log(json);
}

function StoryLineToJSON()
{
    $(".scenarioWrapper:not(.template)").each(function(){
                                            ConvertToJSON($(this));
                                        });
}

function ConvertToJSON(scenario)
{   
    var eventImage = scenario.find(event).attr("title");
    //ar json = JSON.stringify(lastObj);
}

$(document).ready(testFunction);