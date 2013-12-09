Synchronize.js
==============

A library for synchronizing multiple html5 video elements.
jQuery [1] needs to be installed.
Works with plain html5 video elements and with video.js [2] when video.js gets detected.

Copyright 2013 Denis Meyer (for more information visit [3])

---
[1] https://github.com/jquery/jquery,
[2] https://github.com/videojs/video.js,
[3] http://choosealicense.com/licenses [No License]

Version
-------
1.0.0

Screenshot
----------
![Screenshot](img/screenshot-1.png "Screenshot")

Browser support
---------------

Fully supported (and successfully tested on):

- Firefox
	- 25 `W, M, L`
- Safari
	- 7 `M`
- Google Chrome
	- 27-31 `W, M`
- Chromium
	- 27 `L`
	- 27-33 `M`
- Opera
	- 15-18 `W, M`

Not supported:
- Internet Explorer (crashes on page-load on a page with more than one video)
	- 10 `W`
	- 11 `W`
- Opera (videos lag)
	- 12 `W, M, L`

---
Operating systems tested on:
`W`indows 7+,
`M`ac OS X 10.6+,
`L`inux (Ubuntu 12+, Fedora 18+)

Attention
---------
- Chrome/Chromium and Opera (15+) [4] only initialize all video displays properly when the video sources are different per video tag [5, 6]

---
[4] All browsers with the blink engine ( http://www.chromium.org/blink ),
[5] see 'example/index_sameVideoSources.html',
[6] Chromium bug tracker: https://code.google.com/p/chromium/issues/detail?id=326593

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
An event documentation for events to be subscribed to can be found in the file "EVENTS.md" [7]

---
[7] https://github.com/CallToPower/Synchronize.js/blob/master/EVENTS.md

Example
-------

More detailed examples (plain html5 and video.js) can be found under "examples" after checking out this repository.

### JavaScript:

```
$(document).ready(function() {
	$(document).on("sjs:allPlayersReady", function(event) {
		// All players have been successfully initialized - do something!
	});
	
	// set videoId1 (parameter 1 = 0) as master
	$.synchronizeVideos(0, "example_video_1", "example_video_2", "example_video_3");
}
```

### HTML:

```
<video id="example_video_1" controls width="640" height="264">
	<source src="videos/video_1.mp4" type='video/mp4' />
	<source src="videos/video_1.webm" type='video/webm' />
	<source src="videos/video_1.ogv" type='video/ogg' />
</video>
<video id="example_video_2" controls width="640" height="264">
	<source src="videos/video_2.mp4" type='video/mp4' />
	<source src="videos/video_2.webm" type='video/webm' />
	<source src="videos/video_2.ogv" type='video/ogg' />
</video>
<video id="example_video_3" controls width="640" height="264">
	<source src="videos/video_3.mp4" type='video/mp4' />
	<source src="videos/video_3.webm" type='video/webm' />
	<source src="videos/video_3.ogv" type='video/ogg' />
</video>
```
