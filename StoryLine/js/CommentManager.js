var StoryLine = StoryLine || {};

StoryLine.CommentManager = function () {
    this.currTemplate = null;
    this.finishEditListener = null;
    this.prevText = "";
    this.templateEmotion = "src/editButton(full)(action).png";
    this.editing = false;
};

StoryLine.CommentManager.prototype = {
    create: function () {
        // Select the active scenario

        // TODO: only for active scenario's
        $('.comment-list').each(function () {
            StoryLine.CommentManager.initCommentList($(this));
        });

        // Temporary
        $('.commentWrapper').each(function () {
            if ($(this).hasClass('template')) {
                $(this).children('.placeholder').show();
            } else {
                var short = $(this).children('.content-short');
                short.show();
            }
        });

        // Should eventually be changed to contextMenu
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
                if (cM.editing) {
                    // Feedback that it isn't allowed
                    return;
                }

                /*
                var newComment = cM.addComment(commentWrapper);
                //cM.initCommentList($(cM.currList));
                //cM.initCommentLists();
                //$(commentWrapper.parent('.comment-list')).sortable('refresh');
                cM.editComment(newComment, function () {
                    cM.currTemplate.hide();
                });*/
            } else {
                // otherwise toggle the visibility
                // and open context menu?
                /*
                var hasOpen = StoryLine.CommentManager.toggleComment(commentWrapper);

                if (hasOpen) {
                    disableSort = true;
                }*/
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
        //console.log(children.length);
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

    isAnyContentDisplayed: function (commentWrapper) {
        return this.isShortContentDisplayed(commentWrapper) || this.isLongContentDisplayed(commentWrapper) ||
            this.isTextAreaDisplayed(commentWrapper) || this.isPlaceholderDisplayed(commentWrapper);
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
            return true;
        }
        var shortContent = commentWrapper.children('.content-short');
        shortContent.fadeOut(300, callback);
    },
    hideLongContent: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isLongContentDisplayed(commentWrapper)) {
            return true;
        }
        var longContent = commentWrapper.children('.content-long');
        longContent.hide("blind", {}, 300, callback);
    },
    hideTextArea: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isTextAreaDisplayed(commentWrapper)) {
            return true;
        }
        var textArea = commentWrapper.children('.content-edit');
        textArea.fadeOut(200, callback);
    },
    hidePlaceholder: function (commentWrapper, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isPlaceholderDisplayed(commentWrapper)) {
            return true;
        }
        var placeholder = commentWrapper.children('.placeholder');
        placeholder.fadeOut(200, callback);
    },

    showShortContent: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
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
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
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
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
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
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        placeholder.fadeIn(200, function () {
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        });
    },

    hideAllContent: function (commentWrapper, callback) { // Callback is called when all elements are closed
        if (!commentWrapper) {
            return;
        }
        // Bools for the elements that when closed are true
        var short, long, text, place;

        var check = function () {
            if (short && long && text && place) {
                callback();
            }
        };

        // All must be closed
        //if (this.isAnyContentDisplayed(commentWrapper)) {
        short = this.hideShortContent(commentWrapper, function () { short = true; check(); });
        long = this.hideLongContent(commentWrapper, function () { long = true; check(); });
        text = this.hideTextArea(commentWrapper, function () { text = true; check(); });
        place = this.hidePlaceholder(commentWrapper, function () { place = true; check(); });
        //}
    },

    onlyShowShortContent: function (commentWrapper, callback) {
        this.hideAllContent(commentWrapper, function () {
            StoryLine.CommentManager.showShortContent(commentWrapper);
            if (callback) {
                callback();
            }
        });
    },
    onlyShowLongContent: function (commentWrapper, callback) {
        this.hideAllContent(commentWrapper, function () {
            StoryLine.CommentManager.showLongContent(commentWrapper);
            if (callback) {
                callback();
            }
        });
    },
    onlyShowTextArea: function (commentWrapper, gainfocus, callback) {
        this.hideAllContent(commentWrapper, function () {
            StoryLine.CommentManager.showTextArea(commentWrapper, gainfocus);
            if (callback) {
                callback();
            }
        });
    },
    onlyShowPlaceholder: function (commentWrapper, callback) {
        this.hideAllContent(commentWrapper, function () {
            StoryLine.CommentManager.showPlaceholder(commentWrapper);
            if (callback) {
                callback();
            }
        });
    },

    addComment: function (templateCommentWrapper) {
        var newComment = StoryLine.CommentManager.cloneCommentTemplate(templateCommentWrapper);
        newComment.insertBefore(templateCommentWrapper);
        return $(newComment);
    },
    editComment: function (commentWrapper, callback, finishListener) {
        if (!commentWrapper) {
            return;
        }
        var cM = StoryLine.CommentManager;

        // Hide active element if not edit form
        if (!this.isTextAreaDisplayed(commentWrapper)) {

            cM.prevText = commentWrapper.children('.content-long').text();
            $(commentWrapper).children('.content-edit').children('.form-control').val(cM.prevText);
            cM.editing = true;

            this.onlyShowTextArea(commentWrapper, true, function () {
                commentWrapper.addClass('editing');
                if (finishListener) {
                    cM.finishEditListener = finishListener;
                }
                if (callback) {
                    callback();
                }
            });
        }
    },

    closeComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }

        this.onlyShowShortContent(commentWrapper, function () {
            commentWrapper.removeClass('active-comment');
        });
    },
    openComment: function (commentWrapper) {
        if (!commentWrapper) {
            return;
        }

        this.onlyShowLongContent(commentWrapper, function () {
            commentWrapper.addClass('active-comment');
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
            prevLength = StoryLine.CommentManager.prevText.trim().length,
            shortContent = commentWrapper.children('.content-short'),
            longContent = commentWrapper.children('.content-long'),
            textArea = commentWrapper.children('.content-edit').children('.form-control'),
            reset = function (cW) {
                cM.resetEditing(cW);
                if (cM.finishEditListener) {
                    console.log('Finish');
                    cM.finishEditListener();
                }
            };

        if (apply) {
            var text = textArea.val().trim(), img;
            // New value is empty
            if (text.length <= 0) {
                if (prevLength <= 0) {
                    // No new text and no old text: deleting new comment
                    this.hideAllContent(commentWrapper, function () {
                        commentWrapper.remove();
                        cM.currTemplate.fadeIn(200);
                        reset(commentWrapper);
                    });
                    return;
                } else {
                    cM.onlyShowLongContent(commentWrapper, function () {
                        commentWrapper.removeClass('editing');
                        reset(commentWrapper);
                    });

                    /*
                    this.hideTextArea(commentWrapper, function () {
                        commentWrapper.removeClass('editing');
                        cM.onlyShowLongContent(commentWrapper);
                        reset(commentWrapper);
                    });
                    */
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


            this.onlyShowLongContent(commentWrapper, function () {
                textArea.val('');
                commentWrapper.removeClass('editing');
                if (prevLength <= 0) {
                    cM.currTemplate.fadeIn(200);
                }
                reset(commentWrapper);
            });

            /*
            this.hideTextArea(commentWrapper, function () {
                commentWrapper.removeClass('editing');
                cM.currTemplate.fadeIn(200);
                cM.closeComment(commentWrapper);
            });
            textArea.val('');
            */

        } else {
            // if this is a new comment:
            if (prevLength <= 0) {
                // No new text and no old text: deleting new comment
                this.hideAllContent(commentWrapper, function () {
                    commentWrapper.remove();
                    cM.currTemplate.fadeIn(200);
                    reset(commentWrapper);
                });
            } else {
                textArea.val(cM.prevText);
                this.onlyShowLongContent(commentWrapper, function () {
                    commentWrapper.removeClass('editing');
                    reset(commentWrapper);
                });
            }
        }

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