(function () {
    var trendingShowsList = new WinJS.Binding.List([]);
    var searchResultsList = new WinJS.Binding.List([]);
    var userCalendarList = new WinJS.Binding.List([]);
    var watchedShowsList = new WinJS.Binding.List([]);
    var showSeasonsList = new WinJS.Binding.List([]);
    var episodesList = new WinJS.Binding.List([]);
    var fullShowData = WinJS.Binding.as(Models.showSummary);
    var searchQuery = WinJS.Binding.as({
        queryText: '',
        errorText: '',
        resultsCount: 0
    });

    function loadTrendingShows() {
        var currentCount = trendingShowsList.dataSource.list.length;
        if (currentCount === 0) {
            return Data.getTrendingShows().then(function (httpResponse) {
                var trendingShows = JSON.parse(httpResponse.response);

                for (var i = 0; i < trendingShows.length; i++) {
                    trendingShowsList.push(trendingShows[i]);
                }
            }, function (error) {
                WinJS.Navigation.navigate('/pages/errorpage/errorpage.html');
            });
        }
    }

    function loadSearchResults(queryText) {
        if (!queryText) {
            queryText = searchQuery.queryText;
        } else {
            searchQuery.queryText = queryText;
        }

        var queryWords = queryText.split(/[-.,!?# ]/).filter(function (x) { return x; });
        var query = queryWords.join('+');

        Data.getSearchResults(query).done(function (httpResponse) {
            var searchResults = JSON.parse(httpResponse.response);
            var resultsCount = searchResults.length;
            searchQuery.resultsCount = resultsCount;

            var currentCount = searchResultsList.dataSource.list.length
            searchResultsList.dataSource.list.splice(0, currentCount);
            for (var i = 0; i < resultsCount; i++) {
                searchResultsList.push(searchResults[i]);
            }
        }, function (errorText) {
            WinJS.Navigation.navigate('/pages/errorpage/errorpage.html');
        });
    }

    function loginUser(userData) {
        return Data.loginUser(userData);
    }

    function getFullShowData(title) {
        return Data.getShowData(title)
            .then(function (httpResponse) {
                var responseShowSummary = JSON.parse(httpResponse.response);
                for (var property in responseShowSummary) {
                    if (property == "seasons") {
                        var currentCount = showSeasonsList.dataSource.list.length;
                        showSeasonsList.dataSource.list.splice(0, currentCount);
                        for (var i = 0; i < responseShowSummary[property].length; i++) {
                            for (var j = 0; j < responseShowSummary[property][i].episodes.length; j++) {
                                if (responseShowSummary[property][i].episodes[j].watched == true) {
                                    responseShowSummary[property][i].episodes[j].watched = "seen";
                                } else {
                                    responseShowSummary[property][i].episodes[j].watched = "unseen";
                                }
                            }
                            showSeasonsList.push(responseShowSummary[property][i]);
                        }
                    }
                    if (property == "images") {
                        responseShowSummary[property].fanart = "url(" + responseShowSummary[property].fanart + ")";
                    }
                    fullShowData[property] = responseShowSummary[property];
                }
                var lastEpisodeSeason = 30;
                var lastEpisode = 30;
                for (var i = 0; i < fullShowData.seasons.length; i++) {
                    for (var j = 0; j < fullShowData.seasons[i].episodes.length; j++) {
                        if (fullShowData.seasons[i].episodes[j].watched == false) {
                            if (lastEpisodeSeason > fullShowData.seasons[i].season && fullShowData.seasons[i].season != 0) {
                                lastEpisodeSeason = fullShowData.seasons[i].season;
                                lastEpisode = fullShowData.seasons[i].episodes[j].episode;
                                fullShowData.next_episode = fullShowData.seasons[i].episodes[j];
                            }
                            else if (lastEpisodeSeason == fullShowData.seasons[i].season && fullShowData.seasons[i].season != 0) {
                                if (lastEpisode > fullShowData.seasons[i].episodes[j].episode) {
                                    lastEpisodeSeason = fullShowData.seasons[i].season;
                                    lastEpisode = fullShowData.seasons[i].episodes[j].episode;
                                    fullShowData.next_episode = fullShowData.seasons[i].episodes[j];
                                }
                            }

                        }
                    }
                }
                if (lastEpisodeSeason == 30) {
                    fullShowData.next_episode.title = "You've watched all episodes";
                    fullShowData.next_episode.season = "None";
                    fullShowData.next_episode.episode = "None";
                }
            }, function () {
                WinJS.Navigation.navigate('/pages/errorpage/errorpage.html');
            });
    }

    function loadUserCalendar() {
        var currentCount = userCalendarList.dataSource.list.length;
        if (currentCount === 0) {
            return Data.getUserCalendar().then(function (httpResponse) {
                var userCalendar = JSON.parse(httpResponse.response);
                for (var i = 0; i < userCalendar.length; i++) {
                    var date = userCalendar[i].date;
                    for (var j = 0; j < userCalendar[i].episodes.length; j++) {
                        var episode = {};
                        episode.title = userCalendar[i].episodes[j].episode.title;
                        episode.date = date;
                        episode.overview = userCalendar[i].episodes[j].episode.overview;
                        episode.image = userCalendar[i].episodes[j].episode.images.screen;
                        episode.show = userCalendar[i].episodes[j].show.title;
                        userCalendarList.push(episode);
                    }
                }

                return userCalendar;
            }, function () {
                WinJS.Navigation.navigate('/pages/errorpage/errorpage.html');
            });
        }

        return new WinJS.Promise(function (complete) {
            complete();
        });
    }

    function loadWatchedShows() {
        var currentCount = watchedShowsList.dataSource.list.length;
        if (currentCount === 0) {
            return Data.getWatchedShows().then(function (httpResponse) {
                var watchedShows = JSON.parse(httpResponse.response);

                for (var i = 0; i < watchedShows.length; i++) {
                    watchedShowsList.push(watchedShows[i]);
                }

                return watchedShows;
            }, function () {
                WinJS.Navigation.navigate('/pages/errorpage/errorpage.html');
            });
        }

        return new WinJS.Promise(function (complete) {
            complete();
        });
    }

    function postCheckinShow(showData) {
        return Data.postCheckinShow(showData);
    }

    function setAccountInformation() {
        Data.setAccountInformation();
    }

    function loadEpisodes(episodes) {
        var currentCount = episodesList.dataSource.list.length;
        episodesList.dataSource.list.splice(0, currentCount);
        for (var i = 0; i < episodes.length; i++) {
            episodesList.push(episodes[i]);
        }
    }

    function postComment(data) {
        return Data.postComment(data);
    }

    WinJS.Namespace.define('ViewModels', {
        loadTrendingShows: loadTrendingShows,
        trendingShows: trendingShowsList,
        loadSearchResults: loadSearchResults,
        searchResults: searchResultsList,
        searchQuery: searchQuery,
        loginUser: loginUser,
        fullShowData: fullShowData,
        getFullShowData: getFullShowData,
        loadUserCalendar: loadUserCalendar,
        userCalendarList: userCalendarList,
        showSeasonsList: showSeasonsList,
        loadWatchedShows: loadWatchedShows,
        watchedShows: watchedShowsList,
        postCheckinShow: postCheckinShow,
        setAccountInformation: setAccountInformation,
        episodesList: episodesList,
        loadEpisodes: loadEpisodes,
        postComment: postComment
    });
})();