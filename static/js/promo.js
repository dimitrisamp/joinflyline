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
