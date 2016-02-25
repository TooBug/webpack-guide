module.exports = {
	module:{
		loaders:[
			{ test: require.resolve('./example1.2'), loader: "exports?Hello" }
		]
	}
};
