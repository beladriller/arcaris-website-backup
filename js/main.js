// PRELOAD
$(window).load(preLoader);
function preLoader(e) {
	e.preventDefault();
    $('html, body').animate({
        scrollTop:$('#top').offset().top-18
    },'slow');
    if(window.location.hash) {
		$('html, body').animate({
	        scrollTop:$('#karriere').offset().top-18
	    },'slow');
    }
	setTimeout(function() {
		$("#preloader").delay(250).fadeOut({
			duration: 750
		});
	}, 250);
}

$(document).ready(function () { // Document ready

	// Header transitions from transparent over hero to white when scrolled past hero
	var scrollThreshold = 80;
	function updateScrollState() {
		if ($(window).scrollTop() > scrollThreshold) {
			$('body').addClass('is-scrolled');
		} else {
			$('body').removeClass('is-scrolled');
		}
	}
	$(window).on('scroll', updateScrollState);
	updateScrollState();

	$(".navToggle").on("click", function(){
		$(this).toggleClass("open");
		$("#menu_responsive").toggleClass("active_mobile");	

		setTimeout( function() {
			$('#menu_responsive span a').each(function(i){
				var t = $(this);
				setTimeout(function(){ t.toggleClass('active_mobile'); }, (i+1) * 100)
			});
		}, 200);
						
		$(".bgblack").toggleClass("active_mobile");
	});
	
	$('.bgblack, #menu_responsive.active_mobile span a').on('click', function() {	
		setTimeout( function() {
			$('#menu_responsive span a').each(function(i){
				var t = $(this);
				setTimeout(function(){ t.toggleClass('active_mobile'); }, (i+1) * 100);
			});
		}, 200);

		setTimeout( "$('#menu_responsive, .bgblack').toggleClass('active_mobile');",100 );
		$(".navToggle").toggleClass("open");
		
	});
	
});

$(window).load(resizeFunc);
$(window).resize(resizeFunc);
$(window).scroll(resizeFunc);
function resizeFunc() {
	
	var winHeight = $(window).height();	
	var wrapperWidth = $('#wrapper').width();	
	
	$( '#start' ).css( "height", winHeight);
	$( '#swiper-container, .top-swiper-wrapper, .swiper-slide' ).css( "height", winHeight);	
// 	$( '.start__content h1' ).css( "margin-top", (winHeight/2)-50);	

	$( '.start__content' ).css( "width", wrapperWidth);	
	
	var jobHeightLeft = $('p.job_link a.first:eq( 0 )').height();
	var jobHeightRight = $('p.job_link a.first:eq( 1 )').height();
	var jobHeightDifferenz = jobHeightLeft-jobHeightRight;
	//alert(jobHeightDifferenz);
	$( 'p.job_link a.first:eq( 1 )' ).css( "min-height", jobHeightLeft+40);	
	$( 'p.job_link a.first:eq( 1 )' ).css( "height", "auto");

	var toggle_containerHeight = $('.ueber_uns__content .col_right .toggle_container').height();
	$( '.ueber_uns__content .col_left .toggle_container' ).css( "min-height", toggle_containerHeight);	
	$( '.ueber_uns__content .col_mid .toggle_container' ).css( "min-height", toggle_containerHeight);	
	$( '.ueber_uns__content .col_left .toggle_container' ).css( "height", "auto");	
	$( '.ueber_uns__content .col_mid .toggle_container' ).css( "height", "auto");
	
}


