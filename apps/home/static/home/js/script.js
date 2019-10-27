$(document).ready(function() {

    $(".mobile-icon").off("click").on("click", function(e) {
        if ($(".mobile-menu #links").is(":visible")) {
            $(".mobile-menu #links").hide();
        } else {
            $(".mobile-menu #links").show();
        }
        
    });

    var sticky = 10;

    $(window).scroll(function() {
        if ($(window).scrollTop() > sticky) {
            $("header").addClass("sticky");
          } else {
            $("header").removeClass("sticky");
          }
    });

    var sticky = 20;

    $(window).scroll(function() {
        if ($(window).scrollTop() > sticky) {
            $("body").addClass("dotvisible");
          } else {
            $("body").removeClass("dotvisible");
          }
    });

});
