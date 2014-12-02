var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {};

StoryLine.CommentManager.prototype = {
    create: function () {

        $('.comment-list.sortable').sortable({
            axis: "y",
            containment: "parent",
            delay: 150,
            //placeholder: "clone",
            //forcePlaceholderSize: true,
            items: "div:not(.new)"
        });

        $('.comment-list.new').disableSelection();

        // Temporary
        var contentShort = $('.content-short').empty().html("<img src='src/emotions/emotieIcon%5Bopgewonden%5D.png' alt='nope'/>Contains a small description..."),
            commentLong = $('.content-long').empty().html("<img src='src/emotions/emotieIcon%5Bopgewonden%5D.png' alt='nope'/>Has some details. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis diam consectetur quam porttitor faucibus vitae in diam. In at turpis dignissim, faucibus felis at, dictum ex. Curabitur faucibus, sapien quis finibus lacinia, odio arcu ultrices eros, nec scelerisque mauris neque id erat. Nullam elementum tincidunt rhoncus. Nulla facilisi. Ut suscipit dolor ipsum, et semper augue auctor ac. Etiam sem sem, congue id dolor et, semper pellentesque odio. Nullam id volutpat leo. Nulla facilisi. Nunc eget ullamcorper dui. Aliquam at nulla non eros tristique viverra sit amet in dolor. Sed placerat augue in ullamcorper dignissim. Not actual details.");

        var count = 1;
        $('.commentWrapper').each(function () {
            if ($(this).hasClass('new')) {
                $(this).children('.content-edit').show();
            } else {
                var short = $(this).children('.content-short');
                short.show();
                short.html(short.html() + count);
                count += 1;
            }
        });

        $('.commentWrapper').click(function () {
            var commentWrapper = $(this);
            var hasOpen = StoryLine.CommentManager.toggleComment(commentWrapper);
            
            $(this).parent('.comment-list').sortable("option", "disabled", hasOpen);
        });
        
        $('.content-edit').keyup(function () {
            StoryLine.DBConnect.collectSuggestions();
        });
    },
    closeComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortComment = commentWrapper.children('.content-short'),
            longComment = commentWrapper.children('.content-long');
        shortComment.hide();
        longComment.hide("blind", {}, 300, function () {
            commentWrapper.switchClass('dark', 'light', 100);
            shortComment.fadeIn(300);
        });
        commentWrapper.removeClass('active-comment');
    },
    openComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortComment = commentWrapper.children('.content-short'),
            longComment = commentWrapper.children('.content-long');
        shortComment.fadeOut(300, function () {
            longComment.show("blind", {}, 300);
        });
        commentWrapper.switchClass('light', 'dark', 100);
        commentWrapper.addClass('active-comment');
    },
    toggleComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        // Exclude the comment class which is for adding new comments
        if (commentWrapper.hasClass('new')) {
            return;
        }

        // Close this comment if it's the active comment
        if (commentWrapper.hasClass('active-comment')) {
            StoryLine.CommentManager.closeComment(commentWrapper);
            return false;
        } else {
            // Close the active comment
            var activeCommentWrapper = $('.active-comment');
            if (activeCommentWrapper) {
                StoryLine.CommentManager.closeComment(activeCommentWrapper);
            }
            // Open the clicked comment
            StoryLine.CommentManager.openComment(commentWrapper);
            return true;
        }
    }
};


