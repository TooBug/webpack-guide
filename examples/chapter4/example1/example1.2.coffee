class Hello
	constructor: (@name) ->

	sayHello: () ->
		alert "hello #{@name}"

module.exports = new Hello 'world'
