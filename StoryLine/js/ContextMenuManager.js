var StoryLine = StoryLine || {};

StoryLine.ContextMenuManager = function () {
    this.templateContextMenu = null;
};

StoryLine.ContextMenuManager.prototype = {
    create: function () {
        $('.contextMenu:not(.template)').each(function (index, element) {
            StoryLine.ContextMenuManager.initContextMenu($(this));
        });

        $('.scenario-list').scroll(function () {
            StoryLine.ContextMenuManager.getPositions();
        });

        $(window).resize(function () {
            StoryLine.ContextMenuManager.getPositions();
        });
    },
    cloneContextMenuTemplate: function () {
        var contextMenu = $('<div class="contextMenu dark">'),
            template = this.templateContextMenu.clone(true, true),
            elements = template.contents();
        elements.appendTo(contextMenu);
        //contextMenu.hide();
        return contextMenu;
    },
    initContextMenu: function (scenarioWrapper, contextMenu) {
        scenarioWrapper.click(function () {
            StoryLine.ContextMenuManager.getPositions();
            // Differentiate behaviour and content.

            var myIndex = $(this).index();
            if (myIndex > 0) { myIndex /= 2; }
            $('body, .scenario-list').toggleClass('fix');
            var contextMenu = $('.contextMenu').eq(myIndex);
            contextMenu.addClass('active');
            //contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
            $(this).toggleClass('active');//.children('.scenario')


            /*
            if ($(this).hasClass('show')) {
                if ($(this).hasClass('talk')) {
                    $(this).animate({'background-color': '#f9c82e'}, 500);
                } else if ($(this).hasClass('hold-hands')) {
                    $(this).animate({'background-color': '#c1392b'}, 500);
                } else if ($(this).hasClass('cuddle')) {
                    $(this).animate({'background-color': '#5d2e4e'}, 500);
                } else if ($(this).hasClass('kiss')) {
                    $(this).animate({'background-color': '#999999'}, 500);
                }
            } else {
                $(this).animate({'background-color': '#cccccc'}, 500);
            }*/
        });

        contextMenu.children('.contextIcon').on("click", function () {
            var myIndex = $(this).parent().index();
            myIndex -= 1;
            if (myIndex > 0) { myIndex /= 2; } // sjoerd magic

            if($(this).hasClass('edit'))
            {
                var editingComment = $('.active-comment');
                var formControl = editingComment.children('.content-edit').children('.form-control');
                var longContent = editingComment.children('.content-long');

                StoryLine.CommentManager.prevText = "";
                StoryLine.CommentManager.editing = true;

                var short = StoryLine.CommentManager.isShortContentDisplayed(editingComment);
                var long = StoryLine.CommentManager.isLongContentDisplayed(editingComment);

                var callback = function () 
                    {
                        console.log("derpty derp");
                        StoryLine.CommentManager.showTextArea(editingComment, true);
                        editingComment.addClass('editing');
                    };
                
                if(short)
                {
                    console.log("shits short yo");
                    StoryLine.CommentManager.hideShortContent(editingComment, callback);
                } 
                else if (long)
                {
                    console.log("shits long yo");
                    StoryLine.CommentManager.hideLongContent(editingComment, callback);
                } 
                else
                {
                    console.log("ERROR: No content displayed. Editing not possible.");
                }
                
                return;
            }

            if(!$('.event').eq(myIndex).hasClass('delete')){
                $('.event').eq(myIndex).attr('src', $(this).attr('src'));
            }
            else{

            }
        });

        this.getPositions();
    },
    getPositions: function () {
        $('.contextMenu').each(function (index, element) {
            var myParent = $('.scenarioWrapper').eq(index);
            var other = $('#screenWrapper');
            var myLeft = myParent.offset().left - other.offset().left + myParent.width();
            var myTop = myParent.offset.top;

            if ($(myParent).hasClass('talk')) {
                $(this).addClass('talk');
                //.css({'background-color': '#d3a30b'});
            }
            if ($(myParent).hasClass('hold-hands')) {
                $(this).addClass('hold-hands');
                //$(this).css({'background-color': '#8f1508'});
            }
            if ($(myParent).hasClass('cuddle')) {
                $(this).addClass('cuddle');
                //$(this).css({'background-color': '#301026'});
            }
            if ($(myParent).hasClass('kiss')) {
                $(this).addClass('kiss');
                //$(this).css({'background-color': '#665454'});
            }
            if ($(myParent).hasClass('edit')) {
                $(this).addClass('edit');
                //$(this).css({'background-color': '#665454'});
            }

            $(element).css({
                'position': 'absolute',
                'left': myLeft,
                'right': myTop
            });
        });
    }
};