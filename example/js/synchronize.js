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
    var synchInterval = 1000; // ms
    var seekAhead = 0; // seek to "time + seekAhead" because of the video.js buffering
    var synchGap = 1;

    var bufferCheckerSet = false;
    var bufferChecker;
    var checkBufferInterval = 2000; // ms
    var playWhenBuffered = false;
    var ignoreNextPause = false;
    var hitPauseWhileBuffering = false;
    var bufferInterval = 1; // s

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

    /**
     * Checks whether a number is in an interval [lower, upper]
     *
     * @param num the number to check
     * @param lower lower check
     * @param upper upper check
     * @return true if num is in [lower, upper], false else
     */
    function isInInterval(num, lower, upper) {
        if (num && lower && upper && (lower <= upper)) {
            return ((num >= lower) && (num <= upper));
        } else {
            return false;
        }
    }

    /**
     * Play video
     *
     * @param id video id
     * @return true if id is not undefined and video plays, -1 else
     */
    function play(id) {
        if (id) {
            return videojs(id).play();
        } else {
            return -1;
        }
    }

    /**
     * Set video volume
     *
     * @param id video id
     * @param vol the volume
     * @return true if id is not undefined and volume has been set, -1 else
     */
    function setVolume(id, vol) {
        if (id && vol) {
            return videojs(id).volume(vol);
        } else {
            return -1;
        }
    }

    /**
     * Pause video
     *
     * @param id video id
     * @return true if id is not undefined and video has been paused, -1 else
     */
    function pause(id) {
        if (id) {
            return videojs(id).pause();
        } else {
            return -1;
        }
    }

    /**
     * Check whether video is paused
     *
     * @param id video id
     * @return id is not undefined and whether is paused, false else
     */
    function isPaused(id) {
        if (id) {
            return videojs(id).paused();
        } else {
            return false;
        }
    }

    /**
     * Returns the video duration
     *
     * @param id video id
     * @return duration if id is not undefined, -1 else
     */
    function getDuration(id) {
        if (id) {
            return videojs(id).duration();
        } else {
            return -1;
        }
    }

    /**
     * Returns the current time in the video
     *
     * @param id video id
     * @return current time if id is not undefined, -1 else
     */
    function getCurrentTime(id) {
        if (id) {
            return videojs(id).currentTime();
        } else {
            return -1;
        }
    }

    /**
     * Returns a video.js id
     *
     * @param videojsVideo the video.js video object
     * @return video.js id if videojsVideo is not undefined, "" else
     */
    function getVideoId(videojsVideo) {
        if (videojsVideo) {
            return videojsVideo.Q;
        } else {
            return "";
        }
    }

    /**
     * Seeks in video
     *
     * @param id video id
     * @param time time to seek to
     * @param true if id is not undefined and time is in interval and successfully seeked, false else
     */
    function seek(id, time) {
        if (id && time && (time >= 0) && (time <= getDuration(id))) {
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
                if ((ct1 != -1) && (ct2 != -1) && !isInInterval(ct2, ct1 - synchGap, ct1 + synchGap)) {
                    log("Synchronizing. Master@" + ct1 + ", slave@" + ct2);
                    if (!seek(videoIds[i], ct1 + seekAhead)) {
                        pause(videoIds[i]);
                    }
                }
            }
        }
    }

    /**
     * Registers master events on all slaves
     *
     * @return true if allVideoIdsInitialized and events have been set, false else
     */
    function registerEvents() {
        if (allVideoIdsInitialized()) {
            var masterPlayer = videojs(masterVideoId);
            masterPlayer.on("play", function () {
                hitPauseWhileBuffering = false;
                if (!bufferCheckerSet) {
                    bufferCheckerSet = true;
                    setBufferChecker();
                }
                for (var i = 0; i < videoIds.length; ++i) {
                    if (videoIds[i] != masterVideoId) {
                        setVolume(videoIds[i], 0);
                        play(videoIds[i]);
                    }
                }
            });

            masterPlayer.on("pause", function () {
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
                hitPauseWhileBuffering = true;
                for (var i = 0; i < videoIds.length; ++i) {
                    if (videoIds[i] != masterVideoId) {
                        synchronize();
                        pause(videoIds[i]);
                    }
                }
            });

            masterPlayer.on("timeupdate", function () {
                hitPauseWhileBuffering = true;
                var now = Date.now();
                if (((now - lastSynch) > synchInterval) || isPaused(masterVideoId)) {
                    lastSynch = now;
                    var video;
                    var paused;
                    for (var i = 0; i < videoIds.length; ++i) {
                        if (videoIds[i] != masterVideoId) {
                            paused = isPaused(videoIds[i]);
                            synchronize();
                            if (paused) {
                                pause(videoIds[i]);
                            }
                        }
                    }
                }
            });

            return true;
        } else {
            pause(masterVideoId);
            return false;
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

            console.log("inside");

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
                log("Not every player has buffered, yet. Pausing...");
                playWhenBuffered = true;
                ignoreNextPause = true;
                pause(masterVideoId);
                hitPauseWhileBuffering = false;
            } else if (playWhenBuffered && !hitPauseWhileBuffering) {
                log("Every player has buffered now. Starting playing again...");
                playWhenBuffered = false;
                play(masterVideoId);
                hitPauseWhileBuffering = false;
            } else if (playWhenBuffered) {
                log("Every player has buffered now, but there was a timeupdate, pause, ... event...");
                playWhenBuffered = false;
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
        log("Master player set: '" + masterVideoId + "'");
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
                log("Invalid ID: '" + arguments[i] + "'. Ignoring.");
            } else {
                videoIds[videoIds.length] = arguments[i];
                videoIdsReady[videoIds[i - 1]] = false;
                videoIdsInit[videoIds[i - 1]] = false;
            }
        }
        if (validIds && videoIds.length > 1) {
            for (var i = 0; i < videoIds.length; ++i) {
                log("Collected player ID: '" + videoIds[i] + "' (ready: " + videoIdsReady[videoIds[i]] + ", initialized: " + videoIdsInit[videoIds[i]] + ")");
                var plMVN = playerMasterVidNumber;
                videojs(videoIds[i]).ready(function () {
                    var playerName = getVideoId(this);
                    videoIdsReady[playerName] = true;
                    doWhenDataLoaded(playerName, function () {
                        videoIdsInit[playerName] = true;

                        log("Player data loaded: '" + playerName + "'" + " (ready: " + videoIdsReady[playerName] + ", initialized: " + videoIdsInit[playerName] + ")");

                        if (allVideoIdsInitialized()) {
                            log("All players have been successfully initialized.");
                            setMasterVideoId(plMVN);
                            registerEvents();
                        }
                    });
                });
            }
        } else {
            log("To synchronize videos, there have to be at least two of them.");
        }

        // ATTENTION: REMOVE FOR RELEASE!
        $("#buttonBufferChecker").click(function () {
            window.clearInterval(bufferChecker);
        });
    }
})(jQuery);

