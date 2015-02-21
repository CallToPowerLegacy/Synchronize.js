Synchronize.js
==============

A library for synchronizing multiple HTML5 video elements.
Implemented as a jQuery plugin.
Works with plain HTML5 video elements and with video.js when video.js has been detected.

Copyright 2013-2015 Denis Meyer (GNU LGPL v2 or v3)

Version
-------
1.2.2

Attention
---------
- Chrome/Chromium and Opera (15+) only initialize all video displays properly when the video sources are different per video tag
- for the Synchronize.js-examples to work you have to download the videos and customize the index.html files.
- the buffer checker is currently not working in Chrome, please trigger the event "sjs:stopBufferChecker" when Chrome has been detected

README
------
https://github.com/CallToPower/Synchronize.js/blob/master/README.md

Event documentation
-------------------
https://github.com/CallToPower/Synchronize.js/blob/master/EVENTS.md