$(function() {

var winHeight = $(window).height();	
$( '#swiper-container, .top-swiper-wrapper, .swiper-slide' ).css( "height", winHeight);	

	//////////// Swiper on Home-Screen ////////////////
	var animationDuration = 1;
	var mySwiper = new Swiper('.top-swiper-container', {
	    pagination: '.pagination',
	    prev: 'swiper-prev',
	    next: 'swiper-next',
	    autoplay: 5555,
	    paginationClickable: true,
	    loop: true,
	    speed: 1000,
	    peek: false,
	    keyboardControl: true,
	    peekWidth: 0.05,
	    slidesPerView: 1,
	    initialSlide: 0,
	    onFirstInit : function() {		    
			$('.top-swiper-wrapper').css('visibility', 'visible');
			$('.first-slide').css('visibility', 'visible');
			$('.first-slide').css('-moz-animation-duration', animationDuration+'s');
			$('.first-slide').css('-webkit-animation-duration', animationDuration+'s');
			$('.first-slide').css('-ms-animation-duration', animationDuration+'s');
			$('.first-slide').css('-o-animation-duration', animationDuration+'s');
			$('.first-slide').css('animation-duration', animationDuration+'s');
			$('.first-slide').addClass('slideInUp');
			setTimeout(function(){
				$(".first-slide").addClass("slideInUp");
			}, 1500);
	    }, 	    
	    onSlideChangeEnd : function() {		    
		    var swiperPage = $('.'+mySwiper.activeSlide().data("slide"));
			$('.slide-content', swiperPage).css('visibility', 'visible');
			$('.slide-content', swiperPage).css('-moz-animation-duration', animationDuration+'s');
			$('.slide-content', swiperPage).css('-webkit-animation-duration', animationDuration+'s');
			$('.slide-content', swiperPage).css('-ms-animation-duration', animationDuration+'s');
			$('.slide-content', swiperPage).css('-o-animation-duration', animationDuration+'s');
			$('.slide-content', swiperPage).css('animation-duration', animationDuration+'s');
			$('.slide-content', swiperPage).addClass('slideInUp');
			
		
			if ($('div.swiper-slide.slide1.swiper-slide-visible').hasClass('swiper-slide-active')) {
				$( '.start__content h1, .start__content .text' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text a' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text' ).css( "border-color", "#fff" );
			}
			if ($('div.swiper-slide.slide2.swiper-slide-visible').hasClass('swiper-slide-active')) {
				$( '.start__content h1, .start__content .text' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text a' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text' ).css( "border-color", "#fff" );
			}
			if ($('div.swiper-slide.slide3.swiper-slide-visible').hasClass('swiper-slide-active')) {
				$( '.start__content h1, .start__content .text' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text a' ).css( "color", "#fff" );
				$( '.start__content h1, .start__content .text' ).css( "border-color", "#fff" );
			}
			if ($('div.swiper-slide.slide4.swiper-slide-visible').hasClass('swiper-slide-active')) {
				$( '.start__content h1, .start__content .text' ).css( "color", "#000" );
				$( '.start__content h1, .start__content .text a' ).css( "color", "#000" );
				$( '.start__content h1, .start__content .text' ).css( "border-color", "#000" );
			}

		
	    }
	 })
	
});	

// SCROLL TO ID

$('a[href^="#"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top-18
        }, 'slow');
    }
    
});

/*
$('a[href^=#]').on('click', function(e){
    var href = $(this).attr('href');
    
//     $('html, body').animate({
	$("html:not(:animated),body:not(:animated)").animate({
        scrollTop:$(href).offset().top-18
    },'slow');

    e.preventDefault();
    
});
*/




