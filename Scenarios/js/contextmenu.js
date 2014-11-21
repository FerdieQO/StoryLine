var main = function() {
    $(document).on("click", ".event", function(){
        $(".contextMenu").fadeToggle("slow", function(){
            
        });
    });
};

$(document).ready(main);