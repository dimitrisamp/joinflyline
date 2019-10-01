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
    
    $('#booking_flight').submit(function(event) {

        /* stop form from submitting normally */
        event.preventDefault();

        let passengers = [];
        let checkout = [];

        if($('#booking_flight').valid() && $('#passengerForm').valid()) {
            $('#passengers').children('div.whiteBg').each(function() {
                passengers.push({
                    'givennames': $($(this).find('input#givennames')[0]).val(),
                    'surenames': $($(this).find('input#surenames')[0]).val(),
                    'nationality': $($(this).find('select#nationality')[0]).val(),
                    'birthday': $($(this).find('select#monthofbirth')[0]).val()
                                    + '/' + $($(this).find('select#dayofbirth')[0]).val()
                                    + '/' + $($(this).find('select#yearofbirth')[0]).val(),
                });
            });
        }

        checkout.push({
            "cardname": $($(this).find('input#nameoncard')[0]).val(),
            "cardnum": $($(this).find('input#creditcardno')[0]).val(),
            "expdate": $($(this).find('input#expdate')[0]).val(),
            "ccv": $($(this).find('input#ccv')[0]).val(),
        });

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

