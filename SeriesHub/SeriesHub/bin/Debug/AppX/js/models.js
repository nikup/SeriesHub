(function () {
    var showSummaryModel = {
        title: '',
        overview: '',
        images: {},
        ratings: {},
        genres: '',
        network: '',
        year: '',
        runtime: '',
        air_day: '',
        air_time: '',
        people: {},
        seasons: {},
        tvdb_id: '',
        next_episode: {}

    }

    var episodeCalendarModel = {
        date: '',
        title: '',
        overview: '',
        image: '',
        show: ''
    }

    WinJS.Namespace.define('Models', {
        showSummary: showSummaryModel,
        episodeCalendar: episodeCalendarModel
    });
})();