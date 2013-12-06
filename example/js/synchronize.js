/**
 * Copyright 2013 Denis Meyer
 */
(function ($) {
    var loggingEnabled = true;

    var videoIds = [];
    var videoIdsReady = {};
    var videoIdsInit = {};
    var masterVidNumber = 0;
    var masterVideoId;

    var lastSynch = 0;
    var synchInterval = 2000; // ms
    var synchGap = 1.0; // s

    var startClicked = false;

    var bufferCheckerSet = false;
    var bufferChecker;
    var checkBufferInterval = 1000; // ms
    var playWhenBuffered = false;
    var ignoreNextPause = false;
    var hitPauseWhileBuffering = false;
    var bufferInterval = 1.5; // s

    /**
     * Checks whether a number is in an interval [lower, upper]
     *
     * @param num the number to check
     * @param lower lower check
     * @param upper upper check
     * @return true if num is in [lower, upper]
     */
    function isInInterval(num, lower, upper) {
        if (!isNaN(num) && !isNaN(lower) && !isNaN(upper) && (lower <= upper)) {
            return ((num >= lower) && (num <= upper));
        } else {
            return false;
        }
    }

    /**
     * Play video
     *
     * @param id video id
     * @return true if id is not undefined and video plays
     */
    function play(id) {
        return videojs(id).play();
    }

    /**
     * Set video volume
     *
     * @param id video id
     * @param vol the volume
     * @return true if id is not undefined and volume has been set
     */
    function setVolume(id, vol) {
        return videojs(id).volume(vol);
    }

    /**
     * Pause video
     *
     * @param id video id
     * @return true if id is not undefined and video has been paused
     */
    function pause(id) {
        return videojs(id).pause();
    }

    /**
     * Check whether video is paused
     *
     * @param id video id
     * @return id is not undefined and whether is paused
     */
    function isPaused(id) {
        return videojs(id).paused();
    }

    /**
     * Returns the video duration
     *
     * @param id video id
     * @return duration if id is not undefined
     */
    function getDuration(id) {
        return videojs(id).duration();
    }

    /**
     * Returns the current time in the video
     *
     * @param id video id
     * @return current time if id is not undefined
     */
    function getCurrentTime(id) {
        return videojs(id).currentTime();
    }

    /**
     * Returns a video.js id
     *
     * @param videojsVideo the video.js video object
     * @return video.js id if videojsVideo is not undefined
     */
    function getVideoId(videojsVideo) {
        return videojsVideo.Q;
    }

    /**
     * Seeks in video
     *
     * @param id video id
     * @param time time to seek to
     * @param true if id is not undefined and time is in interval and successfully seeked
     */
    function seek(id, time) {
        if (!isNaN(time) && (time >= 0) && (time <= getDuration(id))) {
            videojs(id).currentTime(time);
            return true;
        } else {
            videojs(id).currentTime(getDuration(id));
            return false;
        }
    }

    /**
     * Synchronizes all slaves with the master
     */
    function synchronize() {
        var ct1 = getCurrentTime(masterVideoId);
        var ct2;
        for (var i = 0; i < videoIds.length; ++i) {
            if (videoIds[i] != masterVideoId) {
                ct2 = getCurrentTime(videoIds[i]);
                // currentTime in seconds!
                if ((ct1 != -1) && (ct2 != -1) && !isInInterval(ct2, ct1 - synchGap, ct1)) {
                    $(document).trigger("sjs:synchronizing", [ct1, videoIds[i]]);
                    if (!seek(videoIds[i], ct1)) {
                        // pause(videoIds[i]);
                    } else {
                        play(videoIds[i]);
                    }
                }
            }
        }
    }

    /**
     * Registers master events on all slaves
     */
    function registerEvents() {
        if (allVideoIdsInitialized()) {
            var masterPlayer = videojs(masterVideoId);

            masterPlayer.on("play", function () {
                $(document).trigger("sjs:masterPlay", [getCurrentTime(masterVideoId)]);
                hitPauseWhileBuffering = false;
                if (!bufferCheckerSet) {
                    bufferCheckerSet = true;
                    setBufferChecker();
                }
                for (var i = 0; i < videoIds.length; ++i) {
                    if (videoIds[i] != masterVideoId) {
                        videojs(videoIds[i]).on("play", function () {
                            setVolume(getVideoId(this), 0);
                        });
                        play(videoIds[i]);
                    }
                }
            });

            masterPlayer.on("pause", function () {
                $(document).trigger("sjs:masterPause", [getCurrentTime(masterVideoId)]);
                hitPauseWhileBuffering = !ignoreNextPause && playWhenBuffered && true;
                ignoreNextPause = ignoreNextPause ? !ignoreNextPause : ignoreNextPause;
                for (var i = 0; i < videoIds.length; ++i) {
                    if (videoIds[i] != masterVideoId) {
                        pause(videoIds[i]);
                        synchronize();
                    }
                }
            });

            masterPlayer.on("ended", function () {
                $(document).trigger("sjs:masterEnded", [getDuration(masterVideoId)]);
                hitPauseWhileBuffering = true;
                for (var i = 0; i < videoIds.length; ++i) {
                    if (videoIds[i] != masterVideoId) {
                        synchronize();
                        pause(videoIds[i]);
                    }
                }
            });

            masterPlayer.on("timeupdate", function () {
                $(document).trigger("sjs:masterTimeupdate", [getCurrentTime(masterVideoId)]);
                hitPauseWhileBuffering = true;
                var now = Date.now();
                if (((now - lastSynch) > synchInterval) || isPaused(masterVideoId)) {
                    lastSynch = now;
                    var video;
                    var paused;
                    for (var i = 0; i < videoIds.length; ++i) {
                        if (videoIds[i] != masterVideoId) {
                            setVolume(videoIds[i], 0);
                            paused = isPaused(videoIds[i]);
                            synchronize();
                            if (paused) {
                                pause(videoIds[i]);
                            }
                        }
                    }
                }
            });
        } else {
            for (var i = 0; i < videoIds.length; ++i) {
                pause(videoIds[i]);
            }
        }
    }

    /**
     * Checks every checkBufferInterval ms whether all videos have a buffer to continue playing.
     * If not:
     *   - player pauses automatically
     *   - starts automatically playing again when enough is buffered
     */
    function setBufferChecker() {
        bufferChecker = window.setInterval(function () {
            var allBuffered = true;

            var currTime = getCurrentTime(masterVideoId);
            for (var i = 0; i < videoIds.length; ++i) {
                var bufferedTimeRange = videojs(videoIds[i]).buffered();

                // number of different ranges of time have been buffered
                var numberOfRanges = bufferedTimeRange.length;
                // time in seconds when the first range starts
                var firstRangeStart = bufferedTimeRange.start(0);
                // time in seconds when the first range ends
                var firstRangeEnd = bufferedTimeRange.end(0);
                // length in seconds of the first time range
                var firstRangeLength = firstRangeEnd - firstRangeStart;

                if (bufferedTimeRange && (numberOfRanges > 0)) {
                    var duration = getDuration(videoIds[i]);
                    var currTimePlusBuffer = currTime + bufferInterval;
                    currTimePlusBuffer = (currTimePlusBuffer > duration) ? duration : currTimePlusBuffer;
                    allBuffered = allBuffered && (firstRangeLength >= currTimePlusBuffer);
                } else {
                    allBuffered = false;
                }
            }

            if (!allBuffered) {
                playWhenBuffered = true;
                ignoreNextPause = true;
				for (var i = 0; i < videoIds.length; ++i) {
                	pause(videoIds[i]);
				}
                hitPauseWhileBuffering = false;
                $(document).trigger("sjs:buffering", []);
            } else if (playWhenBuffered && !hitPauseWhileBuffering) {
                playWhenBuffered = false;
                play(masterVideoId);
                hitPauseWhileBuffering = false;
                $(document).trigger("sjs:bufferedAndAutoplaying", []);
            } else if (playWhenBuffered) {
                playWhenBuffered = false;
                $(document).trigger("sjs:bufferedButNotAutoplaying", []);
            }
        }, checkBufferInterval);
    }

    /**
     * Sets a master video id
     *
     * @param playerMasterVideoNumber the video number of the master video
     */
    function setMasterVideoId(playerMasterVideoNumber) {
        masterVidNumber = (playerMasterVideoNumber < videoIds.length) ? playerMasterVideoNumber : 0;
        masterVideoId = videoIds[masterVidNumber];
        $(document).trigger("sjs:masterSet", [masterVideoId]);
    }

    /**
     * Waits for data being loaded and calls a function
     *
     * @param videoId the video id
     * @param func function to call after data has been loaded
     */
    function doWhenDataLoaded(videoId, func) {
        videojs(videoId).on("loadeddata", function () {
            func();
        });
    }

    /**
     * Checks whether all videos have been initialized
     *
     * @return true if all videos have been initialized, false else
     */
    function allVideoIdsInitialized() {
        for (var i = 0; i < videoIds.length; ++i) {
            if (!videoIdsInit[videoIds[i]]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether all videos are ready
     *
     * @return true if all videos are ready, false else
     */
    function allVideoIdsReady() {
        for (var i = 0; i < videoIds.length; ++i) {
            if (!videoIdsReady[videoIds[i]]) {
                return false;
            }
        }
        return true;
    }

    function initialPlay() {
        var myPlayer = this;
        pause(getVideoId(this));
        startClicked = true;
    }

    function initialPause() {
        var myPlayer = this;
        pause(getVideoId(this));
        startClicked = false;
    }

    /**
     * @param masterVidNumber [0, n-1]
     * @param videoId1
     * @param videoId2
     * @param videoId3 - videoIdN [optional]
     */
    $.synchronizeVideos = function (playerMasterVidNumber, videoId1, videoId2) {
        masterVidNumber = playerMasterVidNumber;
        var validIds = true;
        for (var i = 1; i < arguments.length; ++i) {
            // check whether ids exist/are valid
            validIds = validIds && arguments[i] && ($("#" + arguments[i]).length);
            if (!validIds) {
                $(document).trigger("sjs:invalidId", [arguments[i]]);
            } else {
                videoIds[videoIds.length] = arguments[i];
                videoIdsReady[videoIds[i - 1]] = false;
                videoIdsInit[videoIds[i - 1]] = false;
            }
        }
        if (validIds && videoIds.length > 1) {
            for (var i = 0; i < videoIds.length; ++i) {
                $(document).trigger("sjs:idRegistered", [videoIds[i]]);
                var plMVN = playerMasterVidNumber;

                videojs(videoIds[i]).on("play", initialPlay);
                videojs(videoIds[i]).on("pause", initialPause);
                videojs(videoIds[i]).ready(function () {
                    var playerName = getVideoId(this);

                    videoIdsReady[playerName] = true;
                    doWhenDataLoaded(playerName, function () {
                        videoIdsInit[playerName] = true;

                        $(document).trigger("sjs:playerLoaded", [playerName]);

                        if (allVideoIdsInitialized()) {
                            setMasterVideoId(plMVN);
                            for (var i = 0; i < videoIds.length; ++i) {
                                videojs(videoIds[i]).off("play", initialPlay);
                                videojs(videoIds[i]).off("pause", initialPause);
                            }
                            registerEvents();
                            if (startClicked) {
                                play(masterVideoId);
                            }
                            $(document).trigger("sjs:allPlayersReady", []);
                        }
                    });
                });
            }
        } else {
            $(document).trigger("sjs:notEnoughVideos", []);
        }

        $(document).on("sjs:cleanBufferChecker", function () {
            window.clearInterval(bufferChecker);
        });
    }
})(jQuery);
