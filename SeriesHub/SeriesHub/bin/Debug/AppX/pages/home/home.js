(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            document.getElementById('trending-shows-list-view').winControl
                .addEventListener('iteminvoked', function (event) {
                    event.detail.itemPromise.done(function (showDetails) {
                        WinJS.Navigation.navigate('/pages/showdetails/showdetails.html', showDetails);
                    })
                });
        },

        init: function (element, options) {
            ViewModels.loadTrendingShows();
        }
    });
})();
