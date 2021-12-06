$(document).keyup(function(e) {
    27 == e.keyCode && $('.close-modal').modal("hide");
});
    
$( document ).ready(function() {
$(".legal").click(function(e) {
    var page = $(this).attr('href') + " " + "#legal-terms";
    $(".modal-legal").load(page);
    $("#pop-legal").modal("show")
    e.preventDefault();
    return false;
});
});

function scroll_to(e,o){var t=e.attr("href").replace("#","."),n=0;".top-content"!=t&&(t+="-container",n=$(t).offset().top-o),$(window).scrollTop()!=n&&$("html, body").stop().animate({scrollTop:n},1e3)}$("a.scroll-link").on("click",function(e){e.preventDefault(),scroll_to($(this),$("nav").outerHeight())}),$("#container ul li a img").each(function(){var e=$(this).attr("alt");""!=e&&$("<h3>"+e+"</h3>").insertAfter(this)});

        $( document ).ready(function() {
        $('.open-modal').click(function(){
            $('#'+ $(this).data("target-modal")).modal("show");
        });
        });

/*document.styleSheets[2].addRule("::-webkit-scrollbar-thumb", "background: "+document.getElementsByTagName('meta')['theme-color'].content+';');*/

$(document).ready(function(){

$('.bg-bottom-menu').css({background:document.getElementsByTagName('meta')['theme-color'].content})

$('#menu-toggle').css({color:document.getElementsByTagName('meta')['theme-color'].content})

$('#sidebar-wrapper').css({background:document.getElementsByTagName('meta')['theme-color'].content})

});

// Closes the sidebar menu
    var sidebar = $("#sidebar-wrapper");
    var closer =  $("#menu-close");

    $("#menu-close").click(function(e)  {
        e.preventDefault();
        sidebar.removeClass("active");
    });
    $(".sidebar-nav li a.scroll-link").click(function(e)  {
        e.preventDefault();
        console.log(e);
        sidebar.removeClass("active");
    });
    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
