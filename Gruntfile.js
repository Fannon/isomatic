module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['sass', 'uglify']);
    grunt.registerTask('default', ['build', 'watch']);
};
