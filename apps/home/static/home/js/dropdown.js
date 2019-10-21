$(document).ready(function () {

    $('.search-form-input').on('click', function() {
        $(this).closest('.search-dropdown').find('input.form-control').trigger('focus');
    });

	window.setInterval(function() {
	  var elem = document.getElementById('listdata');
	  elem.scrollTop = elem.scrollHeight;
	}, 3000);

});
