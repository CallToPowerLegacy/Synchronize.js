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
	videojs.options.flash.swf = "swf/video-js.swf";
	videoId1 = "example_video_1";
	// videoId2 = "example_video_2";
	// videoId3 = "example_video_3";
	mediagroupId = "videoMG1";

	$(document).ready(function () {
		$(document).on("sjs:allPlayersReady", function(event) {
			$("#bufferInfo").html("All players have been successfully initialized.");
		});
		$("#buttonPlay").click(function () {
			$(document).trigger("sjs:play", []);
		});
		$("#buttonPause").click(function () {
			$(document).trigger("sjs:pause", []);
		});
		$("#buttonResetVideo").click(function () {
			$(document).trigger("sjs:setCurrentTime", [0]);
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

		// $.synchronizeVideos(0, videoId1, videoId2, videoId3);
		$.synchronizeVideos(0, mediagroupId);

		videojs(videoId1).ready(function () {
			videojs("example_video_1").thumbnails({
				0: {
					src: 'img/thumbnails.png',
					style: {
						left: '-60px',
						width: '600px',
						height: '68px',
						clip: 'rect(0, 120px, 68px, 0)'
					}
				},
				10: {
					style: {
						left: '-180px',
						clip: 'rect(0, 240px, 68px, 120px)'
					}
				},
				20: {
					style: {
						left: '-300px',
						clip: 'rect(0, 360px, 68px, 240px)'
					}
				},
				30: {
					style: {
						left: '-420px',
						clip: 'rect(0, 480px, 68px, 360px)'
					}
				},
				40: {
					style: {
						left: '-540px',
						clip: 'rect(0, 600px, 68px, 480px)'
					}
				}
			});
		});
	});
})(jQuery);
