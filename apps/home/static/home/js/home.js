import ClickOutside from './v-click-outside.js';
import {AIRLINE_ICONS} from './utils.js';


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
    el: '#main',
    delimiters: ['{(', ')}'],
    data: {
        searchResultPlaces: [],
        searchResultPlacesFrom: [],
        searchResultPlacesTo: [],
        searchProgress: false,
        searchResults: [],
        quickFiltersData: null,
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
        destinationTypes: {"round": "Round-trip", "oneway": "One-way"},
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
        airlinesSelectProgress: false,
        airlinesText: '',
        priceSelectProgress: false,
        priceText: '',
        user: JSON.parse(document.getElementById('django_user').textContent),
        form: {
            limit: 20,
            sort: null,
            priceRange: [0, 3000],
            airlines: [
                {name: "American Airlines", checked: false, code: "AA"},
                {name: "United Airlines", checked: false, code: "UA"},
            ],
            maxStops: null,
            noOfPassengers: "Passengers",
            destinationTypeId: 'round',
            seatType: 'M',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0,
            departure_date: "",
            return_date: "",
            depareture_date_data: null,
            return_date_data: null,
            city_from: "",
            city_to: "",
            placeFrom: "",
            placeTo: "",
        }
    },
    watch: {
        searchResults: function(val, oldVal) {
            setDatePick();
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
        loadMore() {
            this.form.limit = this.form.limit + 10;
            this.search();
        },
        sortResultsBy(sort) {
            this.form.sort = sort;
            this.search();
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
        getSearchURL() {
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
            formData.append("fly_from", placeFrom.code);
            formData.append("fly_to", placeTo.code);
            const dateFrom = this.form.departure_date_data.format('DD/MM/YYYY');
            formData.append("date_from", dateFrom);
            formData.append("date_to", dateFrom);
            formData.append("type", this.form.destinationTypeId);
            if (this.form.destinationTypeId === "round") {
                const dateTo = this.form.return_date_data.format('DD/MM/YYYY');
                formData.append("return_from", dateTo);
                formData.append("return_to", dateTo);
            }
            formData.append("adults", this.form.valAdults);
            formData.append("infants", this.form.valInfants);
            formData.append("children", this.form.valChildren);
            formData.append("selected_cabins", this.form.seatType);
            if (this.form.priceRange !== [0, 3000]) {
                const [price_from, price_to] = this.form.priceRange;
                formData.append("price_from", price_from);
                formData.append("price_to", price_to);
            }
            const selectedAirlines = this.form.airlines.filter((a) => a.checked);
            if (selectedAirlines) {
                formData.append('select_airlines', selectedAirlines.map((a) => a.code).join(','));
            }
            if (this.form.maxStops !== null) {
                formData.append('max_stopovers', this.form.maxStops);
            }
            if (this.form.sort !== null) {
                formData.append('sort', this.form.sort);
            }
            formData.append('limit', this.form.limit);
            formData.append('curr', 'USD');
            let url = new URL('https://kiwicom-prod.apigee.net/v2/search', window.location);
            url.search = new URLSearchParams(formData);
            return url
        },
        calculateLayovers(routes) {
            for (let i = 0; i < routes.length - 1; i++) {
                let [prev, next] = [routes[i], routes[i + 1]];
                prev.layover = (new Date(next.utc_departure).getTime() - new Date(prev.utc_arrival).getTime()) / 1000;
            }
        },
        getAirlines(flights) {
            let airlines = new Set();
            for (const flight of flights) {
                for (const airline of flight.airlines) {
                    airlines.add(airline);
                }
            }
            return [...airlines].sort();
        },
        processFlight(sr) {
            const to_routes = sr.route.filter((r) => r.return === 0);
            const return_routes = sr.route.filter((r) => r.return === 1);
            this.calculateLayovers(to_routes);
            this.calculateLayovers(return_routes);
            const roundtrip = return_routes.length > 0;
            const return_departure = roundtrip ? return_routes[0].local_departure : null;
            return {
                ...sr,
                roundtrip,
                return_departure,
            }
        },
        getQuickLinksData(flights) {
            const data = flights.map((f) => ({
                price: f.conversion.USD,
                duration: f.duration.total,
                quality: f.quality,
                date: new Date(f.local_departure)
            }));
            return {
                price: data.reduce((prev, curr) => prev.price < curr.price?prev:curr),
                duration: data.reduce((prev, curr) => prev.duration < curr.duration?prev:curr),
                quality: data.reduce((prev, curr) => prev.quality < curr.quality?prev:curr),
                date: data.reduce((prev, curr) => prev.date < curr.date?prev:curr),
            }
        },
        displaySearchResults(data) {
            if (this.searchResults.length === 0) {
                this.form.airlines = data.airlines.map(a => ({
                    code: a,
                    name: AIRLINE_ICONS[a] || a,
                    checked: false
                }));
            }
            this.searchResults = data.data.data;
        },
        search() {
            this.searchProgress = true;
            fetch(this.getSearchURL(), {
                headers: {'apikey': 'xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI'},
            }).then(
                (response) => response.json()
            ).then(
                (data) => {
                    let parent = {...data};
                    delete parent.data;
                    data.data = data.data.map(this.processFlight);
                    data.data = data.data.map((o) => {o.parent = parent; return o});
                    const airlines = this.getAirlines(data.data);
                    this.quickFiltersData = this.getQuickLinksData(data.data);
                    this.displaySearchResults({data, airlines});
                }
            ).finally(
                () => {
                    this.searchProgress = false;
                }
            )
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
        setDatePick();
    },
    computed: {
        isFormIncomplete() {
            if (this.form.destinationTypeId === "round") {
                if (!this.form.return_date) return true;
            }
            if (!this.form.departure_date) return true;
            const placeTo = this.cityToInput.searchResults[this.cityToInput.selectedIndex];
            const placeFrom = this.cityFromInput.searchResults[this.cityFromInput.selectedIndex];
            if (!placeTo || !placeFrom) return true;
            return false;
        },
        showWideForm() {
            return this.user.anonymous && this.searchResults.length === 0 && !this.searchProgress;
        },
        cityFromTo() {
            const cityFrom = this.cityFromInput.searchResults[this.cityFromInput.selectedIndex].name;
            const cityTo = this.cityToInput.searchResults[this.cityToInput.selectedIndex].name;
            return `${cityFrom} -> ${cityTo}`;
        },
        airlineNames() {
            return this.form.airlines.map((e)=>e.name).join(', ');
        }
    }
});

function setDatePick() {
    new Lightpick({
        field: document.getElementById('departure_date'),
        secondField: document.getElementById('return_date'),
        singleDate: false,
        onSelect(start, end) {
            if (start) app.form.departure_date = start.format('MM/DD/YYYY');
            if (end) app.form.return_date = end.format('MM/DD/YYYY');
            app.form.departure_date_data = start;
            app.form.return_date_data = end;
        }
    });
}

$(function () {
    $('#fullpage').fullpage({
        scrollBar: true,
        navigation: true,
        normalScrollElements: '.normal-scroll',
    });

    var sticky = 400;
    $(window).scroll(function () {
        if ($(window).scrollTop() > sticky) {
            $("header").addClass("sticky");
            $("#fp-nav").addClass("dots-display");
        } else {
            $("header").removeClass("sticky");
            $("#fp-nav").removeClass("dots-display");
        }
    });
 $('.fly-linesetion').hide();
    if($(window).width() < 767) {  
         fullpage_api.destroy('all');
      $('.hide-view').hide();
      $('.fly-linesetion').show();    
      $("#home-Learnmore").click(function(){

        $('.mobile-before').addClass('hideheadersec');
        $('.hide-view').show();   
      });    
    }   


});
