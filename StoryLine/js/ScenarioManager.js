var StoryLine = StoryLine || {};

StoryLine.ScenarioManager = function () {
    this.templateScenario = null;
    this.activeScenario = null;
    this.timeoutId = 0;
};
StoryLine.ScenarioManager.prototype = {
    create: function (callback) {
        this.loadTemplateScenario(function () {
            StoryLine.ScenarioManager.templateScenario = $('.scenarioWrapper.template');
            //StoryLine.CommentManager.templateComment = $('.scenarioWrapper.template .commentWrapper.template');

            // initialize each scenario
            // will eventually be replaced when implementing loading since the scenario's must then be created while loading.
            $('.scenarioWrapper:not(.template)').each(function (index, scenario) {
                // Clone scenarioWrapper.template
                var template = StoryLine.ScenarioManager.templateScenario.clone(true),
                    elements = template.contents();
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
            callback();
        });
    },
    loadTemplateScenario: function (callback) {
        var scenarioList = $('.scenario-list'),
            scenarioHandler = "../templates/scenario.html .scenarioWrapper.template";

        scenarioList.load(scenarioHandler, function (scResponse, scStatus, scXhr) {
            if (scStatus === "error") {
                console.log("Loading template failed.");
                callback(false);
            } else {
                // vervangen door één klikbare sectie (namelijk de scenariowrapper)



                $(".scenarioWrapper").on("click", function () {
                    // Restrict clicking (like with comments):
                    // Block if editing scenario's
                    // 
                    var sct = StoryLine.ScenarioManager.cloneScenarioTemplate();
                    var list = $('.scenario-list');
                    var tmp = $('.scenarioWrapper.template');
                    //sct.appendTo(list);

                    sct.insertBefore($(tmp));
                    console.log(sct);
                    StoryLine.ScenarioManager.showScenario($(sct));
                });


                var commentList = $('.comment-list'),
                    commentHandler = "../templates/comment.html .commentWrapper.template";
                commentList.load(commentHandler, function (cResponse, cStatus, cXhr) {
                    if (cStatus === "error") {
                        console.log("Loading template failed.");
                        callback(false);
                    } else {
                        callback(true);
                    }
                });


            }
        });


    },
    initializeScenario: function (scenarioWrapper) {
        // Add all content here
        // Event
        // 
    },
    cloneScenarioTemplate: function () {
        // Create a new div scenarioWrapper
        var scenarioWrapper = $('<li>').addClass('scenarioWrapper').addClass('light');
        // Clone scenarioWrapper.template
        var template = StoryLine.ScenarioManager.templateScenario.clone(true);

        var elements = template.contents();
        elements.appendTo(scenarioWrapper);
        scenarioWrapper.children('.scenario').children('p').text("New");
        // Return the div, you'll need to hook it into the correct place.
        return scenarioWrapper;
    },
    setScenarioEvent: function (scenarioWrapper, event) {
        if (scenarioWrapper.hasClass('template')) {
            return;
        }
        // how to remove class where you don't know which one it is?
        // Current method is ugly as ****.
        var events = ["talk", "kiss", "cuddle", "hold-hands"], i;
        for (i = 0; i < events.length; i++) {
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
            this.activeScenario = null;
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
    },
    // Switch from the scenario to the placeholder
    showPlaceholder: function (scenarioWrapper) {
        var placeholder = scenarioWrapper.children('.placeholder-wrapper'),
            scenario = scenarioWrapper.children('.scenario');
        scenario.hide();
        placeholder.show();
    },
    // Switch from the placeholder to the scenario
    showScenario: function (scenarioWrapper) {
        var placeholder = scenarioWrapper.children('.placeholder-wrapper'),
            scenario = scenarioWrapper.children('.scenario');
        placeholder.hide();
        scenario.show();
        console.log("Show");
    }
};