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

		// Setup vars
		var $timeline = $(this).addClass("jqtimeline").empty();

		// Setup container sections
		var $left_col = $("<div class='jqtimeline-column jqtimeline-column-left'></div>");
		var $line = $("<div class='jqtimeline-line'></div>");
		var $right_col = $("<div class='jqtimeline-column jqtimeline-column-right'></div>");
		$timeline.append($left_col).append($line).append($right_col);

		var label = false;

		// Add items
		$.each(items, function(i, $item) {

			$main_col  = $right_col.height() >= $left_col.height() ? $left_col : $right_col;
			$other_col = $right_col.height() >= $left_col.height() ? $right_col : $left_col;

			$empty_box = i ? $("<div class='jqtimeline-empty'></div>") : "";

			var $item_box = $("<div class='jqtimeline-item' data-jqtimeline-item='" + i + "'></div>").append($item);

			$main_col.append($empty_box).append($item_box);

			if ($item.attr("data-jqtimeline-label") && label != $item.attr("data-jqtimeline-label")) {
				var $label = $("<div class='jqtimeline-label' data-jqtimeline-item='" + i + "'>" + $item.attr("data-jqtimeline-label") + "</div>");
				$line.append($label);
				label = $item.attr("data-jqtimeline-label");
			}

		});


		// Do something else
		var resizeWindowFunction = function() {
			// Setup column widths
			var innerWidth = $timeline.width();
			var lineWidth = 24;
			var columnWidth = Math.floor(innerWidth / 2 - lineWidth / 2);
			$timeline.find(".jqtimeline-column").width(columnWidth);

			// Setup heights
			$left_col.css({height: "auto"});
			$right_col.css({height: "auto"});
			var height = Math.max($left_col.height(), $right_col.height());
			$left_col.height(height);
			$line.height(height);
			$right_col.height(height);

			// Move labels
			$timeline.find(".jqtimeline-label[data-jqtimeline-item]").each(function() {
				var $item_box = $timeline.find(".jqtimeline-item[data-jqtimeline-item='" + $(this).attr("data-jqtimeline-item") + "']");
				$(this).css({top: $item_box.offset().top - $timeline.position().top});
			});

		};
		resizeWindowFunction();
		$(window).resize(resizeWindowFunction);

	}
})(jQuery);