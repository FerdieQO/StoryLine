$(document).ready(function(){
    $("#cmEvent").mmenu();
    $(".addEventBtn").hover(
        function(){
            $(".addEventBtn").addClass("addEventBtnHover");
        }, function(){
            $(".addEventBtn").removeClass("addEventBtnHover");
        }
    );
    $(".addEventBtn").click(function(){
        $("#cmEvent").trigger("open.mm");
    });
    
    $(".addEmoBtn").hover(
        function(){
            $(this).addClass("addEventBtnHover");
        }, function(){
            $(this).removeClass("addEventBtnHover");
        }
    );
});