function LoadStoryLine()
{
    var sJSON = localStorage.getItem("savedScenario");
    console.log(sJSON);
    
    var JSONObj = JSON.parse(sJSON);
    console.log(JSONObj.count);
}