var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {
    this.currTemplate = null;
    this.prevText = "";
    this.templateEmotion = "../src/editButton(full)(action).png";
    this.editing = false;
};

StoryLine.CommentManager.prototype = {
    create: function () {
        // Select the active scenario

        // TODO: only for active scenario's
        //var commentList = $('.comment-list.sortable');
        $('.comment-list').each(function () {
            StoryLine.CommentManager.initCommentList($(this));
        });
        //this.initCommentLists();


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

        $('.commentWrapper').on("click", function () {
            // Only if the scenario manager allows it and definately not on the template scenario
            var cM = StoryLine.CommentManager,
                commentWrapper = $(this),
                disableSort = false;
            if (commentWrapper.parents('.scenarioWrapper').hasClass('template')) {
                return;
            }
            if (cM.editing || commentWrapper.hasClass('editing')) {
                return;
            }
            // if this commentWrapper is the template
            if (commentWrapper.hasClass('template')) {

                var newComment = cM.cloneCommentTemplate(commentWrapper);
                cM.prevText = "";
                cM.editing = true;

                //commentWrapper.parent('.comment-list').append(newComment);
                newComment.insertBefore(commentWrapper);
                //cM.initCommentList($(cM.currList));
                //cM.initCommentLists();
                //$(commentWrapper.parent('.comment-list')).sortable('refresh');


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
            //cM.toggleSortable(commentWrapper, disableSort);
        });

        $('.content-edit').keyup(function () {
            //StoryLine.DatabaseManager.collectSuggestions();
        });
    },
    initCommentList: function (commentList) {
        
        var children = $(commentList).children('.commentWrapper');
        console.log(children.length);
        children.each(function () {
            var myIndex = $(this).index(),
                light = $(this).hasClass('light'),
                medium = $(this).hasClass('medium'),
                dark = $(this).hasClass('dark');
            if (myIndex % 2 != 0) {
                // Even
                if (light) {
                    $(this).removeClass('light');
                }
                if (dark) {
                    $(this).removeClass('dark');
                }
                if (!medium) {
                    $(this).addClass('medium');
                }
            } else {
                // Odd
                if (light) {
                    $(this).removeClass('light');
                }
                if (medium) {
                    $(this).removeClass('medium');
                }
                if (!dark) {
                    $(this).addClass('dark');
                }
            }
        });
        // Make the commentlist sortable
        $(commentList).sortable({
            connectWith: ".comment-list",
            axis: "y",
            containment: "parent",
            //delay: 150,
            opacity: 0.75,
            //placeholder: "clone",
            //forcePlaceholderSize: true,
            items: ".comment-list > div:not(.template)",
            //cancel: ".template",
            start: function (event, ui) {
                console.log("Start sorting");
            }
        });
        //console.log($(commentList));
        //console.log($(commentList).sortable('widget'));
        $(commentList).disableSelection();
        //$(commentList).sortable('refresh');
    },

    // check if the element is displayed
    isContentDisplayed: function (commentWrapper, element) {
        if (!commentWrapper) {
            return false;
        }
        var element = commentWrapper.children(element);
        if (!element) {
            console.warn("commentWrapper does not contain element '" + element + "'.");
            return false;
        }
        return element.css('display') !== "none";
    },

    isShortContentDisplayed: function (commentWrapper) {
        return this.isContentDisplayed(commentWrapper, '.content-short');
    },
    isLongContentDisplayed: function (commentWrapper) {
        return this.isContentDisplayed(commentWrapper, '.content-long');
    },
    isTextAreaDisplayed: function (commentWrapper) {
        return this.isContentDisplayed(commentWrapper, '.content-edit');
    },
    isPlaceholderDisplayed: function (commentWrapper) {
        return this.isContentDisplayed(commentWrapper, '.placeholder');
    },

    hideShortContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isShortContentDisplayed(commentWrapper)) {
            return;
        }
        var shortContent = commentWrapper.children('.content-short');
        shortContent.fadeOut(300, callback);
    },
    hideLongContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isLongContentDisplayed(commentWrapper)) {
            return;
        }
        var longContent = commentWrapper.children('.content-long');
        longContent.hide("blind", {}, 300, callback);
    },
    hideTextArea: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isTextAreaDisplayed(commentWrapper)) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        textArea.fadeOut(200, callback);
    },
    hidePlaceholder: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isPlaceholderDisplayed(commentWrapper)) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        placeholder.fadeOut(200, callback);
    },

    showShortContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        if (this.isShortContentDisplayed(commentWrapper)) {
            return;
        }
        var shortContent = commentWrapper.children('.content-short');
        shortContent.fadeIn(300, function () {
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        });
    },
    showLongContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        if (this.isLongContentDisplayed(commentWrapper)) {
            return;
        }
        var longContent = commentWrapper.children('.content-long');
        longContent.show("blind", {}, 300, function () {
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        });
    },
    showTextArea: function (commentWrapper, gainFocus) {
        if (!commentWrapper) {
            return;
        }
        if (this.isTextAreaDisplayed(commentWrapper)) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        textArea.fadeIn(200, function () {
            StoryLine.CommentManager.toggleSortable(commentWrapper);
            if (gainFocus) {
                textArea.children('.form-control').focus();
            }
        });
    },
    showPlaceholder: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        if (this.isPlaceholderDisplayed(commentWrapper)) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        placeholder.fadeIn(200, function () {
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        });
    },

    closeComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        var shortContent = commentWrapper.children('.content-short');
        shortContent.hide();
        this.hideLongContent(commentWrapper, function () {
            commentWrapper.switchClass('medium', 'light', 100);
            commentWrapper.removeClass('active-comment');
            StoryLine.CommentManager.showShortContent(commentWrapper);
        });
    },
    openComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        this.hideShortContent(commentWrapper, function () {
            commentWrapper.switchClass('light', 'medium', 100);
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
        var commentWrapper = $('<div class="commentWrapper light dark-border">');
        // Clone commentWrapper.template
        var newComment = templateComment.clone(true, true);

        newComment.removeClass('template');
        //elements.appendTo(commentWrapper);

        // Return the div, you'll need to hook it into the correct place.
        return newComment;
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
                    this.resetEditing(commentWrapper);
                    return;
                } else {
                    this.hideTextArea(commentWrapper, function () {
                        commentWrapper.removeClass('editing');
                        cM.showLongContent(commentWrapper);
                    });
                    this.resetEditing(commentWrapper);
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
                cM.showShortContent(commentWrapper);
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
        this.resetEditing(commentWrapper);
    },
    toggleSortable: function (commentWrapper) {
        $('.sortable').sortable('refresh');
        // Check if all of the comments are showing the short-content
        var cM = StoryLine.CommentManager,
            commentList = commentWrapper.parent('.comment-list'),
            comments = commentList.children('.commentWrapper'),
            disable = false;
        comments.each(function (index) {
            //console.log(comments.length);
            if ($(this).hasClass('template')) {
                if (comments.length === 1) {
                    disable = true;
                }
                return;
            }
            if (!cM.isShortContentDisplayed($(this))) {
                disable = true;
            }
        });
        //$(commentList).sortable("option", "disabled", disable);
        $(commentList).sortable("refresh");
        //console.log(commentList.sortable("widget"));
        //console.log("Sorting: " + (disable ? "disabled." : "enabled."));
    },
    resetEditing: function (commentWrapper) {
        //console.log(this.currTemplate.parents('.comment-list'));
        //console.log(this.currTemplate.parents('.comment-list').parents('.comment-list-wrapper').parents('.scenario').parents('.scenarioWrapper'));
        this.initCommentList(commentWrapper.parents('.comment-list'));
        this.initCommentList(this.currTemplate.parents('.comment-list'));
        this.prevText = "";
        this.editing = false;
    }
};