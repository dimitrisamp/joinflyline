$(function() {
    const $passengersBlock = $("#passengers");
    const $primaryPassengerBlock = $("#primary-passenger-block");

    function serializePassenger(pb) {

    }

    function serializePassengers() {
        $(".passenger-block").each(serializePassenger);
    }

    $('#js-add-passenger').on("click", function() {
        let $block_copy = $primaryPassengerBlock.clone().removeAttr("id");
        $(".passenger-kind", $block_copy).text("Secondary passenger");
        $block_copy.appendTo($passengersBlock);
    })
});


