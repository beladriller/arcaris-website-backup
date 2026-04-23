// PRELOAD
$(window).load(preLoader);
function preLoader(e) {
	e.preventDefault();
	$('html, body').animate({
		scrollTop: $('#top').offset().top - 18
	}, 'slow');
	if (window.location.hash) {
		$('html, body').animate({
			scrollTop: $('#karriere').offset().top - 18
		}, 'slow');
	}
	setTimeout(function () {
		$('#preloader').delay(250).fadeOut({ duration: 750 });
	}, 250);
}

$(document).ready(function () {
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

	$('.navToggle').on('click', function () {
		$(this).toggleClass('open');
		$('#menu_responsive').toggleClass('active_mobile');
		setTimeout(function () {
			$('#menu_responsive span a').each(function (i) {
				var t = $(this);
				setTimeout(function () { t.toggleClass('active_mobile'); }, (i + 1) * 100);
			});
		}, 200);
		$('.bgblack').toggleClass('active_mobile');
	});

	$('.bgblack, #menu_responsive.active_mobile span a').on('click', function () {
		setTimeout(function () {
			$('#menu_responsive span a').each(function (i) {
				var t = $(this);
				setTimeout(function () { t.toggleClass('active_mobile'); }, (i + 1) * 100);
			});
		}, 200);
		setTimeout(function () { $('#menu_responsive, .bgblack').toggleClass('active_mobile'); }, 100);
		$('.navToggle').toggleClass('open');
	});
});

// Smooth scroll for any in-page anchor link
$('a[href^="#"]').on('click', function (event) {
	var target = $(this.getAttribute('href'));
	if (target.length) {
		event.preventDefault();
		$('html, body').stop().animate({
			scrollTop: target.offset().top - 18
		}, 'slow');
	}
});

// Header link color during scroll
$(window).scroll(function () {
	var height = $(window).scrollTop();
	var winHeight = $(window).height();
	$('.main-nav__desktop a').css('color', '#00458c');
	if (height > winHeight) {
		$('.main-nav__desktop a').css('color', '#000');
		$('#marker').css('border-color', '#00458c');
	} else {
		$('.main-nav__desktop a').css('color', '#00458c');
		$('#marker').css('border-color', '#00458c');
	}
	if (height < winHeight) {
		$('#marker').css('border-color', 'transparent');
	}
});

// Navigation-bar shadow and logo position on scroll
$(window).load(responsiveEffect);
$(window).resize(responsiveEffect);
$(window).scroll(responsiveEffect);
function responsiveEffect() {
	var height = $(window).scrollTop();
	var winHeight = $(window).height();
	if (height > winHeight - 64) {
		$('.main-nav-bg').addClass('shadow');
		$('.bgblack .logo').css('top', '18px');
		$('.bgblack').css('top', '0px');
	} else {
		$('.main-nav-bg').removeClass('shadow');
		$('.bgblack .logo').css('top', '45px');
		$('.bgblack').css('top', '0px');
	}
	var winWidth = $(window).width();
	if (winWidth <= 880) {
		$('.bgblack .logo').css('top', '18px');
	} else {
		$('.bgblack .logo').css('top', '18px');
	}
}

// Scroll-spy: highlight the active section in the desktop nav
$(window).load(navFunc);
$(window).resize(navFunc);
$(window).scroll(navFunc);
function navFunc() {
	if (!$('#ueber_uns').length) return;
	var navOffset = 60;
	var ueber_unsTop          = Math.floor($('#ueber_uns').offset().top),
		investitionsansatzTop = Math.floor($('#investitionsansatz').offset().top),
		portfolioTop          = Math.floor($('#portfolio').offset().top),
		teamTop               = Math.floor($('#team').offset().top),
		karriereTop           = Math.floor($('#karriere').offset().top),
		kontaktTop            = Math.floor($('#kontakt').offset().top),
		impressumTop          = Math.floor($('#impressum').offset().top),
		datenschutzTop        = Math.floor($('#datenschutz').offset().top);
	var winScroll = $(window).scrollTop();
	var $items = $('.ueber_uns, .investitionsansatz, .portfolio, .team, .karriere, .kontakt, .impressum, .datenschutz');
	$items.removeClass('current');
	if ((winScroll + navOffset) < ueber_unsTop)                { /* nothing active */ }
	else if ((winScroll + navOffset) < investitionsansatzTop)  { $('.ueber_uns').addClass('current'); }
	else if ((winScroll + navOffset) < portfolioTop)           { $('.investitionsansatz').addClass('current'); }
	else if ((winScroll + navOffset) < teamTop)                { $('.portfolio').addClass('current'); }
	else if ((winScroll + navOffset) < karriereTop)            { $('.team').addClass('current'); }
	else if ((winScroll + navOffset) < kontaktTop)             { $('.karriere').addClass('current'); }
	else if ((winScroll + navOffset) < impressumTop)           { $('.kontakt').addClass('current'); }
	else if ((winScroll + navOffset) < datenschutzTop)         { $('.kontakt').addClass('current'); }
	else                                                       { $('.datenschutz').addClass('current'); }
}

// Same scroll-spy for the mobile nav (_responsive classes)
$(window).load(navResponsiveFunc);
$(window).resize(navResponsiveFunc);
$(window).scroll(navResponsiveFunc);
function navResponsiveFunc() {
	if (!$('#ueber_uns').length) return;
	var navOffset = 60;
	var ueber_unsTop          = Math.floor($('#ueber_uns').offset().top),
		investitionsansatzTop = Math.floor($('#investitionsansatz').offset().top),
		portfolioTop          = Math.floor($('#portfolio').offset().top),
		teamTop               = Math.floor($('#team').offset().top),
		karriereTop           = Math.floor($('#karriere').offset().top),
		kontaktTop            = Math.floor($('#kontakt').offset().top),
		impressumTop          = Math.floor($('#impressum').offset().top),
		datenschutzTop        = Math.floor($('#datenschutz').offset().top);
	var winScroll = $(window).scrollTop();
	var $items = $('.ueber_uns_responsive, .investitionsansatz_responsive, .portfolio_responsive, .team_responsive, .karriere_responsive, .kontakt_responsive, .impressum_responsive, .datenschutz_responsive');
	$items.removeClass('current_responsive');
	if ((winScroll + navOffset) < ueber_unsTop)                { /* nothing active */ }
	else if ((winScroll + navOffset) < investitionsansatzTop)  { $('.ueber_uns_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < portfolioTop)           { $('.investitionsansatz_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < teamTop)                { $('.portfolio_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < karriereTop)            { $('.team_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < kontaktTop)             { $('.karriere_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < impressumTop)           { $('.kontakt_responsive').addClass('current_responsive'); }
	else if ((winScroll + navOffset) < datenschutzTop)         { $('.kontakt_responsive').addClass('current_responsive'); }
	else                                                       { $('.datenschutz_responsive').addClass('current_responsive'); }
}
