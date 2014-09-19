Synchronize.js - Events
=======================

## Trigger

#### `sjs:notEnoughVideos`
- Parameters
	- /
- Description
	- When not enough videos have been given to synchronize

#### `sjs:invalidId`
- Parameters
	- ID(invalid)
		- ID of the invalid argument
- Description
	- When an invalid ID occured (ignoring the ID)

#### `sjs:idRegistered`
- Parameters
	- ID(registered)
		- ID of the registered argument
- Description
	- When a valid ID has been registered

#### `sjs:playerLoaded`
- Parameters
	- ID(player)
		- ID of the player
- Description
	- When player has been fully loaded (only thrown when using video.js)

#### `sjs:masterSet`
- Parameters
	- ID(master)
		- ID of the master
- Description
	- When a master has been set

#### `sjs:allPlayersReady`
- Parameters
	- /
- Description
	- When all players are ready

#### `sjs:masterPlay`
- Parameters
	- currentTime(master)
		- Current time of the master
- Description
	- When master starts playing

#### `sjs:masterPause`
- Parameters
	- currentTime(master)
		- Current time of the master
- Description
	- When master pauses

#### `sjs:masterEnded`
- Parameters
	- currentTime(master)
		- Duration of the master
- Description
	- When master ends

#### `sjs:masterTimeupdate`
- Parameters
	- currentTime(master)
		- Current time of the master
- Description
	- When a master timeupdate occurs

#### `sjs:synchronizing`
- Parameters
	- currentTime(master)
		- Current time of the master
	- ID(slaveToSynchronize)
		- ID of the slave to be synchronized
- Description
	- When a slave is being synchronized with the master

#### `sjs:buffering`
- Parameters
	- /
- Description
	- When Videos are buffering (=pausing due to buffering)

#### `sjs:bufferedAndAutoplaying`
- Parameters
	- /
- Description
	- When buffered and autoplaying

#### `sjs:bufferedButNotAutoplaying`
- Parameters
	- /
- Description
	- When Buffered, but not autoplaying

## Listener

#### `sjs:debug`
- Parameters
	- debug
		- true to print debug output to the console, false else
- Description
	- Sets the debug flag

#### `sjs:play`
- Parameters
	- /
- Description
	- Plays the master video

#### `sjs:pause`
- Parameters
	- /
- Description
	- Pauses the master video

#### `sjs:setCurrentTime`
- Parameters
	- time
		- New time of the master
- Description
	- Tries to set the current time

#### `sjs:synchronize`
- Parameters
	- /
- Description
	- Forced synchronization of all slaves with the master (normally does not have to be done manually)

#### `sjs:startBufferChecker`
- Parameters
	- /
- Description
	- Starts the buffer checker (does not have to be done manually if not called 'sjs:cleanBufferChecker')

#### `sjs:stopBufferChecker`
- Parameters
	- /
- Description
	- Unregisters the buffer checker
