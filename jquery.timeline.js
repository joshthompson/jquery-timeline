/**
 * jQuery Timeline Plugin v0.2 (2016-10-07)
 *
 * https://github.com/joshthompson/jquery-timeline
 *
 * Copyright (c) 2016 Joshua Thompson
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.timeline = function(options) {

		// Default options
		var default_options = {
			items: false,
			mode: "new",
			inifiteScroll: false,
			inifiteScrollOffset: 0,
			page: 1
		};
		options = $.extend({}, default_options, options);

		// Setup vars
		var items = options.items ? options.items : $(this).children().detach();

		// Setup jQuery elements
		if (options.mode == "new") {
			var $timeline = $(this).addClass("jqtimeline").empty();
			var $left_col = $("<div class='jqtimeline-column jqtimeline-column-left'></div>");
			var $line = $("<div class='jqtimeline-line'></div>");
			var $right_col = $("<div class='jqtimeline-column jqtimeline-column-right'></div>");
			$timeline.append($left_col).append($line).append($right_col);
		} else if (options.mode == "add") {
			var $timeline = $(this);
			var $left_col = $timeline.find(".jqtimeline-column-left");
			var $line = $timeline.find(".jqtimeline-line");
			var $right_col = $timeline.find(".jqtimeline-column-right");
		}

		// Loop through items
		var label = $timeline.is("[data-last-label]") ? $timeline.attr("data-last-label") : false;
		var page_offset = $timeline.find(".jqtimeline-item").length; // Number of existing elements in timeline
		$.each(items, function(i, item) {

			// Check item is a jQuery object
			var $item = $(item);

			// Check which column is taller and choose that column to add to
			var $col = $right_col.height() >= $left_col.height() ? $left_col : $right_col;
			var item_number = i + page_offset;

			// Create elements to be added to the column and add them
			var $empty_box = options.page > 1 || i ? $("<div class='jqtimeline-empty'></div>") : "";
			var $item_box = $("<div class='jqtimeline-item' data-jqtimeline-item='" + item_number + "'></div>").append($item);
			$col.append($empty_box).append($item_box);

			// Check if label is different from label before... if it is, we use it... normally used for date
			if ($item.attr("data-jqtimeline-label") && label != $item.attr("data-jqtimeline-label")) {
				var $label = $("<div class='jqtimeline-label' data-jqtimeline-item='" + item_number + "'>" + $item.attr("data-jqtimeline-label") + "</div>");
				$line.append($label);
				label = $item.attr("data-jqtimeline-label");
			}

		});

		// Set last label as attribute so if more are added they can use this
		$timeline.attr({
			"data-last-label": label,
			"data-page": options.page,
			"data-infinite-loading": 0
		});

		// Set all the values that depends on the window and container size so when they resize properly
		var resizeWindowFunction = function() {

			// Setup column widths
			var inner_idth = $timeline.width();
			var line_width = $line.outerWidth() + parseInt($line.css("margin-left")) + parseInt($line.css("margin-right"));
			var column_width = Math.floor(inner_idth / 2 - line_width / 2);
			$timeline.find(".jqtimeline-column").width(column_width);

			// Setup height of line to the max height of either column
			$line.height(Math.max($left_col.height(), $right_col.height()));

			// Move labels
			$timeline.find(".jqtimeline-label[data-jqtimeline-item]").each(function() {
				var $item_box = $timeline.find(".jqtimeline-item[data-jqtimeline-item='" + $(this).attr("data-jqtimeline-item") + "']");
				$(this).css({top: $item_box.offset().top - $timeline.position().top});
			});

		};

		// Infinite scroll
		if (typeof options.inifiteScroll == "function") {
			var inifiteScrollCheck = function() {
				if (options.page == $timeline.attr("data-page") && $timeline.attr("data-infinite-loading") == 0) {
					var screen_bottom = $(window).scrollTop() + $(window).height();
					var line_bottom = $line.position().top + $line.outerHeight();
					
					// Check if the infinite scroll needs to start loading new data
					if (screen_bottom > line_bottom - options.inifiteScrollOffset) {
						
						var $label = $("<div class='jqtimeline-label jqtimeline-loading-label'><span>•</span><span>•</span><span>•</span></div>"); 
						$line.append($label);
						$label.css({top: $line.height()});

						options.inifiteScroll($timeline.find(".jqtimeline-item").length, function() {
							$line.find(".jqtimeline-label.jqtimeline-loading-label").remove();
						});
						$timeline.attr("data-infinite-loading", 1);
					}
				}
			};
			$(window).scroll(inifiteScrollCheck);
		}

		// Run resize function for initial setup and bind it to a window resize event
		resizeWindowFunction();
		$(window).resize(resizeWindowFunction);

	}
})(jQuery);
