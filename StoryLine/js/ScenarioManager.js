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
        this.templateScenario = $('.scenarioWrapper.template');
        
        // initialize each scenario
        // will eventually be replaced when implementing loading since the scenario's must then be created while loading.
        $('.scenarioWrapper:not(.template)').each(function (index, scenario) {
            // Clone scenarioWrapper.template
            var template = StoryLine.ScenarioManager.templateScenario.clone(true);
            var elements = template.contents();
            console.log(elements);
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
    createScenarioTemplate: function () {
        // This is the template, the template can be cloned
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