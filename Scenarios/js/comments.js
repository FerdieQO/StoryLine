var divs = new Array();
var main = function () {


    var contentShort = $('.content-short').empty().html("<img src='src/emotions/emotieIcon%5Bopgewonden%5D.png' alt='nope'/>Contains a small description..."),
        commentLong = $('.content-long').empty().html("<img src='src/emotions/emotieIcon%5Bopgewonden%5D.png' alt='nope'/>Has some details. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis diam consectetur quam porttitor faucibus vitae in diam. In at turpis dignissim, faucibus felis at, dictum ex. Curabitur faucibus, sapien quis finibus lacinia, odio arcu ultrices eros, nec scelerisque mauris neque id erat. Nullam elementum tincidunt rhoncus. Nulla facilisi. Ut suscipit dolor ipsum, et semper augue auctor ac. Etiam sem sem, congue id dolor et, semper pellentesque odio. Nullam id volutpat leo. Nulla facilisi. Nunc eget ullamcorper dui. Aliquam at nulla non eros tristique viverra sit amet in dolor. Sed placerat augue in ullamcorper dignissim. Not actual details.");

    
    $('.commentWrapper').each(function () {
        divs.push($(this).children('.content-short').text());
        console.log($(this).children('.content-short').text());
        $(this).children('.content-short').show();
        divs.push($(this).children('.content-long').text());
        console.log($(this).children('.content-long').text());
    });

    $('.commentWrapper').click(function () {
        var shortC, longC, oldWrapper, oldShortC, oldLongC;


        if ($(this).hasClass('active-comment')) {
            shortC = $(this).children('.content-short');
            longC = $(this).children('.content-long');
            shortC.hide();
            longC.hide("blind", {}, 300, function () {
                shortC.fadeIn(300);
            });
            $(this).removeClass('active-comment');
        } else {
            oldWrapper = $('.active-comment');
            if (oldWrapper) {
                oldShortC = oldWrapper.children('.content-short');
                oldLongC = oldWrapper.children('.content-long');
                oldShortC.hide();
                oldLongC.hide("blind", {}, 300, function () {
                    oldShortC.fadeIn(300);
                });
                oldWrapper.removeClass('active-comment');
            }

            shortC = $(this).children('.content-short');
            longC = $(this).children('.content-long');
            shortC.fadeOut(300, function () {
                longC.show("blind", {}, 300);
            });
            $(this).addClass('active-comment');
        }
    });
};

$(document).ready(main);