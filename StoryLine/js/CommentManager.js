var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {
    this.templateComment = null;
    this.prevText = "";
    this.templateEmotion = "../src/editButton(full)(action).png";
    this.editing = false;
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
            opacity: 0.25,
            //placeholder: "clone",
            //forcePlaceholderSize: true,
            items: ".commentWrapper:not(.template)"
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
        $('.commentWrapper .content-edit .button').on("click", function () {
            var apply = $(this).hasClass('apply'),
                abort = $(this).hasClass('abort'),
                editingComment = $('.commentWrapper.editing');
            if (apply || abort) {
                StoryLine.CommentManager.finishEdit(editingComment, apply);
            }
        });
        $('.commentWrapper').on("click", function () {
            var cM = StoryLine.CommentManager,
                commentWrapper = $(this);
            if (cM.editing || commentWrapper.hasClass('editing')) {
                return;
            }

            // if this commentWrapper is the template
            if (commentWrapper.hasClass('template')) {
                var newComment = cM.cloneCommentTemplate(),
                    template = cM.templateComment;

                newComment.insertBefore($(template));
                cM.hidePlaceholder(newComment, function () {
                    cM.showTextArea(newComment, true);
                    newComment.addClass('editing');
                });
                StoryLine.CommentManager.templateComment.hide();
                //StoryLine.CommentManager.editComment(commentWrapper);
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
        var shortContent = commentWrapper.children('.content-short');
        // If this element is already hidden
        if (shortContent.css('display') === "none") {
            return;
        }
        shortContent.fadeOut(300, callback);
    },
    showShortContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortContent = commentWrapper.children('.content-short');
        // If this element is not hidden
        if (shortContent.css('display') !== "none") {
            return;
        }
        shortContent.fadeIn(300);
    },
    hideLongContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        var longContent = commentWrapper.children('.content-long');
        // If this element is already hidden
        if (longContent.css('display') === "none") {
            return;
        }
        longContent.hide("blind", {}, 300, callback);
    },
    showLongContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var longContent = commentWrapper.children('.content-long');
        // If this element is not hidden
        if (longContent.css('display') !== "none") {
            return;
        }
        longContent.show("blind", {}, 300);
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
    showTextArea: function (commentWrapper, gainFocus) {
        if (!commentWrapper) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        // If this element is not hidden
        if (textArea.css('display') !== "none") {
            return;
        }
        textArea.fadeIn(300, function () {
            if (gainFocus) {
                textArea.children('.form-control').focus();
            }
        });
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
        var shortContent = commentWrapper.children('.content-short');
        shortContent.hide();
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

    cloneCommentTemplate: function () {
        // Create a new div commentWrapper
        var commentWrapper = $('<div>').addClass('commentWrapper').addClass('light');
        // Clone commentWrapper.template
        var template = StoryLine.CommentManager.templateComment.clone(true);

        var elements = template.contents();
        elements.appendTo(commentWrapper);

        // Return the div, you'll need to hook it into the correct place.
        return commentWrapper;
    },

    finishEdit: function (commentWrapper, apply) {
        var cM = StoryLine.CommentManager;
        if (apply) {
            var shortContent = commentWrapper.children('.content-short'),
                longContent = commentWrapper.children('.content-long'),
                textArea = commentWrapper.children('.content-edit').children('.form-control');
            var text = textArea.val().trim();

            // Strip image from text
            var img;
            if (shortContent.has('img').length > 0) {
                img = shortContent.children('img');
            } else {
                img = $('<img src=' + cM.templateEmotion + '>');
            }

            shortContent.text(text);
            shortContent.prepend(img);
            longContent.text(text);
            longContent.prepend(img.clone(true));

            this.hideTextArea(commentWrapper, function () {
                commentWrapper.removeClass('editing');
                cM.templateComment.fadeIn(300);
                cM.showLongContent(commentWrapper);
            });
            textArea.val('');

        } else {

        }
    },

    createComment: function (list, image, text) {
        // Create wrapper element
        var commentWrapper = $('<div>').addClass('commentWrapper').addClass('light');

        var p = $('<p>').text(text);
        var img = $('<img>');
        img.attr('src', image);
        img.prependTo(p);

        var comment = this.cloneCommentTemplate();
        this.setCommentContent(comment, p);

        //commentWrapper.append(p);
        console.log(p);

        // Create <img> and <p> elements (long-content and short-content)

        // Insert new commentWrapper before the template
        comment.insertBefore($(list).children('.template'));
        this.hideTextArea(comment, function () {
            StoryLine.CommentManager.showLongContent(comment);
        });
        this.hideTextArea(this.templateComment, function () {
            StoryLine.CommentManager.showPlaceholder(StoryLine.CommentManager.templateComment);
        });
        //$(list).append(commentWrapper);
    },
    editComment: function (commentWrapper, edit) {
        if (!commentWrapper) {
            return;
        }

        var longContent = commentWrapper.children('.content-long'),
            textArea = commentWrapper.children('.content-edit').children('.form-control');

        this.prevText = longContent.text();

        if (edit) {
            this.hidePlaceholder(commentWrapper, function () {
                commentWrapper.addClass('editing');
                commentWrapper.switchClass('light', 'dark', 100);
                StoryLine.CommentManager.showTextArea(commentWrapper);
            });
        } else {

        }

    }
};


