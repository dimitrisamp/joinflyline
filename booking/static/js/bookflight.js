$(function() {

    var yearSelect = document.querySelector('#yearofbirth');

    var date = new Date();
    var year = date.getFullYear();
  
    // Make this year, and the 100 years before it available in the year <select>
    for(var i = 0; i <= 100; i++) {
        var option = document.createElement('option');
        option.textContent = year-i;
        yearSelect.appendChild(option);
    }
    
    $('.booking_flight').submit(function(event) {

        /* stop form from submitting normally */
        event.preventDefault();

        let passengers = [];
        let checkout = {};

        
        $(".passengerForm").each(function(i, form) {
            let data = Object.fromEntries(new FormData(form));
            passengers.push({
                name: data.givennames,
                surname: data.surenames,
                nationality: data.nationality,
                birthday: data.yearofbirth.toString() + '-' + data.monthofbirth.toString() + '-' + data.dayofbirth.toString(),
                gender: data.gender,
                bags:0,
                sendBags: parseInt(data.cabin_bags) + parseInt(data.checked_bags),
            }); 
        });

        $(".booking_flight").each(function(i, form) {
            let data = Object.fromEntries(new FormData(form));
            checkout = {
                holder_name: data.holder_name,
                expiration_date: data.expdate,
                card_number: data.creditcardno,
                credit_card_cvv: data.ccv
            };             
        })

        const data = {
            "passengers": passengers,
            "checkout": checkout
        }

        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/booking_flight',
            data: JSON.stringify(data),
            dataType: 'json'
        });
    });
});

