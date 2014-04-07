/* global module */
module.exports = function(grunt) {

    "use strict";


    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: ['src/bower_components/foundation/scss']
            },
            dist: {
                options: {
                    outputStyle: 'extended'
                },
                files: {
                    'src/css/app.css': 'src/scss/app.scss'
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/**/*.js'
            ]
        },

//        jasmine: {
//            pivotal: {
//                src: 'src/js/**/*.js',
//                options: {
//                    specs: 'spec/*Spec.js',
//                    helpers: 'spec/*Helper.js',
//                    vendor: [
//                        'src/bower_components/underscore/underscore.js',
//                        'src/bower_components/backbone/backbone.js',
//                        'src/bower_components/d3js/build/d3.v3.js',
//                        'src/bower_components/jquery/dist/jquery.js'
//
//                    ]
//                }
//            }
//        },

        clean: {
            dist: {
                src: ['dist/*']
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd:'src/',
                    src: ['favicon.ico', 'img/**', 'fonts/**', '**/*.html', '!**/*.scss', '!bower_components/**'],
                    dest: 'dist/'
                }]
            },
            qunit: {
                files: [{
                    expand: true,
                    cwd:'src/bower_components/qunit/qunit/',
                    src: ['qunit.css', 'qunit.js'],
                    dest: 'test/lib/'
                }]
            }
        },

        uncss: {
            dist: {
                files: {
                    '.tmp/concat/css/app.min.css': ['src/**/*.html', '!src/bower_components/**']
                }
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            }
        },

        useminPrepare: {
            html: ['src/**/*.html', '!src/bower_components/**'],
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/**/*.html', '!src/bower_components/**'],
            css: ['dist/css/**/*.css'],
            options: {
                dirs: ['dist']
            }
        },

        connect: {
            src: {
                options: {
                    port: 9000,
                    base: 'src/',
                    livereload: true
                }
            },
            dist: {
                options: {
                    port: 9001,
                    base: 'dist/',
                    keepalive: true,
                    livereload: false
                }
            }
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
                tasks: ['sass', 'concat']
            },
            livereload: {
                files: ['src/**/*.html', '!src/bower_components/**', 'src/js/**/*.js', 'src/css/**/*.css', 'src/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-uncss');

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['connect:src', 'sass', 'watch']);
    grunt.registerTask('build', ['jshint', 'sass', 'clean:dist', 'useminPrepare', 'copy:dist', 'concat', 'cssmin', 'uglify']);

};
