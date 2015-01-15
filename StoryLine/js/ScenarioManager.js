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
            StoryLine.ContextMenuManager.templateContextMenu = $('.contextMenu.template');
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
        
        $('.scenarioWrapper:not(.template)').each(function (index, element) {
            StoryLine.ScenarioManager.initScenario($(this));
        });
    },
    initScenario: function (scenarioWrapper) {
        // Child specific behaviour
        scenarioWrapper.children('.event').click(function () {
            var scenario = $(this).parent();
            if (StoryLine.ScenarioManager.isScenarioSelected(scenario)) {
                StoryLine.ContextMenuManager.initContextMenu(scenario, 'event');
            }

            var myIndex = $(this).index();
            if (myIndex > 0) { myIndex /= 2; }
            $('body, .scenario-list').toggleClass('fix');
            var contextMenu = $('.contextMenu').eq(myIndex);


            //$(this).toggleClass('active');

            contextMenu.addClass('active');
            contextMenu.animate({width: 'toggle'}, {duration: 350, queue: false});
            $(this).toggleClass('active');//.children('.scenario')
        });
    },
    
    
    loadTemplateScenario: function (callback) {
        var scenarioList = $('.scenario-list'),
            scenarioHandler = "../templates/scenario.html .scenarioWrapper.template,.contextMenu.template";

        scenarioList.load(scenarioHandler, function (scResponse, scStatus, scXhr) {
            if (scStatus === "error") {
                console.log("Loading template failed.");
                callback(false);
            } else {
                // vervangen door één klikbare sectie (namelijk de scenariowrapper)


                // If I make this .click it will only be executed on the template scenario
                $(".scenarioWrapper.template").on("click", function () {
                    // Restrict clicking (like with comments):
                    // Block if editing scenario's
                    var scInstance = StoryLine.ScenarioManager.cloneScenarioTemplate(),
                        cmInstance = StoryLine.ContextMenuManager.cloneContextMenuTemplate(),
                        list = $('.scenario-list'),
                        tmp = $('.scenarioWrapper.template'),
                        commentList;
                    scInstance.insertBefore(tmp);
                    cmInstance.insertAfter(scInstance);
                    commentList = $(scInstance).children('.scenario').children('.comment-list-wrapper').children('.comment-list');
                    
                    StoryLine.ContextMenuManager.initContextMenu($(cmInstance));
                    StoryLine.CommentManager.initCommentList(commentList);
                    StoryLine.ScenarioManager.initScenario($(this));
                    StoryLine.ScenarioManager.showScenario($(scInstance));
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
    cloneScenarioTemplate: function () {
        // Create a new div scenarioWrapper
        var scenarioWrapper = $('<li class="scenarioWrapper light medium-border">'),
            template = this.templateScenario.clone(true, true),
            elements = template.contents();
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
            if (events[i] === event) {
                scenarioWrapper.addClass(event);
            } else {
                scenarioWrapper.removeClass(event);
            }
        }
    },
    
    isScenarioSelected: function (scenarioWrapper) {
        return scenarioWrapper.hasClass('active');
    },
    selectScenario: function (scenarioWrapper) {
        // change color (class)
        // enable sorting comments
        if (this.activeScenario) {
            this.activeScenario.removeClass('active');
        }
        scenarioWrapper.addClass('active');
        this.activeScenario = scenarioWrapper;

        /*
        var oldWrapper,
            oldCommentList,
            commentList = scenarioWrapper.children('.comment-list');
        if (scenarioWrapper.hasClass('active-scenario')) {
            // TODO: Comment it out cause this also triggers when clicking
            // on comments
            scenarioWrapper.removeClass('active-scenario');
            this.activeScenario = null;
        } else {
            oldWrapper = $('.active-scenario');
            if (oldWrapper) {
                oldCommentList = oldWrapper.children('.comment-list');
                oldCommentList.removeClass('sortable');
                oldWrapper.toggleClass('active-scenario');
            }

            scenarioWrapper.toggleClass('active-scenario');
            commentList.addClass('sortable');
            this.activeScenario = scenarioWrapper;
        }
        */
    },
    unselectScenario: function (scenarioWrapper) {
        // change color (class)
        // disable sorting comments
        scenarioWrapper.removeClass('active');
        if (this.activeScenario) {
            this.activeScenario = null;
        }
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
    }
};