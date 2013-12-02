Synchronize.js
==============

jQuery [1] plugin for synchronizing multiple (2-n) video.js [2] videos.

Browser support
---------------
- Firefox
  - 25
- Chrome/Chromium
  - 27-31
- Opera
  - 12
  - 18

Attention
---------
- Chrome/Chromium only initializes all video displays properly when the video sources are different per video tag
- Have a look at the TODO file

Usage
-----

The first parameter is the number of the parameter of the master video number (starting at parameter 1 = 0, parameter 2 = 1, ...), following a variable number of video ids:
```
$.synchronizeVideos(masterVideoNumber, videoId1, videoId2, ... , videoIdN);
```

Example
-------

### JavaScript:

```
// the 3 html5 video elements to be synchronized
videoId1 = "example_video_1";
videoId2 = "example_video_2";
videoId3 = "example_video_3";

$(document).ready(function() {
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

---

[1] https://github.com/jquery/jquery
[2] https://github.com/videojs/video.js
