/* Arcaris Consent Manager — v3
 *
 * Binary consent (the site only embeds Google Maps).
 * Stored as localStorage['arcaris_consent_v1'] = { v, ts, thirdparty }.
 *
 * Single reducer applyConsent(state) maps state → DOM:
 *   null              → banner visible, map placeholder visible
 *   { thirdparty: 1 } → banner hidden,  iframe visible
 *   { thirdparty: 0 } → banner hidden,  map placeholder visible
 *
 * Public API: window.ArcarisConsent.{current, apply, accept, reject, revoke, init}
 * Event:      document.dispatchEvent(new CustomEvent('arcaris:consent', { detail }))
 *
 * Debug:      add ?debug=consent to the URL to enable verbose console logging.
 */
(function () {
	var STORAGE_KEY = 'arcaris_consent_v1';
	var BANNER_ID = 'arc-cookie';
	var MAP_ID = 'maps-code';

	var DEBUG = /[?&]debug=consent/.test(location.search);
	function log() {
		if (!DEBUG) return;
		try { console.log.apply(console, ['[arcaris-consent]'].concat([].slice.call(arguments))); } catch (e) {}
	}

	var _banner = null;

	/* ---------- Persistence ---------- */

	function readConsent() {
		try {
			var raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			var p = JSON.parse(raw);
			if (p && p.v === 1) return { thirdparty: !!p.thirdparty, ts: p.ts || null };
		} catch (e) { log('readConsent error', e); }
		return null;
	}

	function writeConsent(thirdparty) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({
				v: 1, ts: new Date().toISOString(), thirdparty: !!thirdparty
			}));
		} catch (e) { log('writeConsent error', e); }
	}

	function clearConsent() {
		try { localStorage.removeItem(STORAGE_KEY); } catch (e) { log('clearConsent error', e); }
	}

	function emit(detail) {
		try { document.dispatchEvent(new CustomEvent('arcaris:consent', { detail: detail })); }
		catch (e) { log('emit error', e); }
	}

	/* ---------- Banner DOM ---------- */

	function showBanner() {
		if (!_banner) { log('showBanner: no banner'); return; }
		var wasHidden = _banner.hidden;
		_banner.hidden = false;
		document.body.classList.add('arc-cookie-open');
		if (wasHidden) {
			// Move keyboard focus into the banner so tab users reach it immediately.
			// Defer to next tick so the element is actually visible when we focus.
			var firstBtn = _banner.querySelector('[data-act]');
			if (firstBtn) setTimeout(function () { try { firstBtn.focus({ preventScroll: true }); } catch (e) { firstBtn.focus(); } }, 0);
		}
		log('banner shown');
	}

	function hideBanner() {
		if (!_banner) return;
		_banner.hidden = true;
		document.body.classList.remove('arc-cookie-open');
		log('banner hidden');
	}

	/* ---------- Map DOM ---------- */

	function escapeAttr(s) {
		return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
	}

	function renderPlaceholder() {
		var c = document.getElementById(MAP_ID);
		if (!c) { log('renderPlaceholder: no #' + MAP_ID); return; }
		var img = c.getAttribute('data-map-placeholder-src') || '';
		var alt = c.getAttribute('data-map-placeholder-alt') || 'Google Maps';
		c.innerHTML =
			'<div class="g-map__placeholder" data-arc-map-placeholder data-role="none" role="button" tabindex="0" aria-label="Google Maps laden">'
			+   (img ? '<img src="' + escapeAttr(img) + '" alt="' + escapeAttr(alt) + '" class="g-map__image" loading="lazy">' : '')
			+   '<span class="g-map__cta">'
			+     '<span class="g-map__cta-title">Karte anzeigen</span>'
			+     '<span class="g-map__cta-note">Klicken, um Google Maps zuzulassen.</span>'
			+   '</span>'
			+ '</div>';
		log('placeholder rendered');
	}

	function renderMap() {
		var c = document.getElementById(MAP_ID);
		if (!c) { log('renderMap: no #' + MAP_ID); return; }
		var src = c.getAttribute('data-map-src');
		if (!src) { log('renderMap: no data-map-src'); return; }
		var iframe = document.createElement('iframe');
		iframe.setAttribute('src', src);
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('loading', 'eager');
		iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
		iframe.setAttribute('title', 'Google Maps — Arcaris Management GmbH');
		iframe.style.border = '0';
		c.innerHTML = '';
		c.appendChild(iframe);
		log('iframe rendered');
	}

	/* ---------- Reducer ---------- */

	function applyConsent(state) {
		log('applyConsent', state);
		if (state == null) {
			showBanner();
			renderPlaceholder();
			return;
		}
		hideBanner();
		if (state.thirdparty) renderMap();
		else renderPlaceholder();
	}

	/* ---------- Actions ---------- */

	function accept() {
		writeConsent(true);
		applyConsent(readConsent());
		emit(readConsent());
	}

	function reject() {
		writeConsent(false);
		applyConsent(readConsent());
		emit(readConsent());
	}

	function revoke() {
		clearConsent();
		applyConsent(null);
		emit(null);
	}

	/* ---------- Delegated clicks ---------- */

	function handleBannerClick(e) {
		var btn = e.target.closest('[data-act]');
		if (!btn) return;
		var act = btn.getAttribute('data-act');
		log('banner click:', act);
		if (act === 'accept') accept();
		else if (act === 'reject') reject();
	}

	function handlePlaceholderClick() {
		log('placeholder clicked');
		var s = readConsent();
		if (s && s.thirdparty) renderMap();
		else showBanner();
	}

	if (!document.__arcMapDelegated) {
		document.addEventListener('click', function (e) {
			var ph = e.target && e.target.closest && e.target.closest('[data-arc-map-placeholder]');
			if (ph) { e.preventDefault(); handlePlaceholderClick(); }
		});
		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			var ph = e.target && e.target.closest && e.target.closest('[data-arc-map-placeholder]');
			if (ph) { e.preventDefault(); handlePlaceholderClick(); }
		});
		document.__arcMapDelegated = true;
	}

	/* ---------- Init ---------- */

	function init() {
		_banner = document.getElementById(BANNER_ID);
		if (!_banner) { log('init: banner not found'); return false; }
		if (!_banner.__arcInit) {
			_banner.addEventListener('click', handleBannerClick);
			_banner.__arcInit = true;
		}
		applyConsent(readConsent());
		emit(readConsent());
		log('init done');
		return true;
	}

	window.ArcarisConsent = {
		current: readConsent,
		apply: applyConsent,
		accept: accept,
		reject: reject,
		revoke: revoke,
		init: init,
		debug: function (on) { DEBUG = (on !== false); log('debug ' + (DEBUG ? 'on' : 'off')); }
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
