Build
------

1. Change to the project's root directory.
2. Install project dependencies with npm install.
3. Run Grunt with grunt.

Building Synchronize.js requires the following tools:

- npm (included in the node.js distribution)
- grunt
- grunt plugins
  - jsbeautifier
  - grunt-contrib-jshint
  - grunt-contrib-copy
  - grunt-contrib-uglify
  - grunt-contrib-watch
  - grunt-contrib-clean


There are three grunt profiles, one for the development, one for shipping and one for cleaning up:


1. Check/test files after changes in the development process
  - grunt
  - the tasks are:
    - beautify (css files included)
    - jshint tests

2. Check/test and build for production use
  - grunt build
  - the tasks are:
    - copy&paste and modify required files
    - beautify (css files included)
    - jshint tests
    - minifies the file(s)

3.Clean up the build:
  - grunt cleanup