$(function(){

/*
	var t=$(window);$('section[data-type="background"]').each(function(){
		var e=$(this);$(window).scroll(function(){var n=-(t.scrollTop()/e.data("speed")),r="50% "+n+"px";e.css({backgroundPosition:r})})
	});
	
	Modernizr.svg||$('img[src*="svg"]').attr("src",function(){
		return $(this).attr("src").replace(".svg",".png")
	});
*/
		
	$(".col_left .mehr_dazu_link").click(function(){
		$(this).next(".mehr_dazu_inhalt").slideToggle();
		$(this).toggleClass('activeToggle');
		$('.col_left .link_line_top').toggleClass('open');
		
		if($('.col_left .link_line_top').hasClass("open")){
			$('.col_left .link_line_top').text('weniger');
		}
		else {
			$('.col_left .link_line_top').text('mehr');
		}
		
		
		//$("html, body").animate({scrollTop:$(this).offset().top-150},1e3);return!1
	});
	$(".col_mid .mehr_dazu_link").click(function(){
		$(this).next(".mehr_dazu_inhalt").slideToggle();
		$(this).toggleClass('activeToggle');
		$('.col_mid .link_line_top').toggleClass('open');
		
		if($('.col_mid .link_line_top').hasClass("open")){
			$('.col_mid .link_line_top').text('weniger');
		}
		else {
			$('.col_mid .link_line_top').text('mehr');
		}
		
		
		//$("html, body").animate({scrollTop:$(this).offset().top-150},1e3);return!1
	});
	$(".col_right .mehr_dazu_link").click(function(){
		$(this).next(".mehr_dazu_inhalt").slideToggle();
		$(this).toggleClass('activeToggle');
		$('.col_right .link_line_top').toggleClass('open');
		
		if($('.col_right .link_line_top').hasClass("open")){
			$('.col_right .link_line_top').text('weniger');
		}
		else {
			$('.col_right .link_line_top').text('mehr');
		}
		
		
		//$("html, body").animate({scrollTop:$(this).offset().top-150},1e3);return!1
	});
	$(".col_left .link_line_top").click(function(){
		$(".col_left div.toggle_container > p.mehr_dazu_inhalt").slideToggle();
		$('.col_left .link_line_top').toggleClass('open');
		
		if($('.col_left .link_line_top').hasClass("open")){
			$('.col_left .link_line_top').text('weniger');
		}
		else {
			$('.col_left .link_line_top').text('mehr');
		}
		return!1
	});
	$(".col_mid .link_line_top").click(function(){
		$(".col_mid div.toggle_container > p.mehr_dazu_inhalt").slideToggle();
		$('.col_mid .link_line_top').toggleClass('open');
		
		if($('.col_mid .link_line_top').hasClass("open")){
			$('.col_mid .link_line_top').text('weniger');
		}
		else {
			$('.col_mid .link_line_top').text('mehr');
		}
		return!1
	});
	$(".col_right .link_line_top").click(function(){
		$(".col_right div.toggle_container > p.mehr_dazu_inhalt").slideToggle();
		$('.col_right .link_line_top').toggleClass('open');
		
		if($('.col_right .link_line_top').hasClass("open")){
			$('.col_right .link_line_top').text('weniger');
		}
		else {
			$('.col_right .link_line_top').text('mehr');
		}
		return!1
	});
	$(".col_left .mehr_dazu_inhalt").click(function(){
		$(this).slideUp();
		$(this).prev( ".mehr_dazu_link" ).toggleClass('activeToggle');
		$('.col_left .link_line_top').toggleClass('open');
		if($('.col_left .link_line_top').hasClass("open")){
			$('.col_left .link_line_top').text('weniger');
		}
		else {
			$('.col_left .link_line_top').text('mehr');
		}
	return!1})
	$(".col_mid .mehr_dazu_inhalt").click(function(){
		$(this).slideUp();
		$(this).prev( ".mehr_dazu_link" ).toggleClass('activeToggle');
		$('.col_mid .link_line_top').toggleClass('open');
		if($('.col_mid .link_line_top').hasClass("open")){
			$('.col_mid .link_line_top').text('weniger');
		}
		else {
			$('.col_mid .link_line_top').text('mehr');
		}
	return!1})
	$(".col_right .mehr_dazu_inhalt").click(function(){
		$(this).slideUp();
		$(this).prev( ".mehr_dazu_link" ).toggleClass('activeToggle');
		$('.col_right .link_line_top').toggleClass('open');
		if($('.col_right .link_line_top').hasClass("open")){
			$('.col_right .link_line_top').text('weniger');
		}
		else {
			$('.col_right .link_line_top').text('mehr');
		}
	return!1})
	
	

		
});



