$(function() {

    function getBookingToken() {
        let url = new URL(window.location);
        return url.pathname.split('/').slice(-1)[0];
    }

    window.getCookie = function(name) {
      var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
    };

    function getCheckoutFormData() {
        const form = document.getElementById('checkout');
        return Object.fromEntries(new FormData(form));
    }

    var yearSelect = document.querySelector('#yearofbirth');

    var date = new Date();
    var year = date.getFullYear();
  
    // Make this year, and the 100 years before it available in the year <select>
    for(var i = 0; i <= 100; i++) {
        var option = document.createElement('option');
        option.textContent = year-i;
        yearSelect.appendChild(option);
    }
    
    $('#checkout').submit(function(event) {

        /* stop form from submitting normally */
        event.preventDefault();

        let passengers = [];

        
        $(".passengerForm").each(function(i, form) {
            let data = Object.fromEntries(new FormData(form));
            passengers.push({
                name: data.givennames,
                surname: data.surenames,
                nationality: data.nationality,
                birthday: data.yearofbirth.toString() + '-' + data.monthofbirth.toString() + '-' + data.dayofbirth.toString(),
                title: data.gender,
                cardno: data.cardno,
                expiration: data.expiration,
                bags: parseInt(data.cabin_bags) + parseInt(data.checked_bags),
            }); 
        });

        const data = {
            "booking_token": getBookingToken(),
            "passengers": passengers,
            "payment": getCheckoutFormData(),
        };

        $.ajax({
            type: 'POST',
            url: '/booking_flight/',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            },
            success: function() {
                $("#booking-success-modal").modal('show');
            },
            error: function() {
                $("#booking-failure-modal").modal('show');
            }
        });
    });

    function checkPromo() {
        $.ajax({
            type: "GET",
            url: '/check-promo/',
            data: {
                "promocode": getCheckoutFormData().promocode
            },
            dataType: 'json',
            success: function (data) {
                const newPrice = parseInt(document.getElementById("totals-total-price").innerText) - data.discount;
                document.getElementById('button-purchase-price').innerText = newPrice.toFixed(2);
            }
        })
    }

    $("#promocode").change(checkPromo);

    function checkFlight() {
        $.ajax({
            type: "GET",
            url: "/check-flights/",
            data: {
                "booking_token": getBookingToken(),
                "bnum": 0,
                "adults": 1,
                "infants": 0,
                "children": 0,
            },
            dataType: 'json',
            error: function(jqxhr) {
                if (jqxhr.status === 404) {
                    let data = JSON.parse(jqxhr.responseText);
                    if (data.code === 'not-checked-yet') {
                        setTimeout(checkFlight, 2000)
                    }
                }
            }
        });
    }
    checkFlight();
});

