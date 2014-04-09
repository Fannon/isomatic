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

        clean: {
            dist: {
                src: ['dist/*']
            },
            temp: {
                src: ['.tmp/*']
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
                src: ['src/js/*.js', 'src/js/models/*.js', 'src/js/views/*.js'],
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
                files: 'src/scss/**/*.scss',
                tasks: ['sass']
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

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['connect:src', 'sass', 'watch']);
    grunt.registerTask('build', ['clean', 'jshint', 'sass', 'useminPrepare', 'copy:dist', 'concat', 'cssmin', 'uglify', 'usemin']);
};
