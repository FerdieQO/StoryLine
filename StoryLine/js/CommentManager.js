var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {

};

StoryLine.CommentManager.prototype = {
    create: function () {
        console.log("CommentManager.create");
        // Select the active scenario

        // TODO: only for active scenario's

        // Make the commentlist sortable and exclude 
        $('.comment-list.sortable').sortable({
            axis: "y",
            containment: "parent",
            delay: 150,
            //placeholder: "clone",
            //forcePlaceholderSize: true,
            items: "div:not(.template)"
        });

        $('.comment-list.template').disableSelection();


        // Temporary
        $('.commentWrapper').each(function () {
            console.log('Show placeholder');
            if ($(this).hasClass('template')) {
                console.log('Show placeholder');
                $(this).children('.placeholder').show();
            } else {
                var short = $(this).children('.content-short');
                short.show();
            }
        });

        $('.commentWrapper').on("click", function () {
            var commentWrapper = $(this);
            // if this commentWrapper is the template: make the textarea visible
            if ($(this).hasClass('template')) {
                
                //$(this).
            } else {
                // otherwise toggle the visibility
                var hasOpen = StoryLine.CommentManager.toggleComment(commentWrapper);

                $(this).parent('.comment-list').sortable("option", "disabled", hasOpen);
            }
        });

        $('.content-edit').keyup(function () {
            StoryLine.DatabaseManager.collectSuggestions();
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
        if (commentWrapper.hasClass('template')) {
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
    },
    createComment: function (list, image, text) {
        // Create wrapper element
        var commentWrapper = $('<div>').addClass('commentWrapper').addClass('light');

        var p = $('<p>').text(text);
        var img = $('<img>').src(img).prependTo(p);

        // Create <img> and <p> elements (long-content and short-content)

        // Insert new commentWrapper before the template
        list.insertBefore(commentWrapper, list.lastChild);
    }
};


