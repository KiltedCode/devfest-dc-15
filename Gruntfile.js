module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs: {
            src: 'app/components'
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                src: ['<%= dirs.src %>/app.js', '<%= dirs.src %>/*/*.js'],
                dest: 'dev/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                stripBanners: true,
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                files: {
                    'dev/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // default tasks
    grunt.registerTask('default', ['concat', 'uglify']);

};