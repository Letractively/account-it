﻿/* dependencies */

//  jQuery 1.6+

(function () {
    var ui = {};
    this.ui = ui;

    $(document).ready(function () {
        stickActionsMenu();
        hideSelfLinks();
        //activateTableSorter();
    });

    ui.handleError = function (err) {
        switch (err) {
            case 'NotAuthorizedOrSessionExpired':
                ui.showError('Session expired<form action="../authorize"><button>log in</button></form>', { autoHide: false })
                break;
            case 'CannotDeletePersonThatHasOperations':
                ui.showError('Person who has operations cannot be deleted. Uncheck or remove all his / her operations first.');
                break;
            case 'EmptyParticipantsList':
                ui.showError('Operation should have at least one participant');
                break;
            case 'PersonWithSameNameAlreadyExists':
                ui.showError('Person with same name already exists.');
                break;
            case 'PersonCannotHaveReservedName':
                ui.showError('This name is reserved');
                break;
            case 'PersonalOperationNotFound':
                ui.showError('This person isn\'t participant anymore');
                break;
            case 'ViewNotFound':
                ui.showError('Requested view not found on the server');
                break;
            case 'InvalidCode':
                ui.showError('Invalid code');
                break;

            default:
                ui.showError(err);
        }
    }

    ui.showModal = function (data) {
        $.modal(data, {
            onOpen: function (dialog) {
                dialog.overlay.fadeIn('normal', function () {
                    dialog.container.slideDown('normal', function () {
                        dialog.data.fadeIn('normal');
                    });
                });
            },
            onClose: function (dialog) {
                dialog.data.fadeOut('normal', function () {
                    dialog.container.slideUp('normal', function () {
                        dialog.overlay.fadeOut('normal', function () {
                            $.modal.close(); // must call this!
                        });
                    });
                });
            },
            closeHTML: '<span></span>'
        });
        ui.attachCalendar();
    }

    ui.showError = function (message, options) {
        defaultOptions = { classes: ["smokey", "error"] };
        for (option in options) {
            defaultOptions[option] = options[option];
        }
        $('#freeow').freeow("Error", message, defaultOptions);
    }

    function stickActionsMenu() {
        var target = $(".actionsMenu");
        if (target.length == 0) { return; }
        var padding = 11;     // 11 cause .actionsMenu_fixed has 10px padding + 1 px for magic o_0
        var topOffset = target.offset().top;
        var leftOffset = target.offset().left;
        var docked = false;
        $(document).scroll(function () {
            var target = $(".actionsMenu");
            if (target.length == 0) { return; }
            var leftOffset = target.offset().left;
            var docOffset = $(document).scrollTop();
            if (!docked && docOffset > topOffset - padding) {
                target.parent().append(
                target.clone()
                    .attr("data-cloned", "true")
                    .css("visibility", "hidden"));
                target.wrap('<div class="actionsMenu_fixed" />');
                target.parent().css({ top: '0px', left: '0px', right: '0px' })
                target.css({ top: '0px', left: leftOffset - padding + 'px' })
                docked = true;
            }
            else if (docked && docOffset <= topOffset - padding) {
                $('.actionsMenu_fixed').remove()
                $(".actionsMenu").filter("[data-cloned]").css('visibility', 'visible')
                    .removeAttr('data-cloned');     // reselecting because of cloning  
                docked = false;
            }
        });
    }

    function hideSelfLinks() {
        function hrefSelector(href) {
            return '[href=\"' + href + '\"]';
        }
        var href = window.location.href;
        var pathname = window.location.pathname;
        var search = window.location.search.substring();
        $('a')
            .filter(hrefSelector(href) + ', ' + hrefSelector(pathname + search))
                .each(function () {
                    $(this).replaceWith($(this).html());
                });
    }

    ui.attachCalendar = function () {
        $('.datePicker_wrapper>input').Zebra_DatePicker({
            format: 'j.m.Y',
            readonly_element: false
        });
    }

})();