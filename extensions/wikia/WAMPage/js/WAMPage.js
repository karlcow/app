var WAMPage = function() {};

WAMPage.prototype = {
	init: function() {
		var wamIndex = document.getElementById('wam-index');
		if( wamIndex ) {
			wamIndex.addEventListener(
				'click',
				WAMPage.clickTrackingHandler,
				true
			);
		}

		var wamIndexSearch = document.getElementById('wam-index-search');
		if( wamIndexSearch ) {
			wamIndexSearch.addEventListener(
				'change',
				$.proxy(function(event) {
					WAMPage.clickTrackingHandler(event);
					WAMPage.filterWamIndex($(event.target));
				}, this),
				true
			);
		}

		var track = Wikia.Tracker.buildTrackingFunction({
			category: 'wam-page',
			trackingMethod: 'both',
			action: Wikia.Tracker.ACTIONS.IMPRESSION
		});
		
		if( window.wgTitle ) {
			if( window.wgWAMPageName && wgTitle === wgWAMPageName ) {
				track({label: 'index'});
			} else if( window.wgWAMFAQPageName && wgTitle === wgWAMFAQPageName ) {
				track({label: 'faq'});
			}
		}

		$.when(
			// jQuery UI datepicker plugin
			mw.loader.use(['jquery.ui.datepicker'])
		).done(
			$.proxy(function(getResourcesData) {
				var minDate = new Date(window.wamFilterMinMaxDates['min_date'] * 1000);
				minDate.setMinutes(minDate.getMinutes() + minDate.getTimezoneOffset());
				var maxDate = new Date(window.wamFilterMinMaxDates['max_date'] * 1000);
				maxDate.setMinutes(maxDate.getMinutes() + maxDate.getTimezoneOffset());

				$('#WamFilterDate').datepicker({
					showOtherMonths: true,
					selectOtherMonths: true,
					minDate: minDate,
					maxDate: maxDate,
					dateFormat: (typeof window.wamFilterDateFormat !== 'undefined' && window.wamFilterDateFormat)
						? window.wamFilterDateFormat
						: undefined,
					onSelect: $.proxy(function() {
						if( $(this).closest('#WamFilterDate') ) {
							WAMPage.trackClick('WamPage', Wikia.Tracker.ACTIONS.CLICK, 'wam-search-filter-change', null, {lang: wgContentLanguage, filter: 'date'});
						}
						WAMPage.filterWamIndex($('#WamFilterDate'));
					}, this)
				})
			}
			, this)
		);
	},

	trackClick: function (category, action, label, value, params, event) {
		Wikia.Tracker.track({
			action: action,
			browserEvent: event,
			category: category,
			label: label,
			trackingMethod: 'both',
			value: value
		}, params);
	},

	clickTrackingHandler: function (e) {
		var node = $(e.target),
			lang = wgContentLanguage,
			searchPhrase;
		
		if( node.closest('.wam-index-search button').length > 0 ) {
			searchPhrase = $('.wam-index-search button img')
				.parents('form')
				.find('input[name="searchPhrase"]')
				.val();
			WAMPage.trackClick('wam-page', Wikia.Tracker.ACTIONS.SUBMIT, 'wam-search', null, {lang: lang, phrase: searchPhrase}, e);
		} else if ( e.type === 'change' && node.closest('.wam-index-search select[name=langCode]').length > 0 ) {
			WAMPage.trackClick('wam-page', Wikia.Tracker.ACTIONS.CLICK, 'wam-search-filter-change', null, {lang: lang, filter: 'langCode'}, e);
		} else if ( e.type === 'change' && node.closest('.wam-index-search select[name=verticalId]').length > 0 ) {
			WAMPage.trackClick('wam-page', Wikia.Tracker.ACTIONS.CLICK, 'wam-search-filter-change', null, {lang: lang, filter: 'verticalId'}, e);
		}
	},

	filterWamIndex: function(target) {
		target.parents('.wam-index-search').submit();
	}
};

var WAMPage = new WAMPage();
$(function () {
	WAMPage.init();
});
