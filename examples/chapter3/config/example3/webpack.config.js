module.exports = {
    entry:{
    	'example3.1':'./example3.1',
    	'example3.2':'./example3.2'
    },
    output:{
        //filename:'[name].js'
        //filename:'[name]-[hash].js'
        filename:'[name]-[chunkhash].js'
    }
};
