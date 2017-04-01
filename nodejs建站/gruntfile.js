module.exports = function(grunt){


	grunt.initConfig({
		watch : {
			ejs : {
				files : ["views/**/*.ejs"],
				options : {
					livereload : true
				}
			},
			js : {
				files : ["static/**/**/*.js","models/*.js","schemas/*.js"],
				// tasks : ["jshint"],
				options : {
					livereload : true
				}
			}
		},

		nodemon : {
			dev: {
	          script: 'app.js',
	          options: {
	               args: [],
	               nodeArgs: ['--debug'],
	               ignore: ['README.md', 'node_modules/**', '.DS_Store'],
	               ext: 'js',
	               watch: ['./'],
	               delay: 1000,
	               env: {
	                    PORT: '8000'
	               },
	               cwd: __dirname
	          }
	     	}
		},

		concurrent : {
			tasks : ["nodemon","watch"],
			options : {
				logConcurrentOutput : true
			}
		} 
	})

	// 加载安装的文件
	// 文件修改 删除 就会重新执行
	grunt.loadNpmTasks("grunt-contrib-watch");
	// 对app的安装，监控可自动重启 
	grunt.loadNpmTasks("grunt-nodemon");
	grunt.loadNpmTasks("grunt-concurrent");

	// 配置 不会因为一些错误，而阻断整个grunt
	grunt.option("force",true);
	// 创建一个任务

	grunt.registerTask("default",["concurrent"]);
}