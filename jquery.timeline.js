/**
 * jQuery Timeline Plugin v0.1 (2016-10-07)
 *
 * https://github.com/joshthompson/jquery-timeline
 *
 * Copyright (c) 2016 Joshua Thompson
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	$.fn.timeline = function(items, options) {

		// Default options
		var default_options = {
			mode: "new"
		};
		options = $.extend({}, default_options, options);

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
		$.each(items, function(i, item) {

			// Check item is a jQuery object
			var $item = $(item);

			// Check which column is taller and choose that column to add to
			$col  = $right_col.height() >= $left_col.height() ? $left_col : $right_col;

			// Create elements to be added to the column and add them
			var $empty_box = options.mode == "add" || i ? $("<div class='jqtimeline-empty'></div>") : "";
			var $item_box = $("<div class='jqtimeline-item' data-jqtimeline-item='" + i + "'></div>").append($item);
			$col.append($empty_box).append($item_box);

			// Check if label is different from label before... if it is, we use it... normally used for date
			if ($item.attr("data-jqtimeline-label") && label != $item.attr("data-jqtimeline-label")) {
				var $label = $("<div class='jqtimeline-label' data-jqtimeline-item='" + i + "'>" + $item.attr("data-jqtimeline-label") + "</div>");
				$line.append($label);
				label = $item.attr("data-jqtimeline-label");
			}

		});

		// Set last label as attribute so if more are added they can use this
		$timeline.attr("data-last-label", label);

		// Set all the values that depends on the window and container size so when they resize properly
		var resizeWindowFunction = function() {
			// Setup column widths
			var innerWidth = $timeline.width();
			var lineWidth = $line.outerWidth() + parseInt($line.css("margin-left")) + parseInt($line.css("margin-right"));
			var columnWidth = Math.floor(innerWidth / 2 - lineWidth / 2);
			$timeline.find(".jqtimeline-column").width(columnWidth);

			// Setup height of line to the max height of either column
			$line.height(Math.max($left_col.height(), $right_col.height()));

			// Move labels
			$timeline.find(".jqtimeline-label[data-jqtimeline-item]").each(function() {
				var $item_box = $timeline.find(".jqtimeline-item[data-jqtimeline-item='" + $(this).attr("data-jqtimeline-item") + "']");
				$(this).css({top: $item_box.offset().top - $timeline.position().top});
			});

		};
		
		// Run resize function for initial setup and bind it to a window resize event
		resizeWindowFunction();
		$(window).resize(resizeWindowFunction);

	}
})(jQuery);