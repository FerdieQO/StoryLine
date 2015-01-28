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
                var content = $(this).children('.content');
                content.show();
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
    isElementDisplayed: function (commentWrapper, element) {
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
        return this.isContentDisplayed(commentWrapper) || this.isTextAreaDisplayed(commentWrapper) || this.isPlaceholderDisplayed(commentWrapper);
    },

    isContentDisplayed: function (commentWrapper) {
        return this.isElementDisplayed(commentWrapper, '.content');
    },
    isTextAreaDisplayed: function (commentWrapper) {
        return this.isElementDisplayed(commentWrapper, '.content-edit');
    },
    isPlaceholderDisplayed: function (commentWrapper) {
        return this.isElementDisplayed(commentWrapper, '.placeholder');
    },


    hideContent: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isElementDisplayed(commentWrapper)) {
            return true;
        }
        var content = commentWrapper.children('.content');
        if (instant === true) {
            content.hide();
        } else {
            content.fadeOut(300, callback);
        }
    },
    hideTextArea: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isTextAreaDisplayed(commentWrapper)) {
            return true;
        }
        var textArea = commentWrapper.children('.content-edit');
        if (instant === true) {
            textArea.hide();
        } else {
            textArea.fadeOut(200, callback);
        }
    },
    hidePlaceholder: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            return;
        }
        if (!this.isPlaceholderDisplayed(commentWrapper)) {
            return true;
        }
        var placeholder = commentWrapper.children('.placeholder');
        if (instant === true) {
            placeholder.hide();
        } else {
            placeholder.fadeOut(200, callback);
        }
    },

    showContent: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            return;
        }
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
            return;
        }
        var content = commentWrapper.children('.content');
        if (instant === true) {
            content.show();
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        } else {
            content.fadeIn(300, function () {
                StoryLine.CommentManager.toggleSortable(commentWrapper);
                if (callback) {
                    callback();
                }
            });
        }
    },
    showTextArea: function (commentWrapper, gainFocus, instant) {
        if (!commentWrapper) {
            return;
        }
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
            return;
        }
        var textArea = commentWrapper.children('.content-edit');
        if (instant === true) {
            textArea.show();
            StoryLine.CommentManager.toggleSortable(commentWrapper);
            if (gainFocus) {
                textArea.children('.form-control').focus();
            }
        } else {
            textArea.fadeIn(200, function () {
                StoryLine.CommentManager.toggleSortable(commentWrapper);
                if (gainFocus) {
                    textArea.children('.form-control').focus();
                }
            });
        }
    },
    showPlaceholder: function (commentWrapper, instant) {
        if (!commentWrapper) {
            return;
        }
        // All must be closed
        if (this.isAnyContentDisplayed(commentWrapper)) {
            return;
        }
        var placeholder = commentWrapper.children('.placeholder');
        if (instant === true) {
            placeholder.show();
            StoryLine.CommentManager.toggleSortable(commentWrapper);
        } else {
            placeholder.fadeIn(200, function () {
                StoryLine.CommentManager.toggleSortable(commentWrapper);
            });
        }
    },

    hideAllContent: function (commentWrapper, instant, callback) { // Callback is called when all elements are closed
        if (!commentWrapper) {
            return;
        }
        // Bools for the elements that when closed are true
        var content, text, place;

        var check = function () {
            if (content && text && place) {
                if (callback) {
                    callback();
                }
            }
        };

        // All must be closed
        //if (this.isAnyContentDisplayed(commentWrapper)) {
        content = this.hideContent(commentWrapper, instant, function () { content = true; check(); });
        text = this.hideTextArea(commentWrapper, instant, function () { text = true; check(); });
        place = this.hidePlaceholder(commentWrapper, instant, function () { place = true; check(); });

        if (instant === true) {
            if (callback) {
                callback();
            }
        }
        //}
    },

    experimentalClose: function (commentWrapper, callback) {
        commentWrapper.removeClass('active-comment', { duration: 100, children: true, complete: function () {
            if (callback) {
                callback();
            }
        }  });
    },

    experimentalOpen: function (commentWrapper, callback) {
        commentWrapper.addClass('active-comment', { duration: 100, children: true, complete: function () {
            if (callback) {
                callback();
            }
        } });
    },

    onlyShowContent: function (commentWrapper, instant, callback) {
        if (instant === true) {
            this.hidePlaceholder(commentWrapper, true);
            this.hideTextArea(commentWrapper, true);
            this.showContent(commentWrapper, true);
            if (callback) {
                callback();
            }
        } else {
            this.hideAllContent(commentWrapper, false, function () {
                StoryLine.CommentManager.showContent(commentWrapper, false, function () {
                    if (callback) {
                        callback();
                    }
                });
            });
        }
    },
    onlyShowTextArea: function (commentWrapper, gainfocus, instant, callback) {
        this.hideAllContent(commentWrapper, instant, function () {
            StoryLine.CommentManager.showTextArea(commentWrapper, gainfocus, instant);
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
        // Idea for dynamic textarea:
        // http://alistapart.com/article/expanding-text-areas-made-elegant
        if (!commentWrapper) {
            return;
        }
        var cM = StoryLine.CommentManager;



        // Hide active element if not edit form
        if (!this.isTextAreaDisplayed(commentWrapper)) {

            if (finishListener) {
                this.finishEditListener = finishListener;
            }

            cM.prevText = commentWrapper.children('.content').text();
            $(commentWrapper).children('.content-edit').children('.form-control').val(cM.prevText);
            cM.editing = true;

            this.onlyShowTextArea(commentWrapper, true, false, function () {
                commentWrapper.addClass('editing');

                if (callback) {
                    callback();
                }
            });
        }
    },

    closeComment: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            return;
        }

        this.onlyShowContent(commentWrapper, instant, function () {
            StoryLine.CommentManager.experimentalClose(commentWrapper, function () {
                var element = commentWrapper;
                /*
                $(element).dotdotdot({
                    // The text to add as ellipsis.
                    ellipsis : '... ',

                    // How to cut off the text/html: 'word'/'letter'/'children'
                    wrap : 'word',

                    // Wrap-option fallback to 'letter' for long words
                    fallbackToLetter: true,

                    // jQuery-selector for the element to keep and put after the ellipsis.
                    after : null,

                    // Whether to update the ellipsis: true/'window'
                    watch : false,
                    // Optionally set a max-height, if null, the height will be measured.
                    height : '2.8em',

                    // Deviation for the height-option.
                    tolerance : 0,

                    // Callback function that is fired after the ellipsis is added, receives two parameters: isTruncated(boolean), orgContent(string).
                    callback : function( isTruncated, orgContent ) { console.log('callback function'); },

                    lastCharacter : {

                        // Remove these characters from the end of the truncated text.
                        remove : [ ' ', ',', ';', '.', '!', '?' ],

                        // Don't add an ellipsis if this array contains the last character of the truncated text.
                        noEllipsis : []
                    }
                });
                */
                if (callback) {
                    callback();
                }});
        });
    },
    openComment: function (commentWrapper, instant, callback) {
        if (!commentWrapper) {
            console.log('commentWrapper is null');
            return;
        }
        this.onlyShowContent(commentWrapper, instant, function () {
            StoryLine.CommentManager.experimentalOpen(commentWrapper, callback);
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
            StoryLine.CommentManager.closeComment(commentWrapper, true);
            return false;
        } else {
            // Close the active comment
            var activeCommentWrapper = $('.active-comment');
            if (activeCommentWrapper) {
                StoryLine.CommentManager.closeComment(activeCommentWrapper, true);
            }
            // Open the clicked comment
            StoryLine.CommentManager.openComment(commentWrapper, true);
            return true;
        }
    },

    cloneCommentTemplate: function (templateComment) {
        this.currTemplate = templateComment;
        // Create a new div commentWrapper
        var commentWrapper = $('<div class="commentWrapper light dark-border">');
        // Clone commentWrapper.template
        var newComment = templateComment.clone(true, true);
        newComment.style = '';

        newComment.removeClass('template');
        //elements.appendTo(commentWrapper);

        // Return the div, you'll need to hook it into the correct place.
        return newComment;
    },
    finishEdit: function (commentWrapper, apply) {
        var cM = StoryLine.CommentManager,
            prevLength = StoryLine.CommentManager.prevText.trim().length,
            content = commentWrapper.children('.content'),
            textArea = commentWrapper.children('.content-edit').children('.form-control'),
            reset = function (cW) {
                cM.resetEditing(cW);
                if (cM.finishEditListener) {
                    cM.finishEditListener(apply);
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
                    cM.openComment(commentWrapper, false, function () {
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
            if (content.has('img').length > 0) {
                img = content.children('img');
            } else {
                img = $('<img src=' + cM.templateEmotion + '>');
            }

            content.text(text);
            content.prepend(img);

            this.openComment(commentWrapper, false, function () {
                textArea.val('');
                commentWrapper.removeClass('editing');
                reset(commentWrapper);
            });
            if (prevLength <= 0) {
                cM.currTemplate.fadeIn(200);
            }

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
                this.hideAllContent(commentWrapper, false, function () {
                    $(commentWrapper).remove();
                    cM.currTemplate.fadeIn(200);
                    reset(commentWrapper);
                });
            } else {
                textArea.val(cM.prevText);
                this.openComment(commentWrapper, false, function () {
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
            if (!cM.isContentDisplayed($(this))) {
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