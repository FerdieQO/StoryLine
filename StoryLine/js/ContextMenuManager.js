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
            var icons = contextMenu.children('.contextIcon');
            contextMenu.children('.contextIcon').each(function () {
                //console.log(this);

                // override onclick so it won't be called multiple times
                this.onclick = function () {
                    var menu = $(this).parent();
                    var myIndex = menu.index();
                    var hide;
                    myIndex -= 1;
                    if (myIndex > 0) { myIndex /= 2; }
                    // Replace with classes? cause it's flippin' ugly
                    var src = $(this).attr('src');
                    var activeTarget = StoryLine.ContextMenuManager.activeTarget,
                        activeContextMenu = StoryLine.ContextMenuManager.activeContextMenu;
                    if (activeContextMenu) {
                        if (StoryLine.HelperFunctions.endsWith(src, 'actionIcon[kletsen].png')) {
                            if (activeTarget.hasClass('event')) {
                                StoryLine.ScenarioManager.setScenarioEvent(StoryLine.ScenarioManager.activeScenario, "talk");
                            }
                            hide = true;
                            activeTarget.attr('src', src);
                        } else if (StoryLine.HelperFunctions.endsWith(src, 'actionIcon[handen].png')) {
                            if (activeTarget.hasClass('event')) {
                                StoryLine.ScenarioManager.setScenarioEvent(StoryLine.ScenarioManager.activeScenario, "hold-hands");
                            }
                            hide = true;
                            activeTarget.attr('src', src);
                        } else if ($(this).hasClass('edit')) {
                            if (activeTarget.hasClass('commentWrapper')) {
                                StoryLine.CommentManager.editComment(activeTarget, function () {console.log('finish first');}, function (apply) {
                                    if (!apply) {
                                        StoryLine.ContextMenuManager.hideContextMenu(menu);
                                    }
                                });
                            }
                        } else if ($(this).hasClass('delete')){
                            if(activeTarget.hasClass('commentWrapper')){
                                $('.active-comment').remove();
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