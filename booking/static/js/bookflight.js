$(function() {
    $('#booking_flight').submit(function(event) {

        /* stop form from submitting normally */
        event.preventDefault();
        $(this).valid();
        let passengers = [];
        $('#passengers').children('div.whiteBg').each(function() {
            passengers.push({
                'givennames': $($(this).find('input#givennames')[0]).val(),
                'surenames': $($(this).find('input#surenames')[0]).val(),
                'nationality': $($(this).find('select#nationality')[0]).val(),
                'birthday': $($(this).find('select#monthofbirth')[0]).val()
                                + '/' + $($(this).find('select#dayofbirth')[0]).val()
                                + '/' + $($(this).find('input#yearofbirth')[0]).val(),
            });
        });
        console.log(passengers);
        
        // const whiteBgs = document.querySelectorAll(".whiteBg");
        // 
        // Object.entries(whiteBgs).map((p) => {
        //     console.log(p);
        //     passengers.push({
        //         "givennames" : p.givennames,
        //         "suernames": p.suernames
        //     })
        // });
    });
});

