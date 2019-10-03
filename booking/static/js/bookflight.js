$(function () {
    const $passengersBlock = $("#passengers");
    const $primaryPassengerBlock = $("#primary-passenger-block");
    const $promocode = $("#promocode")

    $('#js-add-passenger').on("click", function () {
        let $block_copy = $primaryPassengerBlock.clone().removeAttr("id");
        $block_copy.attr('value', '');
        $(".passenger-kind", $block_copy).text("Secondary passenger");
        $block_copy.appendTo($passengersBlock);
        bindActions($block_copy);
        checkFlight();
    });

    $('#js-delete-passenger').on("click", function () {
        if ($('.whiteBg').length > 1) {
            $('.whiteBg').last().remove();
            checkFlight();
        }
    });

    function humanizePrice(price) {
        if (price === 0) return "Free";
        if (Number.isInteger(price)) return price.toFixed(0);
        return price.toFixed(2);
    }

    function getBookingToken() {
        let url = new URL(window.location);
        return url.pathname.split('/').slice(-1)[0];
    }

    window.getCookie = function (name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    };

    function getCheckoutFormData() {
        const form = document.getElementById('checkout');
        return Object.fromEntries(new FormData(form));
    }

    function fillTotals(data) {
        for (const [key, value] of Object.entries(data)) {
            document.getElementById('totals-' + key + '-price').innerText = humanizePrice(value);
        }
        document.getElementById('totals-passengers-count').innerText = getPassengersData().length;
    }

    function calculateAge(birthday) {
        let born = new Date(birthday);
        let today = new Date();
        let year_diff = today.getFullYear() - born.getFullYear();
        if ([today.getMonth(), today.getDay()] < [born.getMonth(), born.getDay()]) {
            year_diff--;
        }
        return year_diff
    }

    function getPassengersData() {
        let passengers = [];
        $(".passengerForm").each(function (i, form) {
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
        return passengers;
    }

    function getCategory(age) {
        if (age < 3) return 'infants';
        if (age < 14) return 'children';
        return 'adults';
    }

    function getPassengerSummary() {
        const passengerData = getPassengersData();
        let summary = {
            adults: 0,
            children: 0,
            infants: 0,
            bnum: 0
        };
        for (p of passengerData) {
            let category = getCategory(calculateAge(p.birthday));
            summary[category]++;
            summary.bnum += p.bags;
        }
        return summary;
    }

    var yearSelect = document.querySelector('#yearofbirth');

    var date = new Date();
    var year = date.getFullYear();

    // Make this year, and the 100 years before it available in the year <select>
    for (var i = 0; i <= 100; i++) {
        var option = document.createElement('option');
        option.textContent = year - i;
        if (i === 20) option.selected = true;
        yearSelect.appendChild(option);
    }

    $('#checkout').submit(function (event) {

        /* stop form from submitting normally */
        event.preventDefault();

        const passengers = getPassengersData();

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
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
            },
            success: function () {
                $("#booking-success-modal").modal('show');
            },
            error: function () {
                $("#booking-failure-modal").modal('show');
            }
        });
    });

    function updatePromo(data) {
        const discount = $promocode.data("discount") || 0;
        const newPrice = parseFloat(document.getElementById("totals-total-price").innerText) - discount;
        document.getElementById('button-purchase-price').innerText = humanizePrice(newPrice);
    }

    function checkPromo() {
        $.ajax({
            type: "GET",
            url: '/check-promo/',
            data: {
                "promocode": getCheckoutFormData().promocode
            },
            dataType: 'json',
            success: function(data) {
                $promocode.data("discount", data.discount);
                updatePromo();
            }
        })
    }

    $promocode.change(checkPromo);

    function bindActions(form) {
        $(".js-affecting-price", form).on("change", checkFlight);
    }

    bindActions($('#primary-passenger-block'));

    function checkFlight() {
        const passengers_bags_count = getPassengerSummary();
        const queryData = {
            "booking_token": getBookingToken(),
            ...passengers_bags_count
        };
        $.ajax({
            type: "GET",
            url: "/check-flights/",
            data: queryData,
            dataType: 'json',
            error: function (jqxhr) {
                if (jqxhr.status === 404) {
                    let data = JSON.parse(jqxhr.responseText);
                    if (data.code === 'not-checked-yet') {
                        setTimeout(checkFlight, 2000)
                    }
                }
            },
            success: function (data) {
                fillTotals(data);
                updatePromo();
            }
        });
    }

    checkFlight();
});

