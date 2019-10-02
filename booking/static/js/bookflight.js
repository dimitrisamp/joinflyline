$(function() {

    function getBookingToken() {
        let url = new URL(window.location);
        return url.pathname.split('/').slice(-1)[0];
    }

    window.getCookie = function(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
    };

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
        let payment = {};

        
        $(".passengerForm").each(function(i, form) {
            let data = Object.fromEntries(new FormData(form));
            passengers.push({
                name: data.givennames,
                surname: data.surenames,
                nationality: data.nationality,
                birthday: data.yearofbirth.toString() + '-' + data.monthofbirth.toString() + '-' + data.dayofbirth.toString(),
                title: data.gender,
                bags: parseInt(data.cabin_bags) + parseInt(data.checked_bags),
            }); 
        });

        $(".booking_flight").each(function(i, form) {
            let data = Object.fromEntries(new FormData(form));
            payment = {
                holder_name: data.holder_name,
                expiration_date: data.expdate,
                card_number: data.creditcardno,
                credit_card_cvv: data.ccv
            };             
        });

        const data = {
            "booking_token": getBookingToken(),
            "passengers": passengers,
            "payment": payment
        };

        console.log(data);
        $.ajax({
            type: 'POST',
            url: '/booking_flight/',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            },
        });
    });
});

