const path = require('path');

module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, 'src/')
		},
		resolve: {
			mainFiles: [ 'index', 'Index' ],
			extensions: [ '.js', '.jsx' ]
		}
	}
};
