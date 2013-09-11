/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />
// For an introduction to the Search Contract template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232512

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var searchPageURI = "/pages/searchresults/searchresults.html";

    ui.Pages.define(searchPageURI, {
        ready: function (element, options) {
            WinJS.Binding.processAll(element, ViewModels.searchQuery);
            document.getElementById('search-results-list-view').winControl
                .addEventListener('iteminvoked', function (event) {
                    event.detail.itemPromise.done(function (showDetails) {
                        WinJS.Navigation.navigate('/pages/showdetails/showdetails.html', showDetails);
                    })
                });
        },

        init: function (element, options) {
            ViewModels.loadSearchResults(options.queryText);
        }
    });

    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }

                return nav.navigate(searchPageURI, { queryText: args.detail.queryText });
            }));
        }
    });

    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) {
        nav.navigate(searchPageURI, args);
    };
})();
