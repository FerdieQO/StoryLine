var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {
    var prevText = "",
        templateEmotion = '../src/editButton(full)(action).png';
};

StoryLine.CommentManager.prototype = {
    create: function () {
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
            if ($(this).hasClass('template')) {
                console.log('Show placeholder');
                $(this).children('.placeholder').show();
            } else {
                var short = $(this).children('.content-short');
                short.show();
            }
        });
        $('.commentWrapper .content-edit .apply').on("click", function () {
            var editingComment = $('.commentWrapper.editing');
            StoryLine.CommentManager.applyEditComment(editingComment);
        });
        $('.commentWrapper .content-edit .cancel').on("click", function () {
            var editingComment = $('.commentWrapper.editing');
            StoryLine.CommentManager.cancelEditComment(editingComment);
        });
        $('.commentWrapper').on("click", function () {
            var commentWrapper = $(this);
            // if this commentWrapper is the template: make the textarea visible
            console.log('Onclick');
            if (commentWrapper.hasClass('template')) {
                if (!commentWrapper.hasClass('editing')) {
                    StoryLine.CommentManager.editComment(commentWrapper);
                }



                //.show();
                //$(this).
            } else {
                // otherwise toggle the visibility
                var hasOpen = StoryLine.CommentManager.toggleComment(commentWrapper);

                $(this).parent('.comment-list').sortable("option", "disabled", hasOpen);
            }
        });

        $('.content-edit').keyup(function () {
            //StoryLine.DatabaseManager.collectSuggestions();
        });
    },
    hideShortContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        var shortComment = commentWrapper.children('.content-short');
        // If this element is already hidden
        if (shortComment.css('display') === "none") {
            return;
        }
        shortComment.fadeOut(300, callback);
    },
    showShortContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortComment = commentWrapper.children('.content-short');
        // If this element is not hidden
        if (shortComment.css('display') !== "none") {
            return;
        }
        shortComment.fadeIn(300);
    },
    hideLongContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        var longComment = commentWrapper.children('.content-long');
        // If this element is already hidden
        if (longComment.css('display') === "none") {
            return;
        }
        longComment.hide("blind", {}, 300, callback);
    },
    showLongContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var longComment = commentWrapper.children('.content-long');
        // If this element is not hidden
        if (longComment.css('display') !== "none") {
            return;
        }
        longComment.show("blind", {}, 300);
    },
    hideTextArea: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        // If this element is already hidden
        if (textArea.css('display') === "none") {
            return;
        }
        textArea.fadeOut(300, callback);
    },
    showTextArea: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        // If this element is not hidden
        if (textArea.css('display') !== "none") {
            return;
        }
        textArea.show();
    },
    hidePlaceholder: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        // If this element is already hidden
        if (placeholder.css('display') === "none") {
            return;
        }
        placeholder.fadeOut(300, callback);
    },
    showPlaceholder: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        // If this element is not hidden
        if (placeholder.css('display') !== "none") {
            return;
        }
        placeholder.fadeIn(300);
    },


    closeComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortComment = commentWrapper.children('.content-short');
        shortComment.hide();
        this.hideLongContent(commentWrapper, function () {
            commentWrapper.switchClass('dark', 'light', 100);
            commentWrapper.removeClass('active-comment');
            StoryLine.CommentManager.showShortContent(commentWrapper);
        });
    },
    openComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        this.hideShortContent(commentWrapper, function () {
            commentWrapper.switchClass('light', 'dark', 100);
            commentWrapper.addClass('active-comment');
            StoryLine.CommentManager.showLongContent(commentWrapper);
        });
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
        var img = $('<img>');
        img.attr('src', image);
        img.prependTo(p);
        //commentWrapper.append(p);
        console.log(p);

        // Create <img> and <p> elements (long-content and short-content)

        // Insert new commentWrapper before the template
        
        $(list).append(commentWrapper);
    },
    editComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }

        var longComment = commentWrapper.children('.content-long'),
            textArea = commentWrapper.children('.content-edit').children('.form-control');

        this.prevText = longComment.text();

        this.hidePlaceholder(commentWrapper, function () {
            commentWrapper.addClass('editing');
            commentWrapper.switchClass('light', 'dark', 100);
            StoryLine.CommentManager.showTextArea(commentWrapper);
        });
    },
    applyEditComment: function (commentWrapper) {
        
        var textArea = commentWrapper.children('.content-edit').children('.form-control');
        if (commentWrapper.hasClass('template')) {
            // if template: create comment
            this.createComment(commentWrapper.parent(), this.templateEmotion, textArea.val().trim());
        } else {

        }

/*
        var shortComment = commentWrapper.children('.content-short'),
            longComment = commentWrapper.children('.content-long'),
            textArea = commentWrapper.children('.content-edit').children('.form-control');

        // Short this in?
        shortComment.text(textArea.val().trim());
        longComment.text(textArea.val().trim());

*/

        // if template: create comment

        // otherwise: edit long content
    },
    cancelEditComment: function (commentWrapper) {
        // reset text in textarea to previous value
        var textArea = commentWrapper.children('.content-edit').children('.form-control');
        textArea.val(StoryLine.CommentManager.prevText);
        StoryLine.CommentManager.prevText = "";

        StoryLine.CommentManager.hideTextArea(commentWrapper, function () {
            commentWrapper.removeClass('editing');
            commentWrapper.switchClass('dark', 'light', 100);
            // if template, show placeholder
            if (commentWrapper.hasClass('template')) {
                StoryLine.CommentManager.showPlaceholder(commentWrapper);
            }
            // if existing comment, show content
            else {
                StoryLine.CommentManager.showLongContent(commentWrapper);
            }
        });


    }
};


