(function () {
    var localSettings = Windows.Storage.ApplicationData.current.localSettings;

    var appKey = '75a0e8d1dbfaa7c368aec14532e41729';
    var baseUrl = 'http://api.trakt.tv/';
    var username = '';
    var passwordHash = '';
    setAccountInformation();

    function setAccountInformation() {
        if (localSettings.values['account']) {
            username = localSettings.values['account'].username;
            passwordHash = localSettings.values['account'].password;
        }
    }

    function getTrendingShows() {
        return WinJS.xhr({
            url: baseUrl + 'shows/trending.json/' + appKey,
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash
            })
        });
    }

    function getSearchResults(query) {
        return WinJS.xhr({
            url: baseUrl + 'search/shows.json/' + appKey + '/' + query
        });
    }

    function loginUser(userData) {
        return WinJS.xhr({
            url: baseUrl + 'account/test/' + appKey,
            type: 'POST',
            data: JSON.stringify(userData)
        });
    }

    function getShowData(title) {
        var urlArr = title.split("/");
        var slug = urlArr.pop();
        return WinJS.xhr({
            url: baseUrl + 'show/summary.json/' + appKey + '/' + slug + '/extended',
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash
            })
        });
    }

    function getUserCalendar() {
        return WinJS.xhr({
            url: baseUrl + 'user/calendar/shows.json/' + appKey + '/' + username,
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash
            })
        });
    }

    function getWatchedShows() {
        return WinJS.xhr({
            url: baseUrl + 'user/library/shows/watched.json/' + appKey + '/' + username,
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash
            })
        });
    }

    function postCheckinShow(data) {
        return WinJS.xhr({
            url: baseUrl + 'show/episode/seen/' + appKey,
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash,
                'imdb_id': data.imdb_id,
                'tvdb_id': data.tvdb_id,
                'title': data.title,
                'year': data.year,
                'episodes': [{
                    'season': data.season,
                    'episode': data.episode
                }]
            })
        });
    }

    function postComment(data) {
        return WinJS.xhr({
            url: baseUrl + 'comment/episode/' + appKey,
            type: 'POST',
            data: JSON.stringify({
                'username': username,
                'password': passwordHash,
                'tvdb_id': data.tvdb_id,
                'title': data.title,
                'year': data.year,
                'season': data.season,
                'episode': data.episode,
                "comment": data.comment
            })
        });
    }

    WinJS.Namespace.define('Data', {
        getTrendingShows: getTrendingShows,
        getSearchResults: getSearchResults,
        loginUser: loginUser,
        getShowData: getShowData,
        getUserCalendar: getUserCalendar,
        getWatchedShows: getWatchedShows,
        postCheckinShow: postCheckinShow,
        setAccountInformation: setAccountInformation,
        postComment: postComment
    });
})();