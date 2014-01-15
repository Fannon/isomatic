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
                        'bower_components/foundation/js/foundation.min.js',
                        'bower_components/underscore/underscore-min.js',
                        'bower_components/backbone/backbone-min.js',
                        'lib/innersvg.js',
                        'js/main.js',
                        'js/options.js',
                        'js/ui.js',
                        'js/data.js',
                        'js/isotypeLayout.js',
                        'js/visualisation.js',
                        'js/defaultIcons.js'
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

        jsdoc : {
            dist : {
                src: ['js/*.js', 'js/models/*.js', 'js/views/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },

        watch: {
            grunt: { files: ['Gruntfile.js'] },

            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass']
            }

//            js:  { files: 'js/*.js', tasks: [ 'uglify' ] }
        }
    });


    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['connect', 'sass']);
    grunt.registerTask('default', ['build', 'watch']);
};
