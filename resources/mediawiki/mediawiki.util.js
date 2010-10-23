/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true */
/*
 * Utilities
 */

(function ($, mw) {

	mediaWiki.util = {

		/* Initialisation */
		'initialised' : false,
		'init' : function () {
			if (this.initialised === false){
				this.initialised = true;


				// Set tooltipAccessKeyPrefix
				if ( is_opera ) {
					this.tooltipAccessKeyPrefix = 'shift-esc-';
				} else if ( is_chrome ) {
					this.tooltipAccessKeyPrefix = is_chrome_mac ? 'ctrl-option-' : 'alt-';
				} else if ( !is_safari_win && is_safari && webkit_version > 526 ) {
					this.tooltipAccessKeyPrefix = 'ctrl-alt-';
				} else if ( !is_safari_win && ( is_safari
						|| clientPC.indexOf('mac') != -1
						|| clientPC.indexOf('konqueror') != -1 ) ) {
					this.tooltipAccessKeyPrefix = 'ctrl-';
				} else if ( is_ff2 ) {
					this.tooltipAccessKeyPrefix = 'alt-shift-';
				}


				return true;
			}
			return false;
		},

		/* Main body */

		/**
		* Encodes the string like PHP's rawurlencode
		*
		* @param String str		string to be encoded
		*/
		'rawurlencode' : function (str) {
			str = (str + '').toString();
			return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28')
				.replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/~/g, '%7E');
		},

		/**
		* Encode pagetitles for use in a URL
		* We want / and : to be included as literal characters in our title URLs
		* as they otherwise fatally break the title
		*
		* @param String str		string to be encoded
		*/
		'wikiUrlencode' : function (str) {
			return this.rawurlencode(str).replace(/%20/g, '_').replace(/%3A/g, ':').replace(/%2F/g, '/');
		},


		/**
		* Grabs the url parameter value for the given parameter
		* Returns null if not found
		*
		* @param String	param	paramter name
		* @param String url		url to search through (optional)
		*/
		'getParamValue' : function (param, url) {
			url = url ? url : document.location.href;
			var re = new RegExp('[^#]*[&?]' + param + '=([^&#]*)'); // Get last match, stop at hash
			var m = re.exec(url);
			if (m && m.length > 1) {
				return decodeURIComponent(m[1]);
			}
			return null;
		},

		/**
		* Converts special characters to their HTML entities
		*
		* @param String		str text to escape
		* @param Bool			quotes if true escapes single and double quotes aswell (by default false)
		*/
		'htmlEscape' : function (str, quotes) {
			str = $('<div/>').text(str).html();
			if (typeof quotes === 'undefined') {
				quotes = false;
			}
			if (quotes === true) {
				str = str.replace(/'/g, '&#039;').replace(/"/g, '&quot;');
			}
			return str;
		},

		/**
		* Converts HTML entities back to text
		*
		* @param String str		text to unescape
		*/
		'htmlUnescape' : function (str) {
			return $('<div/>').html(str).text();
		},

		// Access key prefix
		// will be re-defined based on browser/operating system detection in mw.util.init()
		'tooltipAccessKeyPrefix' : 'alt-',

		// Regex to match accesskey tooltips
		'tooltipAccessKeyRegexp': /\[(ctrl-)?(alt-)?(shift-)?(esc-)?(.)\]$/,

		/**
		 * Add the appropriate prefix to the accesskey shown in the tooltip.
		 * If the nodeList parameter is given, only those nodes are updated;
		 * otherwise, all the nodes that will probably have accesskeys by
		 * default are updated.
		 *
		 * @param Mixed nodeList	jQuery object, or array of elements
		 */
		'updateTooltipAccessKeys' : function (nodeList) {
			var $nodes;
			if (nodeList instanceof jQuery) {
				$nodes = nodeList;
			} else if (nodeList) {
				$nodes = $(nodeList);
			} else {
				// Rather than scanning all links, just
				$("#column-one a, #mw-head a, #mw-panel a, #p-logo a");

				// these are rare enough that no such optimization is needed
				this.updateTooltipAccessKeys($('input'));
				this.updateTooltipAccessKeys($('label'));
				return;
			}

			$nodes.each(function (i) {
				var tip = $(this).attr('title');
				if (!!tip && mw.util.tooltipAccessKeyRegexp.exec(tip)) {
					tip = tip.replace(mw.util.tooltipAccessKeyRegexp, '[' + tooltipAccessKeyPrefix + "$5]");
					$(this).attr('title', tip);
				}
			});
		},


		/**
		 * Add a link to a portlet menu on the page, such as:
		 *
		 * p-cactions (Content actions), p-personal (Personal tools), p-navigation (Navigation), p-tb (Toolbox)
		 *
		 * The first three paramters are required, others are optionals. Though
		 * providing an id and tooltip is recommended.
		 *
		 * By default the new link will be added to the end of the list. To add the link before a given existing item,
		 * pass the DOM node (document.getElementById('foobar') or the jQuery-selector ('#foobar') of that item.
		 *
		 * @example mw.util.addPortletLink('p-tb', 'http://mediawiki.org/', 'MediaWiki.org', 't-mworg', 'Go to MediaWiki.org ', 'm', '#t-print')
		 *
		 * @param String portlet	id of the target portlet ("p-cactions" or "p-personal" etc.)
		 * @param String href		link URL
		 * @param String text		link text (will be automatically lowercased by CSS for p-cactions in Monobook)
		 * @param String id			id of the new item, should be unique and preferably have the appropriate prefix ("ca-", "pt-", "n-" or "t-")
		 * @param String tooltip	text to show when hovering over the link, without accesskey suffix
		 * @param String accesskey	accesskey to activate this link (one character, try to avoid conflicts)
		 * @param mixed nextnode	DOM node or jQuery-selector of the item that the new item should be added before, should be another item in the same list
		 *
		 * @return Node				the DOM node of the new item (a LI element) or null
		 */
		'addPortletLink' : function (portlet, href, text, id, tooltip, accesskey, nextnode) {
			var $portlet = $('#' + portlet);
			if ($portlet.length === 0) {
				return null;
			}
			var $ul = $portlet.find('ul').eq(0);
			if ($ul.length === 0) {
				if ($portlet.find('div').length === 0) {
					$portlet.append('<ul />');
				} else {
					$portlet.find('div').eq(-1).append('<ul />');
				}
				$ul = $portlet.find('ul').eq(0);
			}
			if ($ul.length === 0) {
				return null;
			}

			// unhide portlet if it was hidden before
			$portlet.removeClass('emptyPortlet');

			var $link = $('<a />').attr('href', href).text(text);
			var $item = $link.wrap('<li><span /></li>').parent().parent();

			if (id) {
				$item.attr('id', id);
			}
			if (accesskey) {
				$link.attr('accesskey', accesskey);
				tooltip += ' [' + accesskey + ']';
			}
			if (tooltip) {
				$link.attr('title', tooltip);
			}
			if (accesskey && tooltip) {
				this.updateTooltipAccessKeys($link);
			}

			// Append using DOM-element passing
			if (nextnode && nextnode.parentNode == $ul.get(0)) {
				$(nextnode).before($item);
			} else {
				// If the jQuery selector isn't found within the <ul>, just append it at the end
				if ($ul.find(nextnode).length === 0) {
					$ul.append($item);
				} else {
					// Append using jQuery CSS selector
					$ul.find(nextnode).eq(0).before($item);
				}
			}

			return $item.get(0);
		}

	};

})(jQuery, mediaWiki);

mediaWiki.util.init();