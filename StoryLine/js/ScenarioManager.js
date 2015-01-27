var StoryLine = StoryLine || {};

StoryLine.ScenarioManager = function () {
    this.templateScenario = null;
    // Current active scenario: if the scenario is selected or the context-menu is open on this scenario
    this.activeScenario = null;
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

            if (StoryLine.ContextMenuManager.toggling) {
                return;
            }

            // The clicked target
            var cM = StoryLine.CommentManager, cMM = StoryLine.ContextMenuManager, sM = StoryLine.ScenarioManager;
            var target = $(event.target);
            // Variables around the clicked element.
            var targetElement = sM.extractElementFromTarget(target);
            var targetScenario = sM.getParent(target, 'scenarioWrapper', 7);
            var targetContextMenu = targetScenario ? cMM.getContextMenu(targetScenario) : false;

            // Variables around the active element (that opened the contextMenu).
            var activeElement = cMM.activeTarget;
            var activeScenario = sM.activeScenario;
            var activeContextMenu = cMM.activeContextMenu;

            if (!targetElement || !targetScenario || !targetContextMenu) {
                console.warn("One of these is undefined: targetElement " + targetElement + ", targetScenario " + targetScenario + " or targetContextMenu " + targetContextMenu);
            }
            if (!activeElement || !activeScenario || !activeContextMenu) {
                console.log("Not critical:\n One of these is undefined: activeElement " + activeElement + ", activeScenario " + activeScenario + " or activeContextMenu " + activeContextMenu);
            }

            // bools
            var onActiveScenario = sM.isScenarioSelected(targetScenario);
            var onActiveTarget = targetElement.is(activeElement);
            // If editing a (new) comment, no focus-change is allowed until the change is completed.

            // Special cases for comments, if editing a comment, do nothing since the buttons themself handle the edit
            if (activeElement && activeElement.hasClass('commentWrapper')) {
                // The contextMenu is open for a element and the contextMenu is open for a comment
                if (cM.editing) {
                    // We are editing that comment aswell
                    // console.log('Nope.avi: editing.');
                    return; // Block the rest, no change is allowed until the edit is finished
                } else {
                    // We are not editing that comment or any other
                    if (onActiveTarget) {
                        // We clicked the comment that is active

                        // Close that comment and the contextMenu
                        cMM.closeContextMenu(activeScenario, function () {
                            //cM.experimentalToggle(activeElement);
                            cM.closeComment(activeElement, false);
                            //cM.closeComment(activeElement);
                        });
                        return;
                    } else if (targetElement.hasClass('commentWrapper')) {
                        // We clicked a different comment
                        cMM.closeContextMenu(activeScenario, function () {
                            cM.closeComment(activeElement, false);
                            if (targetElement.hasClass('template')) {
                                var newComment = cM.addComment(targetElement);

                                cM.editComment(newComment, function () {
                                    cMM.openContextMenu(targetScenario, newComment);
                                }, function (apply) {
                                    if (!apply) {
                                        StoryLine.ContextMenuManager.closeContextMenu(targetScenario);
                                    }
                                });
                                cM.currTemplate.hide();
                            } else {
                                console.log('open comment');
                                //cM.experimentalToggle(activeElement);
                                cM.openComment(targetElement, false);
                                //cM.openComment(targetElement);
                                cMM.openContextMenu(targetScenario, targetElement);
                            }
                        });
                        return;
                    }
                }
            } else {
                // The contextMenu is closed or open for other elements
                if (targetElement.hasClass('commentWrapper')) {
                    if (onActiveScenario) {
                        // A scenario is active
                        if (targetElement.hasClass('template')) {
                            var addComment = function () {
                                var newComment = cM.addComment(targetElement);

                                cM.editComment(newComment, function () {
                                    cMM.openContextMenu(targetScenario, newComment);
                                }, function (apply) {
                                    if (!apply) {
                                        StoryLine.ContextMenuManager.closeContextMenu(targetScenario);
                                    } else {
                                        StoryLine.ContextMenuManager.updateContextMenu(targetScenario);
                                    }
                                });
                                cM.currTemplate.hide();
                            };
                            if (activeElement) {
                                cMM.closeContextMenu(activeScenario, addComment);
                            } else {
                                addComment();
                            }
                            return;
                        } else {
                            if (activeElement) {
                                cMM.closeContextMenu(activeScenario, function () {
                                    cMM.openContextMenu(targetScenario, targetElement);
                                });
                            } else {
                                cMM.openContextMenu(targetScenario, targetElement);
                                cM.openComment(targetElement, false);
                            }
                            return;
                        }
                    }
                }
            }
            if (onActiveScenario && onActiveTarget) { // If this is the active scenario and we clicked the active element.
                if (!targetElement.hasClass('commentWrapper')) {
                    // Close the contextmenu
                    cMM.hideContextMenu(targetContextMenu);
                }
            } else if (onActiveScenario) { // If this is the active scenario.
                // Behaviour per target
                if (targetElement.hasClass('scenarioWrapper')) {
                    if (activeContextMenu) { // If there is a contextMenu open, close it first
                        cMM.hideContextMenu(activeContextMenu);
                    } else {
                        cMM.openContextMenu(targetScenario, targetElement);
                        //sM.unselectScenario(activeScenario);
                    }
                } else if (targetElement.hasClass('event') || targetElement.hasClass('emotion')) {
                    if (activeContextMenu) {
                        cMM.closeContextMenu(activeScenario, function () {
                            cMM.openContextMenu(targetScenario, targetElement); 
                        });
                    } else {
                        cMM.openContextMenu(targetScenario, targetElement);
                    }
                }
            } else {
                // Close context menu of active or select scenario if none is active
                if (sM.activeScenario) {
                    if (activeContextMenu) {
                        cMM.hideContextMenu(activeContextMenu);
                    } else {
                        sM.unselectScenario(activeScenario);
                    }
                } else {
                    sM.selectScenario(targetScenario);
                }
            }
        });
    },
    extractElementFromTarget: function (target) {
        if (target.hasClass('event')) { // event
            // console.log('Event');
            return target;
        } else if (target.hasClass('emotion')) { // emotion
            // console.log('Emotion');
            return target;
        } else if (StoryLine.ScenarioManager.hasParent(target, 'commentWrapper', 3)) { // commentWrapper
            // console.log('Comment');
            return StoryLine.ScenarioManager.getParent(target, 'commentWrapper', 3);
        } else { // scenarioWrapper
            // console.log('Scenario');
            return StoryLine.ScenarioManager.getParent(target, 'scenarioWrapper', 7);
        }
    },

    loadTemplateScenario: function (callback) {
        var scenarioList = $('.scenario-list'),
            scenarioHandler = "templates/scenario.html .scenarioWrapper.template,.contextMenu.template";

        scenarioList.load(scenarioHandler, function (scResponse, scStatus, scXhr) {
            if (scStatus === "error") {
                console.log("Loading scenario-template failed.");
                callback(false);
            } else {
                // vervangen door één klikbare sectie (namelijk de scenariowrapper)


                // If I make this .click it will only be executed on the template scenario
                $(".scenarioWrapper.template").on("click", function () {
                    if (StoryLine.ContextMenuManager.activeTarget) {
                        return;
                    }

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
                        console.log("Loading comment-template failed.");
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
        scenarioWrapper.children('.scenario').children('p').text("Geen gebeurtenis");
        // Return the div, you'll need to hook it into the correct place.
        return scenarioWrapper;
    },
    setScenarioEvent: function (event, button) {
        if (!event) {
            return;
        }
        // how to remove class where you don't know which one it is?
        // Current method is ugly as ****.
        var title, src;
        if (button) {
            title = button.attr('title');
            src = button.attr('src');
        }

        var p = event.parent().children('p');

        // http://stackoverflow.com/questions/1227286/get-class-list-for-element-with-jquery
        var i, titles = ["Aanraken", "Handen vasthouden", "Kletsen", "Knuffelen", "Kussen", "Seks", "Winkelen", "Spelen", "Trainen", "Vriendschap sluiten"],
            oldEvent;

        for (i = 0; i < titles.length; i++) {
            if (event.attr('title') === titles[i]) {
                oldEvent = titles[i];
            }
        }

        if (title) {
            p.text(title);
            event.attr('src', src);
            event.attr('title', title);
        } else {
            p.text('Geen gebeurtenis');
            event.attr('src', this.templateScenario.contents().find('.event').attr('src'));
            event.attr('title', 'Selecteer een actie');
        }
    },
    setScenarioEmotion: function (scenarioWrapper, emotion, button) {
        if (scenarioWrapper.hasClass('template')) {
            return;
        }
        if (!emotion) {
            return;
        }

        var title, titleClass, src;
        if (button) {
            title = button.attr('title');
            titleClass = title.toLowerCase();
            src = button.attr('src');
        }
        var changeColor = !emotion.hasClass('pull-right');

        var emotions = ["Bang", "Bedroefd", "Blij", "Boos"],
            i, oldEmotion, oldTitle;

        for (i = 0; i < emotions.length; i++) {
            if (emotion.attr('title') === emotions[i]) {
                // console.log('Setting oldEvent: ' + events[i]);
                oldTitle = emotions[i];
            }

            if (scenarioWrapper.hasClass(emotions[i].toLowerCase())) {
                oldEmotion = emotions[i].toLowerCase();
            }
        }

        var contextMenu = StoryLine.ContextMenuManager.getContextMenu(scenarioWrapper);

        if (changeColor) {
            if (oldEmotion && title) {
                $(scenarioWrapper).switchClass(oldEmotion, titleClass, { duration: 200, children: true });
                $(contextMenu).switchClass(oldEmotion, titleClass, { duration: 200, children: true });
            } else if (title) {
                $(scenarioWrapper).addClass(titleClass, { duration: 200, children: true });
                $(contextMenu).addClass(titleClass, { duration: 200, children: true });
            } else if (oldEmotion) {
                $(scenarioWrapper).removeClass(oldEmotion, { duration: 200, children: true });
                $(contextMenu).removeClass(oldEmotion, { duration: 200, children: true });
            }
        }
        
        if (title) {
            emotion.attr('src', src);
            emotion.attr('title', title);
        } else {
            // template:
            emotion.attr('src', this.templateScenario.contents().find('.emotion').attr('src'));
            if (emotion.hasClass('pull-right')) {
                title = 'Voeg de emotie van de ander toe';
            } else {
                title = 'Voeg jouw emotie toe';
            }
            emotion.attr('title', title);
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
        StoryLine.Main.scrollToScenario(scenarioWrapper, function () {
            $(scenarioWrapper).addClass('active', { duration: 200, children: true });
            //scenarioWrapper.addClass('active');
            StoryLine.ScenarioManager.activeScenario = scenarioWrapper;
        });

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
            $(scenarioWrapper).removeClass('active', { duration: 200, children: true });
            this.activeScenario = null;
        } else {
            scenarioWrapper.removeClass('active', { duration: 200, children: true });
            StoryLine.ContextMenuManager.closeContextMenu(scenarioWrapper);
            if (this.activeScenario) {
                this.activeScenario.removeClass('active', { duration: 200, children: true });
                this.activeScenario = null;
            }
        }
    },
    
    getAbsoluteCenterY: function (scenarioWrapper, element) {
        // http://stackoverflow.com/questions/3714628/jquery-get-the-location-of-an-element-relative-to-window
        var elementTop = element.offset().top;
        var scrollViewTop = scenarioWrapper.scrollTop();
        console.log(elementTop - scrollViewTop);
        
        return (elementTop - scrollViewTop) + (element.height() / 2);
    },
    alignButtonsToElement: function (scenarioWrapper, element, buttons) {
        var height = $(window).height();
        console.log(height);
        var targetY = this.getAbsoluteCenterY(scenarioWrapper, element);
        
        var bottom = targetY + (buttons.height() / 2);
        if (bottom > height) {
            console.log('offscreen');
            var offset = bottom - height;
            targetY -= offset;
        }
        buttons.offset({ top: targetY - (buttons.height() / 2) });
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