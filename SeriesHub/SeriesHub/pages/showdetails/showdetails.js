// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/showdetails/showdetails.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var sectionWidth = WinJS.Utilities.getContentWidth(document.body);
            document.getElementById('show-details-wrapper').style.width = (sectionWidth - 265) + 'px';

            var showData = ViewModels.fullShowData;
            WinJS.Binding.processAll(element, showData);

            document.getElementById('show-seasons-list-view').winControl
                .addEventListener('iteminvoked', function (event) {
                    event.detail.itemPromise.done(function (seasonDetails) {
                        WinJS.Navigation.navigate('/pages/seasonepisodes/seasonepisodes.html', {
                            episodes: seasonDetails.data.episodes,
                            show: showData,
                            season: seasonDetails.data.season
                        });
                    })
                });
        },

        unload: function () {
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },

        init: function (element, options) {
            ViewModels.getFullShowData(options.data.url).done(function () {
                try {
                    var listView = document.getElementById('show-seasons-list-view').winControl;
                    listView.itemDataSource = ViewModels.showSeasonsList.dataSource;
                    WinJS.Binding.processAll(document.getElementById('show-seasons-list-view'));
                    document.getElementById('show-name-title').classList.remove('hidden');
                    document.getElementById('show-details-section').classList.remove('hidden');
                    document.getElementById('loading-page-ring').classList.add('hidden');
                } catch (e) {
                }
            });
        }
    });
})();
