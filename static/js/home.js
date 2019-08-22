const app = new Vue({

    el: '#app',
    delimiters: ['{(', ')}'],
    data: {
        mySelectionFrom: [],
        mySelectionTo: [{nameCity: 'Nairobi'}],
        mySelection: [],
        seatType: 'Economy',
        noOfPassengers: 'Passengers',
        city: ''
    },
    methods: {
        cityHandler: function () {
            $.ajax({
                url: 'http://aviation-edge.com/v2/public/autocomplete?key=140940-4e6372&city=' + app.city,
                success: function (data) {
                    if (data) {
                        data = JSON.parse(data).cities;
                        app.mySelectionTo = data;
                        console.log(app.mySelectionTo);
                    }
                }
            });
        },
        clearList: function () {
            this.mySelection = [];
        },

        clearPlaceItem: function (index) {
            this.mySelection.splice(index, 1);
        },

        swapPlaces: () => {

            let placeFrom = document.getElementById('placesFrom').value;
            let placeTo = document.getElementById('placesTo').value;

            document.getElementById('placesTo').value = placeFrom;
            document.getElementById('placesFrom').value = placeTo;
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

            switch (this.selectionOption) {
                case 1:
                    $('#placesModal').modal('hide');
                    return;
                case 2:
                    $('#placesModal').modal('hide');
                    return;
            }

        },
        openPlaceModal: function (option) {

            this.selectionOption = option;
            this.mySelection = [];

            switch (this.selectionOption) {
                case 1:
                    this.mySelection = this.mySelectionFrom;
                    $('#placesModal').modal('show');
                    return;
                case 2:
                    this.mySelection = this.mySelectionTo;
                    $('#placesModal').modal('show');
                    return;
            }

        }
    }
});
