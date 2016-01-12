var webpack = require('webpack');

module.exports = {
    entry:{
        main1:'./main',
        main2:'./main.2'
    },
    output:{
        filename:'bundle.[name].js'
    },
    /*plugins: [
        new  webpack.optimize.CommonsChunkPlugin({
		name:'main1',
		chunks: ['main1', 'main2'],
		async:true
	})*/
    ]
};
