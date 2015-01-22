var StoryLine = StoryLine || {};

StoryLine.ScenarioManager = function () {
    this.templateScenario = null;
    // Current active scenario: if the scenario is selected or the context-menu is open on this scenario
    this.activeScenario = null;
    this.timeoutId = 0;
};
StoryLine.ScenarioManager.prototype = {
    create: function (callback) {
        var onLoadComplete = function () {
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

                StoryLine.ScenarioManager.initScenario(scenario);
            });
            callback();
        };

        this.loadTemplateScenario(onLoadComplete);
    },
    hasParent: function (element, type, depth) {
        if (depth === 0) {
            return false;
        }
        if (element.hasClass(type)) {
            return true;
        }
        depth -= 1;
        if (depth === 0) {
            return false;
        } else {
            return this.hasParent(element.parent(), type, depth);
        }
    },
    getParent: function (element, type, depth) {
        if (depth === 0) {
            return false;
        }
        if (element.hasClass(type)) {
            return element;
        }
        depth -= 1;
        if (depth === 0) {
            return false;
        } else {
            return this.getParent(element.parent(), type, depth);
        }
    },
    initScenario: function (scenarioWrapper) {
        // On click of the scenario
        scenarioWrapper.on('click', function (event) {
            // The clicked target
            var sM = StoryLine.ScenarioManager, cMM = StoryLine.ContextMenuManager;
            var target = $(event.target);

            var targetElement = StoryLine.ScenarioManager.extractElementFromTarget(target);

            var scenario = sM.getParent(target, 'scenarioWrapper', 7);
            var contextMenu;

            var initLog = '';
            if (scenario === false) {
                initLog += 'No scenarioWrapper found.';
            } else {
                contextMenu = cMM.getContextMenu(scenario);
                if (contextMenu === false) {
                    initLog += 'No contextMenu found.';
                }
            }
            if (initLog.length > 0) {
                console.log(initLog);
            }

            // bools
            var onActiveScenario = sM.isScenarioSelected(scenario);
            var onActiveTarget = targetElement.is(cMM.activeTarget);
            // If editing a (new) comment, no focus-change is allowed until the change is completed.

            if (StoryLine.CommentManager.editing) {
                console.log('Nope.avi: editing.');
                return;
            }

            if (onActiveScenario && onActiveTarget) { // If this is the active scenario and we clicked the active element.
                if (!targetElement.hasClass('commentWrapper')) {
                    // Close the contextmenu
                    cMM.hideContextMenu(contextMenu);
                }
            } else if (onActiveScenario) { // If this is the active scenario.
                // Behaviour per target
                if (targetElement.hasClass('scenarioWrapper')) {
                    if (cMM.activeContextMenu) { // If there is a contextMenu open, close it first
                        cMM.hideContextMenu(contextMenu);
                    } else {
                        sM.unselectScenario(scenario);
                    }
                } else if (targetElement.hasClass('event')) {
                    if (cMM.activeContextMenu) {

                    } else {
                        cMM.openContextMenu(scenario, targetElement);
                    }
                } else if (targetElement.hasClass('emotion')) {
                    if (cMM.activeContextMenu) {
                        cMM.closeContextMenu(scenario, function () {
                            cMM.openContextMenu(scenario, targetElement); 
                        });
                    } else {
                        cMM.openContextMenu(scenario, targetElement);
                    }
                } else if (targetElement.hasClass('commentWrapper')) {
                    //cMM.openContextMenu(scenario, targetElement);
                }
            } else { // If editing anything else.
                // Close context menu of active or select scenario if none is active
                if (sM.activeScenario) {
                    if (cMM.activeContextMenu) {
                        cMM.hideContextMenu(cMM.activeContextMenu);
                    } else {
                        sM.unselectScenario(sM.activeScenario);
                    }
                } else {
                    sM.selectScenario(scenario);
                }
            }
        });
    },
    extractElementFromTarget: function (target) {
        if (target.hasClass('event')) { // event
            console.log('Event');
            return target;
        } else if (target.hasClass('emotion')) { // emotion
            console.log('Emotion');
            return target;
        } else if (StoryLine.ScenarioManager.hasParent(target, 'commentWrapper', 3)) { // commentWrapper
            console.log('Comment');
            return StoryLine.ScenarioManager.getParent(target, 'commentWrapper', 3);
        } else { // scenarioWrapper
            console.log('Scenario');
            return StoryLine.ScenarioManager.getParent(target, 'scenarioWrapper', 7);
        }
    },

    loadTemplateScenario: function (callback) {
        var scenarioList = $('.scenario-list'),
            scenarioHandler = "templates/scenario.html .scenarioWrapper.template,.contextMenu.template";

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

                    StoryLine.ContextMenuManager.initContextMenu($(scInstance));
                    StoryLine.CommentManager.initCommentList(commentList);
                    StoryLine.ScenarioManager.showScenario($(scInstance));
                    StoryLine.ScenarioManager.initScenario($(scInstance));
                    StoryLine.ScenarioManager.selectScenario($(scInstance));
                });

                var commentList = $('.comment-list'),
                    commentHandler = "templates/comment.html .commentWrapper.template";
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

        // http://stackoverflow.com/questions/1227286/get-class-list-for-element-with-jquery
        var events = ["talk", "kiss", "cuddle", "hold-hands"], i,
            titles = ["Kletsen", "Zoenen", "Knuffelen", "Handen vasthouden"];
        for (i = 0; i < events.length; i++) {
            if (events[i] == event) {
                scenarioWrapper.addClass(event);
                StoryLine.ContextMenuManager.getContextMenu(scenarioWrapper).addClass(event);
                scenarioWrapper.children('.scenario').children('p').text(titles[i]);
            } else {
                scenarioWrapper.removeClass(events[i]);
                StoryLine.ContextMenuManager.getContextMenu(scenarioWrapper).removeClass(events[i]);
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
            this.unselectScenario(this.activeScenario);
            //this.activeScenario.removeClass('active');
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
        if (!scenarioWrapper && !this.activeScenario) {
            return;
        }
        // change color (class)
        // disable sorting comments
        if (scenarioWrapper.is(this.activeScenario)) {
            StoryLine.ContextMenuManager.closeContextMenu(scenarioWrapper);
            scenarioWrapper.removeClass('active');
            this.activeScenario = null;
        } else {
            scenarioWrapper.removeClass('active');
            StoryLine.ContextMenuManager.closeContextMenu(scenarioWrapper);
            if (this.activeScenario) {
                this.activeScenario.removeClass('active');
                this.activeScenario = null;
            }
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