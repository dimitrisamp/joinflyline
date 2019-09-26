$(document).ready(function () {
    var Stopover = new Slider("input#stopover", {
        min: 2,
        max: 24,
        step: 1,
        value: [2, 24],
        tooltip: "hide",
        formatter: stopover
    });
    Stopover.on('slideStop', function () {
    }).on('slide', function () {
        stopover(Stopover.getValue());
    });
});

function getFilterAirlineSelections() {
    $("")
}

function getFilterFormData() {
    
}

function stopover(val) {
    if (Array.isArray(val)) {
        $(".stopover").text(val[0] + ' - ' + val[1] + ' hours');
    } else {
        //$(".stopover").text(val + ' hours');
    }
}

function getFilterFormData() {

}

$(document).ready(function () {
    var DeCityTakeOff = new Slider("input#de_city_take_off", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    DeCityTakeOff.on('slideStop', function () {
        var range = getTime(DeCityTakeOff.getValue());
        if (Array.isArray(range)) {
            app.timeFilterParams.depTake.min = range[0];
            app.timeFilterParams.depTake.max = range[1];
        }
        app.filterByTimes();
    }).on('slide', function () {
        $("#de_city_take_off_time").text(timeFormatter(DeCityTakeOff.getValue()));
    });
    var ArrCityTakeOff = new Slider("input#arr_city_take_off", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    ArrCityTakeOff.on('slideStop', function () {
        var range = getTime(ArrCityTakeOff.getValue());
        if (Array.isArray(range)) {
            app.timeFilterParams.arrTake.min = range[0];
            app.timeFilterParams.arrTake.max = range[1];
        }
        app.filterByTimes();
    }).on('slide', function () {
        $("#arr_city_take_off_time").text(timeFormatter(ArrCityTakeOff.getValue()));
    });
    var DeCityLanding = new Slider("input#de_city_landing", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    DeCityLanding.on('slideStop', function () {
        var range = getTime(DeCityLanding.getValue());
        if (Array.isArray(range)) {
            app.timeFilterParams.depLand.min = range[0];
            app.timeFilterParams.depLand.max = range[1];
        }
        app.filterByTimes();
    }).on('slide', function () {
        $("#de_city_landing_time").text(timeFormatter(DeCityLanding.getValue()));
    });
    var ArrCityLanding = new Slider("input#arr_city_landing", {
        min: 0,
        max: 1440,
        step: 15,
        value: [0, 1440],
        tooltip: "hide",
        formatter: timeFormatter
    });
    ArrCityLanding.on('slideStop', function () {
        var range = getTime(ArrCityLanding.getValue());
        if (Array.isArray(range)) {
            app.timeFilterParams.arrLand.min = range[0];
            app.timeFilterParams.arrLand.max = range[1];
        }
        app.filterByTimes();
    }).on('slide', function () {
        $("#arr_city_landing_time").text(timeFormatter(ArrCityLanding.getValue()));
    });
    var filterPriceRange = new Slider("input#filter_price_range", {
        min: 0,
        max: 3000,
        step: 15,
        value: [0, 3000],
        tooltip: "hide"
    });
    filterPriceRange.on('slide', function () {
        $("#filter_price_ammount").text(getPriceRange(filterPriceRange.getValue()));
    });
});

function getPriceRange(rangeVal) {
    var rangeMin = rangeVal[0];
    var rangeMax = rangeVal[1];
    return "$" + rangeMin + " - $" + rangeMax;
}

function getTime(val) {
    if (Array.isArray(val)) {
        var time = ['00:00', '23:59'];
        var hour = Math.floor(val[0] / 60);
        var minute = val[0] - hour * 60;
        time[0] = (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
        hour = Math.floor(val[1] / 60);
        minute = val[1] - hour * 60;
        time[1] = (hour >= 10 ? hour : '0' + hour) + ':' + (minute >= 10 ? minute : '0' + minute);
        return time;
    }
    return null;
}

function timeFormatter(val) {
    if (Array.isArray(val)) {
        var hours1 = Math.floor(val[0] / 60);
        var minutes1 = val[0] - hours1 * 60;

        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            //hours1 = 12;
            minutes1 = minutes1;
        }
        var minTime = hours1 + ':' + minutes1;

        var hours2 = Math.floor(val[1] / 60);
        var minutes2 = val[1] - hours2 * 60;

        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }

        var maxTime = hours2 + ':' + minutes2;
        return minTime + " - " + maxTime;
    } else {
        var hour = Math.floor(val / 60);
        var minute = val - hour * 60;

        if (hour.length == 1) hour = '0' + hour;
        if (minute.length == 1) minute = '0' + minute;
        if (minute == 0) minute = '00';
        if (hour >= 12) {
            if (hour == 12) {
                hour = hour;
                minute = minute + " PM";
            } else {
                hour = hour - 12;
                minute = minute + " PM";
            }
        } else {
            hour = hour;
            minute = minute + " AM";
        }
        if (hour == 0) {
            //hour = 12;
            minute = minute;
        }
        return hour + ':' + minute;
    }
}

let tripButton = document.querySelector(".btn-group");
let picker = new Lightpick({
    field: document.getElementById('departure_date'),
    secondField: document.getElementById('return_date'),
    singleDate: false,
    onSelect: function (start, end) {
        var str = '';
        str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
        str += end ? end.format('Do MMMM YYYY') : '...';
        {
            //document.getElementById('result-3').innerHTML = str;

        }
    }
});

$(document).ready(function () {
    let is_mobile = false;
    if ($('#mobileIndicator').css('display') === 'none') {
        is_mobile = true;
    }
    if (is_mobile) {
        $('.search-bar-section').removeClass('sticky-top');
    } else {
        $('.search-bar-section').addClass('sticky-top')
    }
    $('.card-toggler').on('click', function () {
        $(this).find('.card-title').find('img').toggleClass('d-none');
    });
    $('.result-toggler').on('click', function () {
        $(this).find('.arrow-indicator').find('img').toggleClass('d-none');
    })
});
$(window).on('resize', function () {
    let is_mobile = false;
    if ($('#mobileIndicator').css('display') == 'none') {
        is_mobile = true;
    }
    if (is_mobile) {
        $('.search-bar-section').removeClass('sticky-top');
    } else {
        $('.search-bar-section').addClass('sticky-top')
    }
});
