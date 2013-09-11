// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/homelogged/homelogged.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById('watched-shows-list-view').winControl
                .addEventListener('iteminvoked', function (event) {
                    event.detail.itemPromise.done(function (showDetails) {
                        WinJS.Navigation.navigate('/pages/showdetails/showdetails.html', showDetails);
                    })
                });
        },
        init: function (element, options) {
            var messageDialog = new Windows.UI.Popups.MessageDialog('This is your personal collection of shows you are watching. If you mark an episode of a show as seen, it will apear in this page for your convenience.');
            messageDialog.commands.append(new Windows.UI.Popups.UICommand('OK!'));
            messageDialog.commands.append(new Windows.UI.Popups.UICommand('Let me see some shows!'));
            try {
                ViewModels.loadWatchedShows().then(function (response) {
                    if (response) {
                        if (response.length === 0) {
                            messageDialog.showAsync().then(function (value) {
                                if (value.label == 'Let me see some shows!') {
                                    WinJS.Navigation.navigate(Application.navigator.home);
                                }
                            });
                        }
                    }
                })
            } catch (e) {
                messageDialog.showAsync().then(function (value) {
                    if (value.label == 'Let me see some shows') {
                        WinJS.Navigation.navigate(Application.navigator.home);
                    }
                });
            }
        },
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
