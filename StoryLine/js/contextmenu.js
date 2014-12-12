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
	$('.scenarioWrapper').on("click", function(){//, ".event"
		var myIndex = $(this).index();
		console.log(myIndex);
		if(myIndex > 0){myIndex /= 2;}
		$('.contextMenu').eq(myIndex).toggleClass('open');
		$('body, .scenario-list').toggleClass('fix');
		$('.contextMenu').eq(myIndex).animate({width:'toggle'},350);
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
	$(".contextMenu").each(function(index, element) { // index = no; element = this;
		var myParent = $('.scenarioWrapper').eq(index);
		var myLeft = myParent.position.left;
		var myTop = myParent.position.top;
		
		if($(myParent).hasClass('talk')){$(this).css({'background-color':'#d3a30b'});}
		if($(myParent).hasClass('hold-hands')){$(this).css({'background-color':'#8f1508'});}
		if($(myParent).hasClass('cuddle')){$(this).css({'background-color':'#301026'});}
		if($(myParent).hasClass('kiss')){$(this).css({'background-color':'#665454'});}
		
		$(element).css({
			'position':'absolute',
			'left': myLeft,
			'right': myTop
		});
	});
}