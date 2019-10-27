import ClickOutside from './v-click-outside.js';


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

function getCityInputData(k) {
    const jsonData = sessionStorage.getItem(`city${k}Input`);
    const data = JSON.parse(jsonData);
    if (data) return data;
    return {
        focused: false,
        searchResults: [],
        requestProgress: false,
        searchProgress: false,
        selectedIndex: 0,
        text: "",
    }
}


const app = new Vue({
    el: '#dealform',
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
        cityFromInput: getCityInputData('From'),
        cityToInput: getCityInputData('To'),
        destinationTypes: {"return": "Round Trip", "oneway": "Oneway"},
        destinationTypeSelectProgress: false,
        passengerSelectProgress: false,
        seatTypeSelectProgress: false,
        maxStopsSelectProgress: false,
        maxStopsText: '',
        seatTypes: {
            'M': 'Economy',
            'W': 'Premium Economy',
            'C': 'Business',
            'F': 'First Class'
        },
        maxStopsFilterOptions: {
            0: "No Stops",
            1: "One Stop",
            2: "Two Stops",
        },
        searchResults: true,
        airlinesSelectProgress: false,
        airlinesText: '',
        priceSelectProgress: false,
        priceText: '',
        form: {
            priceRange: [0, 3000],
            airlines: [
                {name: "American Airlines", checked: false, code: "AA"},
                {name: "United Airlines", checked: false, code: "UA"},
            ],
            maxStops: null,
            noOfPassengers: "Passengers",
            destinationTypeId: 'return',
            seatType: 'M',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0,
            departure_date: "",
            return_date: "",
            city_from: "",
            city_to: "",
            placeFrom: "",
            placeTo: "",
        }
    },
    directives: {
        ClickOutside,
    },
    components: {
        VueSlider: window['vue-slider-component'],
    },
    methods: {
        updatePriceText() {
            const [a, b] = this.form.priceRange;
            this.priceText = `$${a}-$${b}`;
        },
        openPriceSelect() {
            setTimeout(() => {
                this.priceSelectProgress = true;
            }, 150)
        },
        closePriceSelect() {
            this.priceSelectProgress = false;
        },
        updateAirlinesSelection() {
            this.airlinesText = this.form.airlines.filter(
                (a) => a.checked
            ).map(
                (a) => a.name
            ).join(', ');
        },
        openAirlinesSelect() {
            setTimeout(() => {
                this.airlinesSelectProgress = true;
            }, 150);
        },
        closeAirlinesSelect() {
            this.airlinesSelectProgress = false;
        },
        closeMaxStopsSelect() {
            this.maxStopsSelectProgress = false;
        },
        openMaxStopsSelect() {
            setTimeout(() => {
                this.maxStopsSelectProgress = true;
            }, 150);
        },
        selectMaxStops(maxStops) {
            this.form.maxStops = maxStops;
            this.maxStopsText = this.maxStopsFilterOptions[this.form.maxStops];
            this.closeMaxStopsSelect();
        },
        openSeatTypeSelect() {
            setTimeout(() => {
                this.seatTypeSelectProgress = true;
            }, 50);

        },
        closeSeatTypeSelect() {
            this.seatTypeSelectProgress = false;
        },
        selectSeatType(type) {
            this.form.seatType = type;
            this.closeSeatTypeSelect();
        },
        openPassengersForm() {
            setTimeout(
                () => {
                    this.passengerSelectProgress = true;
                }, 50
            );

        },
        closePassengersForm() {
            if (this.passengerSelectProgress) {
                this.passengerSelectProgress = false;
            }
        },
        openDestinationType() {
            setTimeout(() => {
                this.destinationTypeSelectProgress = true;
            }, 50);
        },
        closeDestinationType() {
            this.destinationTypeSelectProgress = false;
        },
        selectDestinationType(dtypeId) {
            this.form.destinationTypeId = dtypeId;
            this.closeDestinationType();
        },
        cityFromInputFocused() {
            this.cityFromInput.focused = true;
        },
        cityFromInputBlurred() {
            const that = this;
            setTimeout(() => {
                that.cityFromInput.focused = false;
            }, 150);
            this.cityFromInput.searchProgress = false;
        },
        cityToInputFocused() {
            this.cityToInput.focused = true;
        },
        cityToInputBlurred() {
            const that = this;
            setTimeout(() => {
                that.cityToInput.focused = false;
            }, 150);
            this.cityToInput.searchProgress = false;
        },
        cityToInputChoose(i) {
            this.cityToInput.selectedIndex = i;
            this.cityToInput.text = this.formatPlace(this.cityToInput.searchResults[i]);
            this.cityToInput.searchProgress = false;
        },
        cityFromInputChoose(i) {
            this.cityFromInput.selectedIndex = i;
            this.cityFromInput.text = this.formatPlace(this.cityFromInput.searchResults[i]);
            this.cityFromInput.searchProgress = false;
        },
        formatPlace(place) {
            return `${place.name} ${place.subdivision ? place.subdivision.name : ""} ${place.country.code} (${place.code})`;
        },
        locationSearch(term) {
            return new Promise((resolve) => {
                let url = new URL('https://kiwicom-prod.apigee.net/locations/query');
                let searchParams = {
                    term,
                    locale: 'en-US',
                    location_types: 'city',
                };
                url.search = new URLSearchParams(searchParams);
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
        cityFromHandler: debounce(function () {
            if (this.cityFromInput.text === null || this.cityFromInput.text === "" || this.cityFromInput.text.length < 3) {
                this.cityFromInput.searchProgress = false;
                return;
            }
            this.cityFromInput.searchProgress = true;
            this.cityFromInput.requestProgress = true;

            const that = this;
            this.locationSearch(
                that.cityFromInput.text
            ).then(
                (data) => {
                    that.cityFromInput.searchResults = data.locations;
                }
            ).catch(
                () => {
                    console.log('Error')
                }
            ).finally(
                () => {
                    that.cityFromInput.requestProgress = false;
                }
            );
        }, 500),
        cityToHandler: debounce(function () {
            if (this.cityToInput.text === null || this.cityToInput.text === "" || this.cityToInput.text.length < 3) {
                this.cityToInput.searchProgress = false;
                return;
            }
            this.cityToInput.searchProgress = true;
            this.cityToInput.requestProgress = true;
            const that = this;
            this.locationSearch(
                that.cityToInput.text
            ).then(
                (data) => {
                    that.cityToInput.searchResults = data.locations;
                }
            ).catch(
                () => {
                    console.log('Error')
                }
            ).finally(
                () => {
                    that.cityToInput.requestProgress = false;
                }
            );
        }, 500),
        clearList() {
            document.getElementById('mySelectedPlace').style.display = 'block';
        },

        clearPlaceItem(index) {
            this.mySelection.splice(index, 1);
        },

        getSelectedRadioValue(item, index) {
            console.log(item);
            if (item.checked === true) {
                this.form.stop = item.value;

            }

        },
        setStopOverValue(stopOverTo, stopOverFrom) {
            this.form.stopOverFrom = stopOverFrom + ":" + "00";
            this.form.stopOverTo = stopOverTo + ":" + "00";
        },

        search() {
            let formData = new FormData;

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

                this.setStopOverValue(stopOverTo, stopOverFrom);
            }

            if (document.getElementsByName("stop") != null) {
                document.getElementsByName("stop").forEach(this.getSelectedRadioValue)
            }

            const placeTo = this.cityToInput.searchResults[this.cityToInput.selectedIndex];
            const placeFrom = this.cityFromInput.searchResults[this.cityFromInput.selectedIndex];
            formData.append("city_from", this.formatPlace(placeFrom));
            formData.append("city_to", this.formatPlace(placeTo));
            formData.append("placeFrom", placeFrom.code);
            formData.append("placeTo", placeTo.code);
            formData.append("dep_date", this.form.departure_date);
            formData.append("type", this.form.destinationTypeId);
            if (this.form.destinationTypeId === "round") {
                formData.append("ret_date", this.form.return_date);
            }
            formData.append("adults", this.form.valAdults);
            formData.append("infants", this.form.valInfants);
            formData.append("children", this.form.valChildren);
            formData.append("selected_cabins", this.form.seatType);
            if (this.form.stop) formData.append("max_stopovers", this.form.stop);
            if (this.form.stopOverFrom) formData.append("stopover_from", this.form.stopOverFrom);
            if (this.form.stopOverTo) formData.append("stopover_to", this.form.stopOverTo);
            let url = new URL('/results', window.location);
            url.search = new URLSearchParams(formData);
            window.sessionStorage.setItem('cityToInput', JSON.stringify(this.cityToInput));
            window.sessionStorage.setItem('cityFromInput', JSON.stringify(this.cityFromInput));
            window.location = url;
        },

        swapPlaces() {
            let city_from = this.form.city_from;
            this.form.city_from = this.form.city_to;
            this.form.city_to = city_from;
            let placeTo = this.form.placeTo;
            this.form.placeTo = this.form.placeFrom;
            this.form.placeFrom = placeTo;
        },
        increment(index) {

            this.valPassengers = this.form.valAdults + this.form.valChildren + this.form.valInfants;

            if (this.valPassengers !== 9) {

                switch (index) {
                    case 1:

                        if (this.form.valAdults !== 9) {
                            this.form.valAdults++;
                            this.valPassengers++;
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        return;
                    case 2:

                        if (this.form.valChildren !== 8) {
                            this.form.valChildren++;
                            this.valPassengers++;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        return;
                    case 3:

                        if (this.form.valInfants !== this.form.valAdults) {
                            this.form.valInfants++;
                            this.valPassengers++;
                        }
                        return;
                }
            }

        },

        decrement(index) {

            this.valPassengers = this.form.valAdults + this.form.valChildren + this.form.valInfants;

            if (this.valPassengers !== 1) {

                switch (index) {
                    case 1:

                        if (this.form.valAdults !== 1) {
                            this.form.valAdults--;
                            this.valPassengers--;
                            if (this.form.valInfants > this.form.valAdults) {
                                this.valPassengers--;
                                this.form.valInfants--;
                            }
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        return;
                    case 2:
                        if (this.form.valChildren !== 0) {
                            this.form.valChildren--;
                            this.valPassengers--;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        return;
                    case 3:
                        if (this.form.valInfants !== 0) {
                            this.form.valInfants--;
                            this.valPassengers--;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        return;
                }
            }

        },

        sumTotalsPassenger() {
            if (this.valPassengers === 1) {
                this.form.noOfPassengers = 'Passengers';
            } else {
                this.form.noOfPassengers = this.valPassengers + ' Passengers'
            }
        },
    },
    mounted() {
        this.updatePriceText();
    }
});

$(function () {
    document.querySelector(".btn-group");
    new Lightpick({
        field: document.getElementById('departure_date'),
        secondField: document.getElementById('return_date'),
        singleDate: false,
        onSelect(start, end) {
            app.form.departure_date = start.format('MM/DD/YYYY');
            app.form.return_date = end.format('MM/DD/YYYY');
        }
    });
    new fullScroll({
        displayDots: true,
        dotsPosition: 'right',
        animateTime: 0.7,
        animateFunction: 'ease'
    });
});
