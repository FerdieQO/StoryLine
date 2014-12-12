var StoryLine = StoryLine || {};

StoryLine.ScenarioManager = function () {
    var templateScenario = null,
        activeScenario = null,
        timeoutId = 0,
        create = function () {},
        selectScenario = function () {};
};
StoryLine.ScenarioManager.prototype = {
    create: function () {
        // Set templateScenario
        $('.scenario-list').load("../templates/scenario.html .scenarioWrapper.template");
        var comments = $('.scenarioWrapper.template .comment-list');

        //console.log($('.scenario'));
        //console.log(comments);
        comments.load("../templates/comment.html .commentWrapper.template", function () {
            console.log("Lol");
        });
        this.templateScenario = $('.scenarioWrapper.template');
        //console.log(comments);
        //comments;

        // initialize each scenario
        // will eventually be replaced when implementing loading since the scenario's must then be created while loading.
        $('.scenarioWrapper:not(.template)').each(function (index, scenario) {
            // Clone scenarioWrapper.template
            var template = StoryLine.ScenarioManager.templateScenario.clone(true);

            var elements = template.contents();
            //console.log(elements);
            elements.appendTo(scenario);
        });

        // On mousedown on the scenario
        $('.scenarioWrapper').mousedown(function () {
            var scenarioWrapper = $(this);
            StoryLine.ScenarioManager.timeoutId = setTimeout(function () {
                StoryLine.ScenarioManager.selectScenario(scenarioWrapper);
            }, 1000);
        }).bind('mouseup mouseleave', function () {
            clearTimeout(StoryLine.ScenarioManager.timeoutId);
        });
    },
    initializeScenario: function (scenarioWrapper) {
        // Add all content here
        // Event
        // 
    },
    cloneScenarioTemplate: function () {
        // Create a new div scenarioWrapper
        var scenarioWrapper = $('<div>').addClass('scenarioWrapper');
        // Clone scenarioWrapper.template
        var template = StoryLine.ScenarioManager.templateScenario.clone(true);

        var elements = template.contents();
        elements.appendTo(scenarioWrapper);
        // Return the div, you'll need to hook it into the correct place.
        return scenarioWrapper;
    },
    setScenarioEvent: function (scenarioWrapper, event) {
        if (scenarioWrapper.hasClass('template')) {
            return;
        }
        // how to remove class where you don't know which one it is?
        // Current method is ugly as ****.
        var events = ["talk", "kiss", "cuddle", "hold-hands"];
        for (var i = 0; i < events.length; i++){
            if (events[i] == event) {
                scenarioWrapper.addClass(event);
            } else {
                scenarioWrapper.removeClass(event);
            }
        }
    },
    selectScenario: function (scenarioWrapper) {
        // change color (class)
        // enable sorting comments

        var oldWrapper;
        var commentList = scenarioWrapper.children('.comment-list');
        if (scenarioWrapper.hasClass('active-scenario')) {
            // TODO: Comment it out cause this also triggers when clicking
            // on comments
            scenarioWrapper.removeClass('active-scenario');
            activeScenario = null;
        } else {
            oldWrapper = $('.active-scenario');
            if (oldWrapper) {
                var oldCommentList = oldWrapper.children('.comment-list');
                oldCommentList.removeClass('sortable');
                oldWrapper.toggleClass('active-scenario');
            }

            scenarioWrapper.toggleClass('active-scenario');
            commentList.addClass('sortable');
            this.activeScenario = scenarioWrapper;
        }
    },
    unselectScenario: function (scenarioWrapper) {
        // change color (class)
        // disable sorting comments
    }
};