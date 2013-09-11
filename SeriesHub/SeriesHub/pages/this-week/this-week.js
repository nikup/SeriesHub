// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/this-week/this-week.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        init: function (element, options) {
            var messageDialog = new Windows.UI.Popups.MessageDialog('Here you can track the new airing episodes in the upcomming week, for the shows that you are watching.');
            messageDialog.commands.append(new Windows.UI.Popups.UICommand('OK!'));
            messageDialog.commands.append(new Windows.UI.Popups.UICommand('Let me see some shows!'));
            try {
                ViewModels.loadUserCalendar().then(function (responseText) {
                    if (responseText) {
                        if (responseText.length === 0) {
                            messageDialog.showAsync().then(function (value) {
                                if (value.label == 'Let me see some shows!') {
                                    WinJS.Navigation.navigate(Application.navigator.home);
                                }
                            });
                        }
                    }
                });
            } catch (e) {
                messageDialog.showAsync().then(function (value) {
                    if (value.label == 'Let me see some shows') {
                        WinJS.Navigation.navigate(Application.navigator.home);
                    }
                });
            }
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
