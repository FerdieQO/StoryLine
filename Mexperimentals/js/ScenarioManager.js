var StoryLine = StoryLine || {};

StoryLine.ScenarioManager = function () {
    var activeScenario = null,
        timeoutId = 0,
        create = function () {},
        selectScenario = function () {};
};
StoryLine.ScenarioManager.prototype = {
    create: function () {
        var scenarioManager = StoryLine.ScenarioManager;
        $('.scenarioWrapper').mousedown(function () {
            var scenarioWrapper = $(this);
            scenarioManager.timeoutId = setTimeout(function () {
                scenarioManager.selectScenario(scenarioWrapper);
            }, 1000);
        }).bind('mouseup mouseleave', function () {
            clearTimeout(scenarioManager.timeoutId);
        });
    },
    selectScenario: function (scenarioWrapper) {
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
    }
};