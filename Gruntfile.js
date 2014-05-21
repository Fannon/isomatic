/* global module, require */
module.exports = function(grunt) {

    "use strict";

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /** Production JavaScript Header Comment */
/*        banner: '*//*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT *//*\n',*/

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

        /** QUnit Unit Testing */
        qunit: {
            all: {
                options: {
                    timeout: 5000,
                    urls: ['http://localhost:9000/test/index.html']
                }
            }
        },

        /** JavaScript Linting */
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['Gruntfile.js']
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: ['src/js/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
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
            html: ['src/index.html'],
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html'],
            css: ['dist/css/**/*.css'],
            options: {
                dirs: ['dist']
            }
        },

        htmlbuild: {
            src: 'dist/index.html',
            dest: 'dist/',
            options: {
                sections: {
                    help: 'src/html/help.html'
                }
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
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: 'src/js/**/*.*',
                tasks: ['jshint:src']
            },
            test: {
                files: 'test/**/*.*',
                tasks: ['jshint:test']
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
        },

        /** Puts some more Infos to the console */
        content: {
            options: {
                newLineAfter: false,
                gruntLogHeader: false
            },
            useminPrepare: {
                text: "\n###################################################\n### PREPARING HTML REFACTORING\n###################################################"
            },
            usemin: {
                text: "\n###################################################\n### HTML REFACTORING\n###################################################"
            },
            jshint: {
                text: "\n###################################################\n### LINTING JAVASCRIPT\n###################################################"
            },
            concat: {
                text: "\n###################################################\n### CONCATNATING JAVASCRIPT\n###################################################"
            },
            clean: {
                text: "\n###################################################\n### CLEANING OLD FILES\n###################################################"
            },
            uglify: {
                text: "\n###################################################\n### MINIFY JAVASCRIPT\n###################################################"
            },
            cssmin: {
                text: "\n###################################################\n### MINIFY CSS\n###################################################"
            },
            sizediff: {
                text: "\n###################################################\n### COMPARING NEW SIZE\n###################################################"
            },
            connect: {
                text: "\n###################################################\n### STARTING LOCALHOST WEBSERVER\n###################################################"
            },
            htmlbuild: {
                text: "\n###################################################\n### IMPORT TEMPLATES\n###################################################"
            },
            copy: {
                text: "\n###################################################\n### COPYING FILES\n###################################################"
            },
            sass: {
                text: "\n###################################################\n### COMPILING SASS \n###################################################"
            },
            done: {
                text: "\n###################################################\n### GRUNT COMPLETED \n###################################################"
            }
        }

    });


    grunt.registerTask('default', [
        'connect:src',
        'sass',
        'watch'
    ]);

    grunt.registerTask('test', [
        'content:connect', 'connect',
        'content:jshint', 'jshint',
        'content:test', 'qunit'
    ]);

    grunt.registerTask('build', [
        'content:clean', 'clean',
        'content:jshint', 'jshint',
        'content:sass', 'sass',
        'content:useminPrepare', 'useminPrepare',
        'content:copy', 'copy:dist',
        'content:concat', 'concat',
        'content:cssmin', 'cssmin',
        'content:uglify', 'uglify',
        'content:usemin', 'usemin',
        'content:htmlbuild', 'htmlbuild',
        'content:done'
    ]);
};
