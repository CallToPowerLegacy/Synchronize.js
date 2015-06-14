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
                banner: "/**\n * <%= pkg.name %>\n * Compiled on <%= grunt.template.today('dd.mm.yyyy') %>\n * Version <%= pkg.version %>\n *\n *  Copyright (C) <%= pkg.year %> <%= pkg.author.name %>, <%= pkg.author.email %>\n * All rights reserved.\n\n * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:\n * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.\n * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.\n * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.\n\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,\n * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS\n * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE\n * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,\n * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n*/\n"
            },
            dist: {
                files: {
                    "Build/src/synchronize-min.js": ["src/synchronize.js"]
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
                    dest: "Build/src"
                }]
            },
            synchronizeMin: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/src/synchronize-min.js"],
                    dest: "src"
                }]
            },
            synchronizeToPlainExample: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/src/synchronize-min.js"],
                    dest: "Build/examples/plainhtml5/js"
                }]
            },
            synchronizeToVideojsExample: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["Build/src/synchronize-min.js"],
                    dest: "Build/examples/videojs/js"
                }]
            },
            txt: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ["EVENTS.md", "README.md", "TODO.md", "LICENSE.txt"],
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
