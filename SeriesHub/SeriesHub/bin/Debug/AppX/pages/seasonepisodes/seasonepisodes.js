// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var localSettings = Windows.Storage.ApplicationData.current.localSettings;
    var optionsCache = '';

    function pickFileEvent(event) {
        var options = optionsCache;
        var openPicker = Windows.Storage.Pickers.FileOpenPicker();
        openPicker.fileTypeFilter.replaceAll(['.txt']);
        openPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                var listView = document.getElementById('season-episodes-list-view').winControl;
                var selectedItemIndex = listView.selection.getIndices()[0];
                var episodeData = ViewModels.episodesList.getItem(selectedItemIndex).data;

                Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
                    var requestData = {
                        tvdb_id: options.show.tvdb_id,
                        imdb_id: options.show.imdb_id,
                        title: options.show.title,
                        year: options.show.year,
                        season: episodeData.season,
                        episode: episodeData.episode,
                        comment: text
                    };

                    ViewModels.postComment(requestData).then(function (textResponse) {
                        var notifications = Windows.UI.Notifications;
                        var template = notifications.ToastTemplateType.toastText01;
                        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                        var toastTextElements = toastXml.getElementsByTagName("text");
                        var notififcationText = "You just commented on Episode " + episodeData.episode + ": " + episodeData.title + " Comment: " + text;
                        toastTextElements[0].appendChild(toastXml.createTextNode(notififcationText));
                        var toast = new notifications.ToastNotification(toastXml);
                        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                        toastNotifier.show(toast);

                    });
                });
            }
        })
    }

    function markAsSeenEvent(event) {
        var options = optionsCache;
        var listView = document.getElementById('season-episodes-list-view').winControl;
        var selectedItemsIndexes = listView.selection.getIndices();
        if (selectedItemsIndexes.length > 0) {
            var selectedItemIndex = selectedItemsIndexes[0];
            var episodeData = ViewModels.episodesList.getItem(selectedItemIndex).data;
            options.show.season = episodeData.season;
            options.show.episode = episodeData.episode;
            ViewModels.postCheckinShow(options.show).then(function (text) {
                listView.selection.clear();
                var notifications = Windows.UI.Notifications;
                var template = notifications.ToastTemplateType.toastText01;
                var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
                var toastTextElements = toastXml.getElementsByTagName("text");
                var notififcationText = "You just marked as seen Episode " + episodeData.episode + ": " + episodeData.title;
                toastTextElements[0].appendChild(toastXml.createTextNode(notififcationText));
                var toast = new notifications.ToastNotification(toastXml);
                var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
                toastNotifier.show(toast);
            });
        }
    }

    WinJS.UI.Pages.define("/pages/seasonepisodes/seasonepisodes.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = document.getElementById('season-episodes-list-view').winControl;
            listView.itemDataSource = ViewModels.episodesList.dataSource;
            WinJS.Binding.processAll(element, options.episodes);
            var appBar = document.getElementById('app-bar').winControl;

            listView.addEventListener('selectionchanged', function (event) {
                if (localSettings.values['account']) {
                    appBar.showCommands(['app-bar-mark-seen']);
                    appBar.showCommands(['app-bar-comment-episode']);
                }
                appBar.sticky = true;
                appBar.show();
            });

            document.getElementById('app-bar-mark-seen').addEventListener('click', markAsSeenEvent);

            document.getElementById('app-bar-comment-episode').addEventListener('click', pickFileEvent);
        },

        unload: function () {
            document.getElementById('app-bar').winControl.sticky = false;
            document.getElementById('app-bar').winControl.hideCommands(['app-bar-mark-seen']);
            document.getElementById('app-bar').winControl.hideCommands(['app-bar-comment-episode']);
            document.getElementById('app-bar-mark-seen').removeEventListener('click', markAsSeenEvent);
            document.getElementById('app-bar-comment-episode').removeEventListener('click', pickFileEvent);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        },

        init: function (element, options) {
            optionsCache = options;
            ViewModels.loadEpisodes(options.episodes);
        }
    });
})();
