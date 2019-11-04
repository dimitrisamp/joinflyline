$(document).ready(function() {

    $(".mobile-icon").off("click").on("click", function(e) {
        if ($(".mobile-menu #links").is(":visible")) {
            $(".mobile-menu #links").hide();
        } else {
            $(".mobile-menu #links").show();
        }
        
    });

});
