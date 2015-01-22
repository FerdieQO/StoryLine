var StoryLine = StoryLine || {};

StoryLine.Main = function () {
    this.scrolling = true;
    StoryLine.HelperFunctions = new StoryLine.HelperFunctions();
    StoryLine.DatabaseManager = new StoryLine.DatabaseManager();
    StoryLine.ScenarioManager = new StoryLine.ScenarioManager();
    StoryLine.CommentManager = new StoryLine.CommentManager();
    StoryLine.ContextMenuManager = new StoryLine.ContextMenuManager();
};

StoryLine.Main.prototype = {
    create: function () {
        StoryLine.HelperFunctions.create();
        StoryLine.DatabaseManager.create();
        StoryLine.ScenarioManager.create(function () {
            StoryLine.CommentManager.create();
            StoryLine.ContextMenuManager.create();
        });
    },
    lockScrollviewToScenario: function (scenarioWrapper) {
        this.scrollToItem(scenarioWrapper, function () {
            StoryLine.Main.scrolling = false;
            $('body, .scenario-list').addClass('fix');
        });
    },
    scrollToItem: function (scenarioWrapper, callback) {
        // http://api.jquery.com/scrollLeft/
        if (scenarioWrapper) {
            var index = scenarioWrapper.index(),
                width = scenarioWrapper.width();
            index /= 2;
            console.log(index + " * " + width);

            // Check if the element is within viewport
            if (!this.isInScrollView(scenarioWrapper)) {
                // align to center:

                // center - (width + contextMenu.width)
                var contextMenu = StoryLine.ContextMenuManager.getContextMenu(scenarioWrapper);
                var w = contextMenu.width();

                scenarioWrapper.parent('.scenario-list').animate({scrollLeft: index * width}, 200, callback);

                //scenarioWrapper.parent('.scenario-list').scrollLeft(index * width);
            } else {
                callback();
            }
        } else {
            console.warn("Undefined: scenarioWrapper");
        }
    },
    isInScrollView: function (scenarioWrapper) {
        // http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
        var viewLeft = $(scenarioWrapper).parent('.scenario-list').scrollLeft();
        var viewRight = $(scenarioWrapper).parent('.scenario-list').width();

        var elementLeft = $(scenarioWrapper).offset().left;
        var elementRight = elementLeft + $(scenarioWrapper).width();

        return ((elementRight <= viewRight) && (elementLeft >= viewLeft));
    },

    unlockScrolling: function () {
        this.scrolling = true;
        $('body, .scenario-list').removeClass('fix');
    }
};

StoryLine.Main = new StoryLine.Main();
$(document).ready(StoryLine.Main.create);