const seatTypes = {
    'M': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First Class'
};

$('.dropdown-wrapper-to').css("left", $($('.flexed-search-item')[1]).position().left);


function debounce(fn, delay, ...rest) {
    let timeoutID = null;
    return function () {
        clearTimeout(timeoutID);
        let that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, rest)
        }, delay)
    }
}

const app = new Vue({
    el: '#app',
    delimiters: ['{(', ')}'],
    data: {
        searchResultPlaces: [],
        searchResultPlacesFrom: [],
        searchResultPlacesTo: [],
        searchLocation: '',
        noOfPassengers: 'Passengers',
        cityFromRequestProgress: false,
        cityFromSearchProgress: false,
        cityToRequestProgress: false,
        cityToSearchProgress: false,
        valPassengers: 1,
        searchParameter: '',
        searchQuery: {},
        seatTypeName: "Economy",
        form: {
            destinationType: "Return",
            noOfPassengers: "Passengers",
            destinationTypeId: 'round',
            seatType: 'M',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0,
            departure_date: "",
            arrival_date: "",
            city_from: "",
            city_to: "",
            placeFrom: "",
            placeTo: "",
        }
    },
    methods: {
        locationSearch: (term) => {
            return new Promise((resolve) => {
                let url = new URL('https://kiwicom-prod.apigee.net/locations/query');
                url.search = new URLSearchParams({
                    term,
                    locale: 'en-US',
                    location_types: 'city',
                });
                fetch(url, {
                    method: 'GET',
                    headers: {
                        apikey: 'xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI'
                    },
                    credentials: 'same-origin'
                }).then(
                    response => response.json()
                ).then(
                    data => resolve(data)
                );
            });
        },
        fromCityHandler: debounce(function () {
            if (app.form.city_from === null || app.form.city_from === "" || app.form.city_from.length < 3) {
                app.cityFromSearchProgress = false;
                return;
            }
            app.selectionOption = 1;
            app.cityFromSearchProgress = true;
            app.cityFromRequestProgress = true;
            app.locationSearch(app.form.city_from
            ).then(
                (data) => {
                    app.searchResultPlacesFrom = data.locations;
                }
            ).catch(
                () => {
                    console.log('Error')
                }
            ).finally(
                () => {
                    app.cityFromRequestProgress = false;
                }
            );
        }, 500),
        toCityHandler: debounce(function () {
            if (app.form.city_to === null || app.form.city_to === "" || app.form.city_to.length < 3) {
                app.cityToSearchProgress = false;
                return;
            }
            $('#dropdown-wrapper-to').css("left", $($('.flexed-search-item')[1]).position().left);
            app.cityToSearchProgress = true;
            app.selectionOption = 2;
            app.cityToRequestProgress = true;
            app.locationSearch(app.form.city_to
            ).then(
                (data) => {
                    app.searchResultPlacesTo = data.locations;
                }
            ).catch(
                () => {
                    console.log('Error')
                }
            ).finally(
                () => {
                    app.cityToRequestProgress = false;
                }
            );
        }, 500),
        clearList: function () {
            document.getElementById('mySelectedPlace').style.display = 'block';
        },

        clearPlaceItem: function (index) {
            this.mySelection.splice(index, 1);
        },

        getSelectedRadioValue: function (item, index) {
            console.log(item);
            if (item.checked === true) {
                app.form.stop = item.value;

            }

        },
        setStopOverValue: function (stopOverTo, stopOverFrom) {
            app.form.stopOverFrom = stopOverFrom + ":" + "00";
            app.form.stopOverTo = stopOverTo + ":" + "00";
        },

        search: () => {
            let formData = new FormData;
            app.form.departure_date = document.getElementById('departure_date').value;
            app.form.return_date = document.getElementById('return_date').value;

            if (document.getElementById('stopover') != null) {
                let stopSelected = document.getElementById('stopover').value;
                let chars = stopSelected.split(',');

                let stopOverTo;
                let stopOverFrom;

                if (chars[0].length === 1) {
                    stopOverFrom = "0" + chars[0];
                } else {
                    stopOverFrom = chars[0];
                }

                if (chars[1].length === 1) {
                    stopOverTo = "0" + chars[1];
                } else {
                    stopOverTo = chars[1];
                }

                app.setStopOverValue(stopOverTo, stopOverFrom);
            }

            if (document.getElementsByName("stop") != null) {
                document.getElementsByName("stop").forEach(app.getSelectedRadioValue)
            }


            formData.append("city_from", app.form.city_from);
            formData.append("city_to", app.form.city_to);
            formData.append("placeFrom", app.form.placeFrom);
            formData.append("placeTo", app.form.placeTo);
            formData.append("dep_date", app.form.departure_date);
            formData.append("type", app.form.destinationTypeId);
            if (app.form.destinationTypeId === "round") {
                formData.append("ret_date", app.form.return_date);
            }
            formData.append("adults", app.form.valAdults);
            formData.append("infants", app.form.valInfants);
            formData.append("children", app.form.valChildren);
            formData.append("selected_cabins", app.form.seatType);
            if (app.form.stop) formData.append("max_stopovers", app.form.stop);
            if (app.form.stopOverFrom) formData.append("stopover_from", app.form.stopOverFrom);
            if (app.form.stopOverTo) formData.append("stopover_to", app.form.stopOverTo);

            let url = new URL('/results', window.location);
            url.search = new URLSearchParams(formData);
            window.location = url;
        },

        swapPlaces: () => {
            let city_from = app.form.city_from;
            app.form.city_from = app.form.city_to;
            app.form.city_to = city_from;
            let placeTo = app.form.placeTo;
            app.form.placeTo = app.form.placeFrom;
            app.form.placeFrom = placeTo;
        },

        setPlace: function (placeName, codeIataCity, index) {
            this.searchResultPlaces.splice(index, 1);
            this.searchResultPlaces = [];
            document.getElementById('mySelectedPlace').innerText = placeName;
            document.getElementById('mySelectedPlace').placeholder = codeIataCity;
            document.getElementById('mySelectedPlace').style.display = 'block';

            switch (app.selectionOption) {
                case 1:
                    app.form.city_from = document.getElementById('mySelectedPlace').placeholder;
                    break;
                case 2:
                    app.form.city_to = document.getElementById('mySelectedPlace').placeholder;
            }
        },

        selectDestType: (type) => {
            let returnDateInput = document.getElementById('return_date');
            switch (type) {
                case "round":
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'Return';
                    returnDateInput.removeAttribute("disabled");
                    returnDateInput.closest('label.search_label').classList.remove("disabled");
                    return;
                case "oneway":
                    app.form.destinationTypeId = 'oneway';
                    app.form.destinationType = 'One way';
                    document.getElementById('return_date').setAttribute("disabled", "disabled");
                    returnDateInput.closest('label.search_label').classList.add("disabled");
                    return;
                default:
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'Return';
                    document.getElementById('return_date').removeAttribute("disabled");
                    returnDateInput.closest('label.search_label').classList.remove("disabled");
                    return;
            }
        },

        selectSeatType: (type) => {
            if (seatTypes.hasOwnProperty(type)) {
                app.form.seatType = type;

            } else {
                app.form.seatType = 'M';
            }
            app.seatTypeName = seatTypes[type];
        },
        choosePlaces: function () {
            let place = document.getElementById('mySelectedPlace').innerText;
            let placeId = document.getElementById('mySelectedPlace').placeholder;
            // window.locVal = document.getElementById('addLocation').value;

            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesFrom').value = place;
                    app.form.city_from = placeId;
                    $('#placesModal').modal('hide');
                    return;
                case 2:
                    document.getElementById('placesTo').value = place;
                    app.form.city_to = placeId;
                    $('#placesModal').modal('hide');
                    return;
            }

        },
        setPlace: function (placeName, codeIataCity, index) {
            this.searchResultPlaces.splice(index, 1);
            // this.searchResultPlaces = [];
            document.getElementById('mySelectedPlace').innerText = placeName;
            document.getElementById('mySelectedPlace').placeholder = codeIataCity;
            document.getElementById('mySelectedPlace').style.display = 'block';

            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesFrom').value = placeName;
                    app.form.placeFrom = document.getElementById('mySelectedPlace').placeholder;
                    break;
                case 2:
                    document.getElementById('placesTo').value = placeName;
                    app.form.placeTo = document.getElementById('mySelectedPlace').placeholder;
            }
        },

        chooseFromPlace: function (placeName, codeIataCity, index) {
            app.form.city_from = placeName;
            app.form.placeFrom = codeIataCity;
            app.cityFromSearchProgress = false;
        },
        chooseToPlace: function (placeName, codeIataCity, index) {
            app.form.city_to = placeName;
            app.form.placeTo = codeIataCity;
            app.cityToSearchProgress = false;
        },

        increment: function (index) {

            app.valPassengers = app.form.valAdults + app.form.valChildren + app.form.valInfants;

            if (app.valPassengers !== 9) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults !== 9) {
                            app.form.valAdults++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 2:

                        if (app.form.valChildren !== 8) {
                            app.form.valChildren++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:

                        if (app.form.valInfants !== app.form.valAdults) {
                            app.form.valInfants++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                }
            }

        },

        decrement: function (index) {

            app.valPassengers = app.form.valAdults + app.form.valChildren + app.form.valInfants;

            if (app.valPassengers !== 1) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults !== 1) {
                            app.form.valAdults--;
                            app.valPassengers--;
                            if (app.form.valInfants > app.form.valAdults) {
                                app.valPassengers--;
                                app.form.valInfants--;
                            }
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 2:
                        if (app.form.valChildren !== 0) {
                            app.form.valChildren--;
                            app.valPassengers--;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:
                        if (app.form.valInfants !== 0) {
                            app.form.valInfants--;
                            app.valPassengers--;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                }
            }

        },

        sumTotalsPassengers: function () {
            if (app.valPassengers === 1) {
                app.form.noOfPassengers = 'Passengers';
            } else {
                app.form.noOfPassengers = app.valPassengers + ' Passengers'
            }
        },
    }
});

$(function(){
    document.querySelector(".btn-group");
    new Lightpick({
        field: document.getElementById('departure_date'),
        secondField: document.getElementById('return_date'),
        singleDate: false,
    });
});
