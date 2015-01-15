var StoryLine = StoryLine || {};

StoryLine.ContextMenuManager = function () {
    this.templateContextMenu = null;
    this.activeContextMenu = null;
    this.activeTarget = null;
};

StoryLine.ContextMenuManager.prototype = {
    create: function () {
        $('.contextMenu:not(.template)').each(function (index, element) {
            StoryLine.ContextMenuManager.initContextMenu($(this));
        });

        $('.scenario-list').scroll(function () {
            StoryLine.ContextMenuManager.getPositions();
        });

        $(window).resize(function () {
            StoryLine.ContextMenuManager.getPositions();
        });
    },
    cloneContextMenuTemplate: function () {
        var contextMenu = $('<div class="contextMenu dark">'),
            template = this.templateContextMenu.clone(true, true),
            elements = template.contents();
        elements.appendTo(contextMenu);
        contextMenu.hide();
        return contextMenu;
    },
    initContextMenu: function (scenarioWrapper, menuTarget) {
        StoryLine.ContextMenuManager.getPositions();

        // Get the contextMenu for this scenarioWrapper
        var myIndex = scenarioWrapper.index();
        if (myIndex > 0) { myIndex /= 2; }
        var contextMenu = $('.contextMenu').eq(myIndex);

        // TODO: Set the buttons here (menuTarget for which target was clicked at; string event/emotion/etc.)

        return contextMenu;

        /*

        // Child specific behaviour
        scenarioWrapper.children('.event').click(function () {

            StoryLine.ContextMenuManager.getPositions();

            var myIndex = $(this).index();
            if (myIndex > 0) { myIndex /= 2; }
            $('body, .scenario-list').toggleClass('fix');
            var contextMenu = $('.contextMenu').eq(myIndex);


            //$(this).toggleClass('active');

            contextMenu.addClass('active');
            contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
            $(this).toggleClass('active');//.children('.scenario')
        });

        scenarioWrapper.click(function () {
            StoryLine.ContextMenuManager.getPositions();
            // Differentiate behaviour and content.
            var sM = StoryLine.ScenarioManager;
            if (sM.isScenarioSelected($(this))) {

            }

            var myIndex = $(this).index();
            if (myIndex > 0) { myIndex /= 2; }
            $('body, .scenario-list').toggleClass('fix');
            var contextMenu = $('.contextMenu').eq(myIndex);
            contextMenu.addClass('active');
            contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
            $(this).toggleClass('active');//.children('.scenario')



            if ($(this).hasClass('show')) {
                if ($(this).hasClass('talk')) {
                    $(this).animate({'background-color': '#f9c82e'}, 500);
                } else if ($(this).hasClass('hold-hands')) {
                    $(this).animate({'background-color': '#c1392b'}, 500);
                } else if ($(this).hasClass('cuddle')) {
                    $(this).animate({'background-color': '#5d2e4e'}, 500);
                } else if ($(this).hasClass('kiss')) {
                    $(this).animate({'background-color': '#999999'}, 500);
                }
            } else {
                $(this).animate({'background-color': '#cccccc'}, 500);
            }
        });

        contextMenu.children('.contextIcon').on("click", function () {
            var myIndex = $(this).parent().index();
            myIndex -= 1;
            if (myIndex > 0) { myIndex /= 2; }
            $('.event').eq(myIndex).attr('src', $(this).attr('src'));
        });

        this.getPositions();
        */
    },
    isContextMenuDisplayed: function (contextMenu) {
        if (!contextMenu) {
            console.warn("contextMenu does not exist.");
            return false;
        }
        return contextMenu.css('display') !== "none";
    },
    hideContextMenu: function (contextMenu, callback) {
        if (!contextMenu) {
            return;
        }
        if (!this.isContextMenuDisplayed(contextMenu)) {
            if (contextMenu === this.activeContextMenu) {
                this.activeContextMenu = null;
                this.activeTarget = null;
            }
            return;
        }
        contextMenu.removeClass('active');
        console.log(contextMenu.css('width'));
        contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
        if (contextMenu === this.activeContextMenu) {
            this.activeContextMenu = null;
            this.activeTarget = null;
            console.log('closed');
        }
        //$(this).toggleClass('active');//.children('.scenario')
    },
    showContextMenu: function (contextMenu, menuTarget) {
        if (!contextMenu) {
            return;
        }
        if (this.isContextMenuDisplayed(contextMenu)) {
            if (this.activeContextMenu === null || this.activeContextMenu !== contextMenu) {
                this.activeContextMenu = contextMenu;
                this.activeTarget = menuTarget;
            }
            return;
        }
        contextMenu.addClass('active');
        contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
        this.activeContextMenu = contextMenu;
        this.activeTarget = menuTarget;
    },
    openContextMenu: function (scenarioWrapper, menuTarget) {
        var contextMenu = this.initContextMenu(scenarioWrapper, menuTarget);
        this.showContextMenu(contextMenu, menuTarget);
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