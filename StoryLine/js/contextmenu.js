var main = function() {
    $(document).on("click", ".event", function(){
        $(".contextMenu").fadeToggle("slow", function(){
            
        });
    });
};

$(document).ready(main);
$(function(){
	$(document).ready(function(){
		$(".contextMenu").hide();
		
		GetPositions();
	});
});

$( window ).resize(function() {
	GetPositions();
});

$(function(){
	$('.scenarioWrapper').on("click", function(){
		var myIndex = $(this).index();
		if(myIndex > 0){myIndex /= 2;}
		$('body, .scenario-list').toggleClass('fix');
		$('.contextMenu').eq(myIndex).animate({width:'toggle'},350);
		$(this).toggleClass('show');//.children('.scenario')
		if($(this).hasClass('show') && $(this).hasClass('talk'))
		{
			$(this).css({'background-color':'#f9c82e'});
		}
		else if($(this).hasClass('show') && $(this).hasClass('hold-hands'))
		{
			$(this).css({'background-color':'#c1392b'});
		}
		else if($(this).hasClass('show') && $(this).hasClass('cuddle'))
		{
			$(this).css({'background-color':'#5d2e4e'});
		}
		else if($(this).hasClass('show') && $(this).hasClass('kiss'))
		{
			$(this).css({'background-color':'999999'});
		}
		else
		{
			$(this).css({'background-color':'#cccccc'});
		}
    });
});

$(function(){
	$('.contextIcon').on("click", function(){
		var myIndex = $(this).parent().index();
		console.log(myIndex);
		myIndex -= 1;
		if(myIndex > 0){myIndex /= 2;}
		$('.event').eq(myIndex).attr('src', $(this).attr('src'));
    });
});

function GetPositions () {
	$(".contextMenu").each(function(index, element) {
		var myParent = $('.scenarioWrapper').eq(index);
		var myLeft = myParent.position.left;
		var myTop = myParent.position.top;
		
		if($(myParent).hasClass('talk'))
		{
			$(this).css({'background-color':'#d3a30b'});
		}
		if($(myParent).hasClass('hold-hands'))
		{
			$(this).css({'background-color':'#8f1508'});
		}
		if($(myParent).hasClass('cuddle'))
		{
			$(this).css({'background-color':'#301026'});
		}
		if($(myParent).hasClass('kiss'))
		{
			$(this).css({'background-color':'#665454'});
		}
		
		$(element).css({
			'position':'absolute',
			'left': myLeft,
			'right': myTop
		});
	});
}
