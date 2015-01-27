var StoryLine = StoryLine || {};

StoryLine.ContextMenuManager = function () {
    this.templateContextMenu = null;
    this.toggling = false;
    this.activeContextMenu = null;
    // Contains the element which it is active for.
    this.activeTarget = null;
};

StoryLine.ContextMenuManager.prototype = {
    create: function () {
        // Initialise each contextMenu except for the template
        $('.contextMenu:not(.template)').each(function (index, element) {
            StoryLine.ContextMenuManager.initContextMenu($(this));
        });

        // 
        $('.scenario-list').scroll(function () {
            StoryLine.ContextMenuManager.getPositions();
        });

        $(window).resize(function () {
            StoryLine.ContextMenuManager.getPositions();
        });
    },
    /// Returns a new contextMenu div
    cloneContextMenuTemplate: function () {
        var contextMenu = $('<div class="contextMenu dark medium-border">'),
            template = this.templateContextMenu.clone(true),
            elements = template.contents();
        elements.appendTo(contextMenu);
        contextMenu.hide();
        return contextMenu;
    },
    getContextMenu: function (scenarioWrapper) {
        var myIndex = scenarioWrapper.index(),
            contextMenu;
        if (myIndex > 0) { myIndex /= 2; }
        contextMenu = $('.contextMenu').eq(myIndex);
        return contextMenu === undefined ? false : contextMenu;
    },
    initContextMenu: function (scenarioWrapper, menuTarget) {
        StoryLine.ContextMenuManager.getPositions();
        // Get the contextMenu for this scenarioWrapper
        var cMM = StoryLine.ContextMenuManager,
            cM = StoryLine.CommentManager,
            contextMenu = this.getContextMenu($(scenarioWrapper));
        //console.log(contextMenu);

        // TODO: Set the buttons here (menuTarget for which target was clicked at; string event/emotion/etc.)

        // removeChild apparently doesn't work ?
        // I'm even tempted to change how the buttons work so they are all in the contextMenu and their visibility gets toggled.
        // A.k.a. keep with the css classes like edit or delete
        if (contextMenu) {
            if (menuTarget) {
                this.updateButtons(scenarioWrapper, contextMenu, menuTarget);
            }

            var icons = contextMenu.children().children('.contextIcon');
            var buttonGroups = contextMenu.children().children();
            buttonGroups.children('.contextIcon').each(function () {
                //console.log(this);

                // override onclick so it won't be called multiple times
                this.onclick = function () {
                    var menu = StoryLine.HelperFunctions.getParent($(this), 'contextMenu', 4);
                    var myIndex = menu.index();
                    var hide;
                    myIndex -= 1;
                    if (myIndex > 0) { myIndex /= 2; }
                    // Replace with classes? cause it's flippin' ugly
                    var src = $(this).attr('src');
                    var activeTarget = StoryLine.ContextMenuManager.activeTarget,
                        activeContextMenu = StoryLine.ContextMenuManager.activeContextMenu;
                    if (activeContextMenu) {
                        if ($(this).hasClass('setevent')) {
                            if (activeTarget.hasClass('event')) {
                                StoryLine.ScenarioManager.setScenarioEvent(activeTarget, $(this));
                            }
                            hide = true;
                        } else if ($(this).hasClass('edit')) {
                            if (activeTarget.hasClass('commentWrapper')) {
                                StoryLine.CommentManager.editComment(activeTarget, 
                                                                     function () {
                                    StoryLine.ContextMenuManager.updateContextMenu(StoryLine.ScenarioManager.activeScenario);
                                }, function (apply) {
                                    StoryLine.ContextMenuManager.updateContextMenu(StoryLine.ScenarioManager.activeScenario);
                                });
                            }
                        } else if ($(this).hasClass('delete')) {
                            if (activeTarget.hasClass('commentWrapper')) {
                                var commentlist = activeTarget.parent();
                                $('.active-comment').remove();
                                StoryLine.CommentManager.initCommentList(commentlist);
                            } else if (activeTarget.hasClass('event')) {
                                StoryLine.ScenarioManager.setScenarioEvent(activeTarget);
                            } else if (activeTarget.hasClass('emotion')) {
                                StoryLine.ScenarioManager.setScenarioEmotion(StoryLine.ScenarioManager.activeScenario, activeTarget);
                            }
                            hide = true;
                        } else if ($(this).hasClass('apply')) {
                            StoryLine.CommentManager.finishEdit(activeTarget, true);
                        } else if ($(this).hasClass('abort')) {
                            StoryLine.CommentManager.finishEdit(activeTarget, false);
                        } else if ($(this).hasClass('setemotion')) {
                            if (activeTarget.hasClass('emotion medium dark-border')) {
                                StoryLine.ScenarioManager.setScenarioEmotion(StoryLine.ScenarioManager.activeScenario, activeTarget, $(this));
                                hide = true;
                            } else if (activeTarget.hasClass('emotion medium pull-right dark-border')) {
                                StoryLine.ScenarioManager.setScenarioEmotion(StoryLine.ScenarioManager.activeScenario, activeTarget, $(this));
                                hide = true;
                            }
                        }
                    }

                    // close it on success and it needs to be closed
                    if (hide) {
                        StoryLine.ContextMenuManager.hideContextMenu(menu);
                    }

                };
            });
            //contextMenu.children('.contextIcon').click();
        }

        return contextMenu;
    },
    updateContextMenu: function (scenarioWrapper, menuTarget) {
        var contextMenu = this.getContextMenu(scenarioWrapper);
        this.updateButtons(scenarioWrapper, contextMenu, menuTarget);
    },
    updateButtons: function (scenarioWrapper, contextMenu, menuTarget) {
        if (contextMenu) {
            if (!menuTarget) {
                if (this.activeTarget) {
                    menuTarget = this.activeTarget;
                } else {
                    return;
                }
            }
            var buttons = contextMenu.children('.buttons');
            var scenarioButtons = buttons.children('.scenario'),
                eventButtons = buttons.children('.event'),
                emotionButtons = buttons.children('.emotion'),
                commentButtons = buttons.children('.comment'),
                otherButtons = buttons.children('.other');
            
            var showDelete = true;
            if (menuTarget.hasClass('event') || menuTarget.hasClass('emotion')) {
                var title = menuTarget.attr('title');
                if (!title || title === 'Selecteer een actie' || title === 'Voeg jouw emotie toe' || title === 'Voeg de emotie van de ander toe') {
                    showDelete = false;
                }
            }
            buttons.children().hide();

            if (menuTarget.hasClass('scenario')) {
                scenarioButtons.show();
            } else if (menuTarget.hasClass('event')) {
                eventButtons.show();
            } else if (menuTarget.hasClass('emotion')) {
                emotionButtons.show();
            } else if (menuTarget.hasClass('commentWrapper')) {
                commentButtons.show();
                if (StoryLine.CommentManager.editing) {
                    showDelete = false;
                    commentButtons.children('.edit').hide();
                    commentButtons.children('.apply, .abort').show();
                } else {
                    showDelete = true;
                    commentButtons.children('.apply, .abort').hide();
                    commentButtons.children('.edit').show();
                }
            }
            if (showDelete) {
                otherButtons.show();
            } else {
                otherButtons.hide();
            }
            
           // StoryLine.ScenarioManager.alignButtonsToElement(scenarioWrapper, menuTarget, contextMenu);
        }
    },
    isContextMenuDisplayed: function (contextMenu) {
        if (!contextMenu) {
            console.warn("contextMenu does not exist.");
            return false;
        }
        var active, displayed;
        active = contextMenu.hasClass('active');
        displayed = contextMenu.css('display') !== "none";
        // Return active if displayed
        return displayed ? active : false;
    },
    hideContextMenu: function (contextMenu, callback) {
        if (!contextMenu) {
            return;
        }
        this.toggling = true;
        if (!this.isContextMenuDisplayed(contextMenu) || !contextMenu.hasClass('active')) {
            if (contextMenu.is(StoryLine.ContextMenuManager.activeContextMenu)) {
                this.activeContextMenu = null;
                this.activeTarget = null;
            }
            StoryLine.ContextMenuManager.toggling = false;
            return;
        }
        contextMenu.animate({width: 'toggle', duration: 350, queue: false }, function () {
            contextMenu.removeClass('active');

            if (contextMenu.is(StoryLine.ContextMenuManager.activeContextMenu)) {
                StoryLine.ContextMenuManager.activeContextMenu = null;
                StoryLine.ContextMenuManager.activeTarget.removeClass('highlight');
                StoryLine.ContextMenuManager.activeTarget = null;
                StoryLine.Main.unlockScrolling();
            }
            StoryLine.ContextMenuManager.toggling = false;
            if (callback) {
                callback();
            }
        });
        //contextMenu.removeClass('active');

        //$(this).toggleClass('active');//.children('.scenario')
    },
    showContextMenu: function (contextMenu, menuTarget) {
        if (!contextMenu) {
            return;
        }
        this.toggling = true;
        if (this.isContextMenuDisplayed(contextMenu) || contextMenu.hasClass('active')) {
            if (!this.activeContextMenu || !this.activeContextMenu.is(contextMenu)) {
                if (this.activeContextMenu) {
                    this.activeContextMenu.removeClass('highlight');
                }
                menuTarget.addClass('highlight');
                this.activeContextMenu = contextMenu;
                this.activeTarget = menuTarget;
            }
            this.toggling = false;
            return;
        }
        contextMenu.addClass('active');
        contextMenu.animate({width: 'toggle', queue: false}, 350, function () {
            menuTarget.addClass('highlight');
            StoryLine.ContextMenuManager.activeContextMenu = contextMenu;
            StoryLine.ContextMenuManager.activeTarget = menuTarget;
            StoryLine.ContextMenuManager.toggling = false;
        });
    },
    openContextMenu: function (scenarioWrapper, menuTarget) {
        var contextMenu = this.initContextMenu(scenarioWrapper, menuTarget);
        StoryLine.Main.lockScrollviewToScenario(scenarioWrapper);
        this.showContextMenu(contextMenu, menuTarget);
    },
    closeContextMenu: function (scenarioWrapper, callback) {
        var contextMenu = this.getContextMenu(scenarioWrapper);

        this.hideContextMenu(contextMenu, callback);
    },
    getPositions: function () {
        $('.contextMenu').each(function (index, element) {
            var myParent = $('.scenarioWrapper').eq(index),
                other = $('#screenWrapper'),
                myLeft = myParent.offset().left - other.offset().left + myParent.width(),
                myTop = myParent.offset.top;

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

            $(element).css({
                'position': 'absolute',
                'left': myLeft,
                'right': myTop
            });
        });
    }
};