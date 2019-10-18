if ($('.promo_banner').hasClass('banner-sticky')) {
    $('body').css('paddingTop', '59px');
} else {
    $('body').css('paddingTop', '0');
}

$(function(){
    setTimeout(function(){
        $('.loadingLine').remove();
    }, 6000);
});



$('.panel-collapse').on('show.bs.collapse', function () {
    $(this).siblings('.panel-heading').addClass('active');
});

$('.panel-collapse').on('hide.bs.collapse', function () {
$(this).siblings('.panel-heading').removeClass('active');
});