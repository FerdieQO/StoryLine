var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {
    this.currTemplate = null;
    this.prevText = "";
    this.templateEmotion = "../src/editButton(full)(action).png";
    this.editing = false;
    this.editingNew = false;
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

        $('.commentWrapper .content-edit .button').on("click", function (event) {
            var apply = $(this).hasClass('apply'),
                abort = $(this).hasClass('abort'),
                editingComment = $('.commentWrapper.editing');
            if (apply || abort) {
                StoryLine.CommentManager.finishEdit(editingComment, apply);
            }
        });

        $('.commentWrapper').on("click", function (e) {
            console.log(e);
            // Only if the scenario manager allows it and definately not on the template scenario
            var cM = StoryLine.CommentManager,
                commentWrapper = $(this), // $(this),
                disableSort = false;
            if (commentWrapper.parents('.scenarioWrapper').hasClass('template')) {
                console.log("template");
                return;
            }
            if (cM.editing || commentWrapper.hasClass('editing')) {
                return;
            }
            // if this commentWrapper is the template
            if (commentWrapper.hasClass('template')) {
                
                var newComment = cM.cloneCommentTemplate(commentWrapper);
                cM.prevText = "";
                cM.editingNew = cM.editing = true;


                newComment.insertBefore($(commentWrapper));

                cM.hidePlaceholder(newComment, function () {
                    cM.showTextArea(newComment, true);
                    newComment.addClass('editing');
                });

                cM.currTemplate.hide();
            } else {
                // otherwise toggle the visibility
                // and open context menu?

                var hasOpen = StoryLine.CommentManager.toggleComment(commentWrapper);

                if (hasOpen) {
                    disableSort = true;
                }
            }
            if (cM.editing) {
                disableSort = true;
            }
            $(this).parent('.comment-list').sortable("option", "disabled", disableSort);
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
        textArea.fadeOut(200, callback);
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
        textArea.fadeIn(200, function () {
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
        placeholder.fadeOut(200, callback);
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
        placeholder.fadeIn(200);
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
    cloneCommentTemplate: function (templateComment) {
        this.currTemplate = templateComment;
        // Create a new div commentWrapper
        var commentWrapper = $('<div>').addClass('commentWrapper').addClass('light');
        // Clone commentWrapper.template
        var newComment = templateComment.clone(true);

        var elements = newComment.contents();
        elements.appendTo(commentWrapper);

        // Return the div, you'll need to hook it into the correct place.
        return commentWrapper;
    },

    finishEdit: function (commentWrapper, apply) {
        var cM = StoryLine.CommentManager,
            shortContent = commentWrapper.children('.content-short'),
            longContent = commentWrapper.children('.content-long'),
            textArea = commentWrapper.children('.content-edit').children('.form-control');

        if (apply) {
            var text = textArea.val().trim(), img;
            // New value is empty
            if (text.length <= 0) {
                if (cM.prevText.trim().length <= 0) {
                    // No new text and no old text: deleting new comment
                    this.hideTextArea(commentWrapper, function () {
                        commentWrapper.remove();
                        cM.currTemplate.fadeIn(200);
                    });
                    this.resetEditing();
                    return;
                } else {
                    this.hideTextArea(commentWrapper, function () {
                        commentWrapper.removeClass('editing');
                        cM.showLongContent(commentWrapper);
                    });
                    this.resetEditing();
                    return;
                    // TODO: Handle empty value, give a message or something
                }
            }

            // Strip image from text
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
                cM.currTemplate.fadeIn(200);
                cM.showLongContent(commentWrapper);
            });
            textArea.val('');
        } else {
            // if this is a new comment:
            if (cM.prevText.trim().length <= 0) {
                // No new text and no old text: deleting new comment
                this.hideTextArea(commentWrapper, function () {
                    commentWrapper.remove();
                    cM.currTemplate.fadeIn(200);
                });
            } else {
                textArea.val(cM.prevText);
                this.hideTextArea(commentWrapper, function () {
                    commentWrapper.removeClass('editing');
                    cM.showLongContent(commentWrapper);
                });
            }
        }
        this.resetEditing();
    },
    resetEditing: function () {
        this.prevText = "";
        this.editingNew = this.editing = false;
    }
};