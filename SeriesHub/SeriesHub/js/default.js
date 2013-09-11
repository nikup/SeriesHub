// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var localSettings = Windows.Storage.ApplicationData.current.localSettings;

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                var searchQuerySessionState = JSON.parse(app.sessionState['searchQuery']);
                ViewModels.searchQuery.queryText = searchQuerySessionState.queryText;
                ViewModels.searchQuery.errorText = searchQuerySessionState.errorText;
                ViewModels.searchQuery.resultsCount = searchQuerySessionState.resultsCount;
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                var appBar = document.getElementById('app-bar');
                appBar.winControl.hideCommands([
                    'app-bar-mark-seen',
                    'app-bar-comment-episode'
                ]);

                var navigationPage;;
                if (localSettings.values['account']) {
                    navigationPage = '/pages/homelogged/homelogged.html';
                } else {
                    appBar.winControl.hideCommands([
                        'app-bar-home',
                        'app-bar-this-week'
                    ]);
                    navigationPage = Application.navigator.home;
                    WinJS.UI.SettingsFlyout.showSettings('login', '/pages/loginsettings/loginsettings.html');
                }

                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(navigationPage);
                }
            }));
        }

        document.getElementById('app-bar-login').addEventListener('click', function (event) {
            WinJS.UI.SettingsFlyout.showSettings('login', '/pages/loginsettings/loginsettings.html');
        });

        document.getElementById('app-bar-home').addEventListener('click', function (event) {
            nav.navigate('/pages/homelogged/homelogged.html');
        });

        document.getElementById('app-bar-this-week').addEventListener('click', function (event) {
            nav.navigate('/pages/this-week/this-week.html');
        });

        document.getElementById('app-bar-trending').addEventListener('click', function (event) {
            nav.navigate('/pages/home/home.html');
        });
    });

    app.oncheckpoint = function (args) {
        app.sessionState['searchQuery'] = JSON.stringify({
            queryText: ViewModels.searchQuery.queryText,
            errorText: ViewModels.searchQuery.errorText,
            resultsCount: ViewModels.searchQuery.resultsCount
        });
        app.sessionState.history = nav.history;
    };

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            'login': { title: 'Login', href: '/pages/loginsettings/loginsettings.html' },
            'privacyPolicy': { title: 'Privacy Policy', href: '/pages/privacy/privacy.html' }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();
