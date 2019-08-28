const app = new Vue({

    el: '#app',
    delimiters: ['{(', ')}'],
    data: {
        searchResultPlaces: [],
        seatType: 'Economy',
        noOfPassengers: 'Passengers',
        city: '',
        valPassengers: 1,
        form: {
            destinationType: "Return",
            noOfPassengers: "Passengers",
            destinationTypeId: 'round',
            seatType: 'Economy',
            valAdults: 1,
            valChildren: 0,
            valInfants: 0
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

        search: () => {
            let formData = new FormData;
            app.form.departure_date = document.getElementById('departure_date').value;
            app.form.return_date = document.getElementById('return_date').value;

            formData.append("city_from", app.form.placeFrom);
            formData.append("city_to", app.form.placesTo);
            formData.append("dep_date", app.form.departure_date);
            formData.append("ret_date", app.form.return_date);
            formData.append("type", app.form.destinationTypeId);
            formData.append("adults", app.form.valAdults);
            formData.append("infants", app.form.valInfants);
            formData.append("children", app.form.valChildren);

            let object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });
            let json = object;
            console.log(json);

            // The rest of this code assumes you are not using a library.
            // It can be made less wordy if you use one.
            const form = document.createElement('form');
            form.method = "post";
            form.action = "/results";

            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    const hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.name = key;
                    hiddenField.value = json[key];

                    form.appendChild(hiddenField);
                }
            }

            document.body.appendChild(form);
            form.submit();


            console.log(formData);

        },

        swapPlaces: () => {

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value;

            let placeFromId = document.getElementById('placesFrom').placeholder;
            let placeToId = document.getElementById('placesTo').placeholder;

            document.getElementById('placesTo').value = placeFrom;
            document.getElementById('placesFrom').value = placeTo;
            document.getElementById('placesTo').placeholder = placeFromId;
            document.getElementById('placesFrom').placeholder = placeToId;
        },

        setPlace: function (placeName, codeIataCity, index) {
            this.searchResultPlaces.splice(index, 1);
            this.searchResultPlaces = [];
            document.getElementById('mySelectedPlace').innerText = placeName;
            document.getElementById('mySelectedPlace').placeholder = codeIataCity;
            document.getElementById('mySelectedPlace').style.display = 'block';
        },

        selectDestType: (type) => {
            switch (type) {
                case 1:
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'Return';
                    return;
                case 2:
                    app.form.destinationTypeId = 'oneway';
                    app.form.destinationType = 'One way';
                    return;
                default:
                    app.form.destinationTypeId = 'round';
                    app.form.destinationType = 'round';
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
            let placeId = document.getElementById('mySelectedPlace').placeholder;

            switch (app.selectionOption) {
                case 1:
                    document.getElementById('placesFrom').value = place;
                    app.form.placeFrom = placeId;
                    $('#placesModal').modal('hide');
                    return;
                case 2:
                    document.getElementById('placesTo').value = place;
                    app.form.placesTo = placeId;
                    $('#placesModal').modal('hide');
                    return;
            }

        },
        increment: function (index) {


            app.valPassengers = app.form.valAdults + app.form.valChildren + app.form.valInfants;


            if (app.valPassengers != 9) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults != 9) {
                            app.form.valAdults++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valAdultsIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 2:

                        if (app.form.valChildren != 8) {
                            app.form.valChildren++;
                            app.valPassengers++;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:

                        if (app.form.valInfants != app.form.valAdults) {
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

            if (app.valPassengers != 1) {

                switch (index) {
                    case 1:

                        if (app.form.valAdults != 1) {
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
                        if (app.form.valChildren != 0) {
                            app.form.valChildren--;
                            app.valPassengers--;
                        } else {
                            document.getElementById('valChildrenIncrement').disable = true;
                        }
                        app.sumTotalsPassengers();
                        return;
                    case 3:
                        if (app.form.valInfants != 0) {
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
            if (app.valPassengers == 1) {
                app.form.noOfPassengers = 'Passengers';
            } else {
                app.form.noOfPassengers = app.valPassengers + ' Passengers'
            }
        },

        openPlaceModal: function (option) {

            app.selectionOption = option;

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value

            switch (app.selectionOption) {
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
