module.exports = function(grunt) {
    "use strict";


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    port: 8888,
                    base: ''
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'js/app.min.js': [
                        'bower_components/jquery/jquery.js',
                        'bower_components/foundation/js/foundation.min.js',
                        'bower_components/underscore/underscore-min.js',
                        'bower_components/backbone/backbone-min.js',
                        'bower_components/backbone.validation/dist/backbone-validation.js',
                        'bower_components/handlebars/handlebars.min.js',
                        'bower_components/d3js/build/d3.v3.min.js',
                        "bower_components/colpick/colpick.js",
                        "bower_components/slimScroll/jquery.slimscroll.min.js",
                        "js/lib/innersvg.js",
                        "js/main.js",
                        "js/router.js",
                        "js/iconLibrary.js",
                        "js/isotypeLayout.js",
                        "js/models/*",
                        "js/views/*"
                    ]
                }
            }
        },

        sass: {
            options: {
                includePaths: ['bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'css/app.css': 'scss/app.scss'
                }
            }
        },

        jshint: {
            all: [
            'Gruntfile.js',
            'js/main.js',
            'js/iconLibrary.js',
            'js/isotypeLayout.js',
            'js/router.js',
            'js/models/*.js',
            'js/views/*.js']
        },

        jsdoc : {
            dist : {
                src: ['js/*.js', 'js/models/*.js', 'js/views/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },

            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass']
            }
        }
    });


    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['jshint', 'uglify']);
    grunt.registerTask('default', ['connect', 'sass', 'watch']);
};
