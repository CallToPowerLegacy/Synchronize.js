/**
 *  Copyright (C) 2014 Denis Meyer, calltopower88@googlemail.com
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
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