$(window).scroll(function() {
    var height = $(window).scrollTop();
    var winHeight = $(window).height();
	
	$( '.main-nav__desktop a' ).css( "color", "#00458c" );
    if(height  > winHeight) {
		//$( '.main-nav' ).css( "top", "2.5px" );
		
		$( '.main-nav__desktop a' ).css( "color", "#000" );
		$( '#marker' ).css( "border-color", "#00458c" );
		
    }
	else {
        //$( '.main-nav' ).css( "top", "30px" );
        
        $( '.main-nav__desktop a' ).css( "color", "#00458c" );
        $( '#marker' ).css( "border-color", "#00458c" );
       
    }
    if(height  < winHeight) {
		$( '#marker' ).css( "border-color", "transparent" );
    }
    
});

$(window).load(responsiveEffect);
$(window).resize(responsiveEffect);
$(window).scroll(responsiveEffect);
function responsiveEffect() {
	
	var height = $(window).scrollTop();
    var winHeight = $(window).height();
	
    if(height  > winHeight-64) {
	    //$( '.logo' ).css( "top", "18px" );
	    //$( '.main-nav-bg' ).css( "background", "#fff" );
		$( '.main-nav-bg' ).addClass( "shadow" );
		$( '.bgblack .logo' ).css( "top", "18px" );
		$( '.bgblack' ).css( "top", "0px" );
		//$( '.navToggle' ).css( "top", "7px" );		
    }
	else {
		//$( '.logo' ).css( "top", "45px" );
		//$( '.main-nav-bg' ).css( "background", "rgba(255,255,255,1)" );
        $( '.main-nav-bg' ).removeClass( "shadow" );
        $( '.bgblack .logo' ).css( "top", "45px" );
        $( '.bgblack' ).css( "top", "0px" );
        //$( '.navToggle' ).css( "top", "37px" );
    }
    
    var winWidth = $(window).width();
    if(winWidth <= 880) {
		$( '.bgblack .logo' ).css( "top", "18px" );	
    }
	else {
        $( '.bgblack .logo' ).css( "top", "18px" );
    }
    
}

/* ==========================================================================
   UDERLINE HOVER AND CURRENT PAGE SECTION
   ========================================================================== */




// NAV
$(window).load(navFunc);
$(window).resize(navFunc);
$(window).scroll(navFunc);
function navFunc() /* { if($('#ueber_uns').length > 0)  */{
	
	
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	//if ((browserWidth) > '899') {
		var navOffset = 60;
		var minTop = $('#top').offset().top,
			maxTop = $('#top').height() + minTop;
		var currentScroll = $(window).scrollTop();
		var ueber_unsTop = Math.floor($('#ueber_uns').offset().top),
			investitionsansatzTop = Math.floor($('#investitionsansatz').offset().top),
			portfolioTop = Math.floor($('#portfolio').offset().top),
			teamTop = Math.floor($('#team').offset().top),
			karriereTop = Math.floor($('#karriere').offset().top),
			kontaktTop = Math.floor($('#kontakt').offset().top),
			impressumTop = Math.floor($('#impressum').offset().top),
			datenschutzTop = Math.floor($('#datenschutz').offset().top);
		console.log(ueber_unsTop + " " + investitionsansatzTop + " " + portfolioTop  + " " + teamTop  + " " + karriereTop + " " + kontaktTop + " " + impressumTop + " " + datenschutzTop);
		var winScroll = $(window).scrollTop();
		
		if ((winScroll + navOffset) < ueber_unsTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < investitionsansatzTop) {
			$('.ueber_uns').addClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		} 
		else if ((winScroll + navOffset) < portfolioTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').addClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < teamTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').addClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < karriereTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').addClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < kontaktTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').addClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < impressumTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').addClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		else if ((winScroll + navOffset) < datenschutzTop) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').addClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').removeClass('current');
		}
		
		else if ((winScroll + navOffset) < datenschutzTop && (winScroll <= maxTop)) {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').addClass('current');
		} else {
			$('.ueber_uns').removeClass('current');
			$('.investitionsansatz').removeClass('current');
			$('.portfolio').removeClass('current');
			$('.team').removeClass('current');
			$('.karriere').removeClass('current');
			$('.kontakt').removeClass('current');
			$('.impressum').removeClass('current');
			$('.datenschutz').addClass('current');
		}
		
}
// }

