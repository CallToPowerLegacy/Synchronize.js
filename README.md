Synchronize.js
==============

jQuery [1] plugin for synchronizing multiple video.js [2] html5 video elements.

Copyright 2013 Denis Meyer (for more information visit [3])

---
[1] https://github.com/jquery/jquery,
[2] https://github.com/videojs/video.js,
[3] http://choosealicense.com/licenses [No License]

Screenshot
----------
![Screenshot](img/screenshot-1.png "Screenshot")

Browser support
---------------

Successfully tested on:

- Firefox
	- 25 [w, m, l]
- Safari
	- 7 [m]
- Google Chrome
	- 27-31 [w, m]
- Chromium
	- 33 [m, l]
- Opera
	- 12 [w, m, l]
	- 18 [w, m, l]

---
[w]indows,
[m]ac OS X,
[l]inux (Ubuntu, Fedora)

Attention
---------
- Chrome/Chromium and Opera (15+) [4] only initialize all video displays properly when the video sources are different per video tag [5]

---
[4] All browsers with the blink engine ( http://www.chromium.org/blink ),
[5] see 'example/index_sameVideoSources.html'

Usage
-----

The first parameter is the number of the parameter of the master video number (starting at parameter 1 = 0, parameter 2 = 1, ...), following a variable number of video ids:
```
$.synchronizeVideos(masterVideoNumber, videoId1, videoId2, ... , videoIdN);
```
Subscribe to Synchronize.js events, e.g.:
```
$(document).on("sjs:allPlayersReady", function(event) {
    // All players have been successfully initialized - do something!
});
```
An event documentation for events to be subscribed to can be found in the file "EVENTS.md" [6]

---
[6] https://github.com/CallToPower/Synchronize.js/blob/master/EVENTS.md

Example
-------

A more detailed example can be found under "example" after checking out this repository.

### JavaScript:

```
// the 3 html5 video elements to be synchronized
videoId1 = "example_video_1";
videoId2 = "example_video_2";
videoId3 = "example_video_3";

$(document).ready(function() {
	$(document).on("sjs:allPlayersReady", function(event) {
		// All players have been successfully initialized - do something!
	});
	
	// set videoId1 (parameter 1 = 0) as master
	$.synchronizeVideos(0, videoId1, videoId2, videoId3);
}
```

### HTML:

```
<video
	id="example_video_1"
	class="video-js vjs-default-skin"
	controls
	width="640"
	height="264"
	poster="img/video_1.png"
	data-setup='{
		"controls": true,
		"autoplay": false,
		"preload": "auto"
	}'>
	<source src="videos/video_1.mp4" type='video/mp4' />
	<source src="videos/video_1.webm" type='video/webm' />
	<source src="videos/video_1.ogv" type='video/ogg' />
</video>
<video
	id="example_video_2"
	class="video-js vjs-default-skin"
	width="640"
	height="264"
	poster="img/video_2.png"
	data-setup='{
		"controls": false,
		"autoplay": false,
		"preload": "auto"
	}'>
	<source src="videos/video_2.mp4" type='video/mp4' />
	<source src="videos/video_2.webm" type='video/webm' />
	<source src="videos/video_2.ogv" type='video/ogg' />
</video>
<video
	id="example_video_3"
	class="video-js vjs-default-skin"
	width="640"
	height="264"
	poster="img/video_3.png"
	data-setup='{
		"controls": false,
		"autoplay": false,
		"preload": "auto"
	}'>
	<source src="videos/video_3.mp4" type='video/mp4' />
	<source src="videos/video_3.webm" type='video/webm' />
	<source src="videos/video_3.ogv" type='video/ogg' />
</video>
```
