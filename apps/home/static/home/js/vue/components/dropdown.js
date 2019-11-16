$(document).ready(function () {

    $('.search-form-input').on('click', function() {
        $(this).closest('.search-dropdown').find('input.form-control').trigger('focus');
    });

});
