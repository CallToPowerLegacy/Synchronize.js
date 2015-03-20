module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jsbeautifier: {
            files: [
                "Gruntfile.js", "src/synchronize.js",
                "examples/plainhtml5/css/main.css", "examples/plainhtml5/index.html", "examples/plainhtml5/js/main.js",
                "examples/videojs/css/main.css", "examples/videojs/css/video-js.css", "examples/videojs/css/videojs.thumbnails.css", "examples/videojs/index.html", "examples/videojs/js/main.js"
            ],
            options: {
                html: {
                    braceStyle: "collapse",
                    indentChar: " ",
                    indentScripts: "keep",
                    indentSize: 4,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    unformatted: ["a", "sub", "sup", "b", "i", "u"],
                    wrapLineLength: 0
                },
                css: {
                    indentChar: " ",
                    indentSize: 4
                },
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        jshint: {
            files: ["Gruntfile.js", "src/synchronize.js", "examples/plainhtml5/js/main.js", "examples/videojs/js/main.js"],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        uglify: {
            options: {
                banner: "/**\n * Synchronize.js\n * Compiled on <%= grunt.template.today('dd.mm.yyyy') %>\n * Version 1.2.2\n *\n *  Copyright (C) 2013-2015 Denis Meyer, calltopower88@googlemail.com\n *  This program is free software; you can redistribute it and/or modify\n *  it under the terms of the GNU Lesser General Public License as published by\n *  the Free Software Foundation; either version 2 of the License, or\n *  (at your option) any later version.\n *\n *  This program is distributed in the hope that it will be useful,\n *  but WITHOUT ANY WARRANTY; without even the implied warranty of\n *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n *  GNU Lesser General Public License for more details.\n *\n *  You should have received a copy of the GNU Lesser General Public License along\n *  with this program; if not, write to the Free Software Foundation, Inc.,\n *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.\n */\n"
            },
            dist: {
                files: {
                    "Build/synchronize-min.js": ["src/synchronize.js"]
                }
            }
        },
        copy: {
            examples: {
                files: [{
                    expand: true,
                    src: ["examples/**"],
                    dest: "Build/"
                }]
            },
            synchronize: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["src/synchronize.js"],
                    dest: "Build"
                }]
            },
            synchronizeMin: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/synchronize-min.js"],
                    dest: "src"
                }]
            },
            synchronizeToPlainExample: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/synchronize-min.js"],
                    dest: "Build/examples/plainhtml5/js"
                }]
            },
            synchronizeToVideojsExample: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/synchronize-min.js"],
                    dest: "Build/examples/videojs/js"
                }]
            },
            txt: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["EVENTS.md", "README.md", "TODO.md", "LGPL2.1-LICENSE.txt", "LGPL3.0-LICENSE.txt"],
                    dest: "Build/"
                }]
            }
        },
        watch: {
            files: ["<%= jshint.files %>"],
            tasks: ["jshint"]
        },
        clean: {
            build: ["Build"]
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["jsbeautifier", "jshint"]);
    grunt.registerTask("cleanup", ["clean:build"]);
    grunt.registerTask("build", ["clean:build", "jsbeautifier", "jshint", "uglify", "copy"]);
};
