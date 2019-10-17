$(function(){
    if (DjangoUser.authenticated) {
        new Lightpick({
            field: document.getElementById('dob'),
        });

        new Lightpick({
            field: document.getElementById('expiry')
        });
    }

    $(".offer-card").on('click', function(){
        let $this = $(this);
        $this.siblings().removeClass('active');
        $this.addClass('active');
        $('input', $this).attr('checked', 'checked');
        $('input', $this.siblings()).removeAttr('checked');
        $('#summary-plan-name').text($this.data('name'));
        $('#summary-total-billing-price').text($this.data('price'));
        $('#summary-billing-price').text($this.data('price'));
        $('#summary-plan-credits').text($this.data('credits'));
    });
});
