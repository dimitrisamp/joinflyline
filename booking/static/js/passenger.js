$(function() {
    const $passengersBlock = $("#passengers");
    const $primaryPassengerBlock = $("#primary-passenger-block");

    $('#js-add-passenger').on("click", function() {
        let $block_copy = $primaryPassengerBlock.clone().removeAttr("id");
        $block_copy.attr('value', '');
        $(".passenger-kind", $block_copy).text("Secondary passenger");
        $block_copy.appendTo($passengersBlock);
    })

    $('#js-delete-passenger').on("click", function() {
        if($('.whiteBg').length > 1) {
            $('.whiteBg').last().remove();
        }
    })
});