$(document).ready(function() {
    $("#ueber_uns .tabs-menu a").click(function(event) {
        $(this).parent().addClass("tab_current");
        $(this).parent().siblings().removeClass("tab_current");
        var tab = $(this).attr("data-class");
        $("#ueber_uns .tab-content").not(tab).css("display", "none");
        
        $('html, body').animate({
        	scrollTop:$('#ueber_uns').offset().top-18
    	},'slow');
        
        $(tab).show();
        
        event.preventDefault();
    });
});

$(document).ready(function() {
    $("#investitionsansatz .tabs-menu a").click(function(event) {
        $(this).parent().addClass("tab_current");
        $(this).parent().siblings().removeClass("tab_current");
        var tab = $(this).attr("data-class");
        $("#investitionsansatz .tab-content").not(tab).css("display", "none");
        
        $('html, body').animate({
        	scrollTop:$('#investitionsansatz').offset().top-18
    	},'slow');
        
        $(tab).show();
        
        event.preventDefault();
    });
});



// NAV
$(window).load(navResponsiveFunc);
$(window).resize(navResponsiveFunc);
$(window).scroll(navResponsiveFunc);
function navResponsiveFunc() /* { if($('#ueber_uns').length > 0)  */{
	
	
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	//if ((browserWidth) > '899') {
		var navOffset = 60;
		var minTop = $('#top').offset().top,
			maxTop = $('#top').height() + minTop;
		var currentScroll = $(window).scrollTop();
		var ueber_unsTop = Math.floor($('#ueber_uns').offset().top),
			investitionsansatzTop = Math.floor($('#investitionsansatz').offset().top),
			portfolioTop = Math.floor($('#portfolio').offset().top),
			teamTop = Math.floor($('#team').offset().top),
			karriereTop = Math.floor($('#karriere').offset().top),
			kontaktTop = Math.floor($('#kontakt').offset().top),
			impressumTop = Math.floor($('#impressum').offset().top),
			datenschutzTop = Math.floor($('#datenschutz').offset().top);
		console.log(ueber_unsTop + " " + investitionsansatzTop + " " + portfolioTop  + " " + teamTop  + " " + karriereTop + " " + kontaktTop + " " + impressumTop + " " + datenschutzTop);
		var winScroll = $(window).scrollTop();
		
		if ((winScroll + navOffset) < ueber_unsTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < investitionsansatzTop) {
			$('.ueber_uns_responsive').addClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		} 
		else if ((winScroll + navOffset) < portfolioTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').addClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < teamTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').addClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < karriereTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').addClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < kontaktTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').addClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < impressumTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').addClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < datenschutzTop) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').addClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').removeClass('current_responsive');
		}
		else if ((winScroll + navOffset) < datenschutzTop && (winScroll <= maxTop)) {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').addClass('current_responsive');
		} else {
			$('.ueber_uns_responsive').removeClass('current_responsive');
			$('.investitionsansatz_responsive').removeClass('current_responsive');
			$('.portfolio_responsive').removeClass('current_responsive');
			$('.team_responsive').removeClass('current_responsive');
			$('.karriere_responsive').removeClass('current_responsive');
			$('.kontakt_responsive').removeClass('current_responsive');
			$('.impressum_responsive').removeClass('current_responsive');
			$('.datenschutz_responsive').addClass('current_responsive');
		}
}

$("#ueber_uns_trenner").backstretch("/img/slides/slider_4.jpg");
$("#investitionsansatz_trenner").backstretch("/img/trenner2.jpg");
$("#portfolio_trenner").backstretch("/img/trenner3.jpg");
$("#team_trenner").backstretch("/img/trenner4.jpg");
$("#karriere_trenner").backstretch("/img/slides/slider_4.jpg");
$("#kontakt_trenner").backstretch("/img/trenner2.jpg");