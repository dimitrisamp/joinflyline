const app = new Vue({

    el: '#app',
    delimiters: ['{(', ')}'],
    data: {
        searchResultPlaces: [],
        seatType: 'Economy',
        noOfPassengers: 'Passengers',
        city: '',
        valPassengers: 1,
        mySelectedPlace: '',
        form: {
            destinationType: "Return",
            noOfPassengers: "Passengers",
            seatType: 'Economy',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0,
        }
    },
    methods: {
        cityHandler: function () {
            $.ajax({
                url: 'http://aviation-edge.com/v2/public/autocomplete?key=140940-4e6372&city=' + app.city,
                success: function (data) {
                    if (data) {
                        data = JSON.parse(data).cities;
                        app.searchResultPlaces = data;
                    }
                }
            });
        },
        clearList: function () {
            document.getElementById('mySelectedPlace').style.display = 'block';
        },

        clearPlaceItem: function (index) {
            this.mySelection.splice(index, 1);
        },
        swapPlaces: function () {

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value;

            document.getElementById('placesTo').value = placeFrom;
            document.getElementById('placesFrom').value = placeTo;
        },
        setPlace: function (place, index) {
            this.searchResultPlaces.splice(index, 1);
            this.searchResultPlaces = [];
            document.getElementById('mySelectedPlace').innerText = place.nameCity;
            document.getElementById('mySelectedPlace').style.display = 'block';
        },
        selectDestType: (type) => {
            switch (type) {
                case 1:
                    document.getElementById('destinationType').value = 'round';
                    return;
                case 2:
                    document.getElementById('destinationType').value = 'oneway';
                    return;
                default:
                    document.getElementById('destinationType').value = 'round';
                    return;
            }
        },

        selectSeatType: (type) => {

                switch (type) {
                    case 1:
                        document.getElementById('seatType').value = 'Economy';
                        return;
                    case 2:
                        document.getElementById('seatType').value = 'Premium Economy';
                        return;
                    case 3:
                        document.getElementById('seatType').value = 'Business';
                        return;
                    case 4:
                        document.getElementById('seatType').value = 'First Class';
                        return;
                    default:
                        document.getElementById('seatType').value = 'Economy';
                        return;
                }
            },
        choosePlaces: function () {
            let place = document.getElementById('mySelectedPlace').innerText;

            switch (this.selectionOption) {
                case 1:
                    this.form.placeFrom = place;
                    $('#placesModal').modal('hide');
                    break;
                case 2:
                    this.form.placesTo = place;
                    $('#placesModal').modal('hide');
                    break;
            }

        },
        increment: function (index) {


            this.valPassengers = this.form.valAdults + this.form.valChildren + this.form.valInfants;


            if (this.valPassengers != 9) {

                switch (index) {
                    case 1:

                        if (this.form.valAdults != 9) {
                            this.form.valAdults++;
                            this.valPassengers++;
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                    case 2:

                        if (this.form.valChildren != 8) {
                            this.form.valChildren++;
                            this.valPassengers++;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                    case 3:

                        if (this.form.valInfants != this.form.valAdults) {
                            this.form.valInfants++;
                            this.valPassengers++;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                }
            }

        },
        decrement: function (index) {

            this.valPassengers = this.form.valAdults + this.form.valChildren + this.form.valInfants;

            if (this.valPassengers != 1) {

                switch (index) {
                    case 1:

                        if (this.form.valAdults != 1) {
                            this.form.valAdults--;
                            this.valPassengers--;
                            if (this.form.valInfants > this.form.valAdults) {
                                this.valPassengers--;
                                this.form.valInfants--;
                            }
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                    case 2:
                        if (this.form.valChildren != 0) {
                            this.form.valChildren--;
                            this.valPassengers--;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                    case 3:
                        if (this.form.valInfants != 0) {
                            this.form.valInfants--;
                            this.valPassengers--;
                        } else {
                            document.getElementById('valInfantsIncrement').disable = true;
                        }
                        this.sumTotalsPassengers();
                        return;
                }
            }

        },
        sumTotalsPassengers: function () {
            if (this.valPassengers == 1) {
                this.form.noOfPassengers = 'Passengers';
            } else {
                this.form.noOfPassengers = this.valPassengers + ' Passengers'
            }
        },
        openPlaceModal: function (option) {

            this.selectionOption = option;

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value;

            switch (this.selectionOption) {
                case 1:
                    document.getElementById('placesModalTitle').innerText = "From";
                    if (placeFrom == null || placeFrom == '') {
                        document.getElementById('mySelectedPlace').style.display = 'none';
                    } else {
                        document.getElementById('mySelectedPlace').style.display = 'block'
                        document.getElementById('mySelectedPlace').innerText = placeFrom;
                    }

                    $('#placesModal').modal('show');
                    return;
                case 2:
                    document.getElementById('placesModalTitle').innerText = "To";
                    if (placeTo == null || placeTo == '') {
                        document.getElementById('mySelectedPlace').style.display = 'none';
                    } else {
                        document.getElementById('mySelectedPlace').style.display = 'block'
                        document.getElementById('mySelectedPlace').innerText = placeTo;
                    }
                    $('#placesModal').modal('show');
                    return;
            }

        }
    }
});
// let search = document.getElementById("searchForm");
//
// search.addEventListener('submit', function (e) {
//     e.preventDefault();
//
//     console.log(app.form);
// });