/**
* Copyright 2013 Denis Meyer
*/
var loggingEnabled = true;

/**
* Logs given arguments -- uses console.log
*
* @param any arguments console.log-valid
* @return true if window.console exists and arguments had been logged, false else
*/
function log() {
	if (loggingEnabled && window.console) {
		try {
			window.console && console.log.apply(console, Array.prototype.slice.call(arguments));
			return true;
		} catch (err) {
			console.log(err);
		}
	}
	return false;
}

(function ($) {
	videoId1 = "example_video_1";
	videoId2 = "example_video_2";
	videoId3 = "example_video_3";

	$(document).ready(function () {
		$(document).on("sjs:allPlayersReady", function(event) {
			$("#bufferInfo").html("All players have been successfully initialized.");
		});
		$("#buttonBufferChecker").click(function () {
			$(document).trigger("sjs:cleanBufferChecker", []);
		});
		$(document).on("sjs:buffering", function(event) {
			$("#bufferInfo").html("Not every player has buffered, yet. Pausing...");
		});
		$(document).on("sjs:bufferedAndAutoplaying", function(event) {
			$("#bufferInfo").html("Every player has buffered now. Starting playing again...");
		});
		$(document).on("sjs:bufferedButNotAutoplaying", function(event) {
			$("#bufferInfo").html("Every player has buffered now, but there was a timeupdate, pause, ... event...");
		});
		$(document).on("sjs:masterTimeupdate", function(event, param) {
			$("#currentTime").html(param);
		});

		$.synchronizeVideos(0, videoId1, videoId2, videoId3);
	});
})(jQuery);
