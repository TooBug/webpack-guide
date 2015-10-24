# AMD模块打包

## 初试牛刀

webpack对AMD提供了比较完善的支持。我们同样以一个例子开始：

`example1.1.html`：

```html
<html>
<head>
	<title>webpack.toobug.net</title>
	<script src="./bundle1.1.js"></script>
</head>
<body>
</body>
</html>
```

`example1.1.js`：

```javascript
define([
],function(){
    alert('hello world!');
});
```

同样使用webpack进行编译，用法和前文使用的完全一样：

```sh
webpack example1.1.js bundle1.1.js
```

同样打开HTML文件，同样弹出“hello world!”的弹窗。（这里就不截图了。）

## 解析

我们同样打开编译后的文件分析一下，请用力点击<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/amd/bundle1.1.js>。

可以看到，编译（就是打包的意思，后文可能会乱入，请习惯）后的文件有53行（非模块化的例子中是50行），结构仍然是一个Runtime + 模块数组，而且1到41行和前面非模块化的例子是完全一样的。

第45行即第一个模块的包裹函数，与前面非模块化的例子相比，多了一个`__webpack_require__`参数（也就是前一节说的，如果有必要的话，还有`require`参数的意思）。如果在源文件中有使用`require`引用其它模块的话，那么使用`require`的地方经过编译之后都会变成`__webpack_require__`。关于这一点，后面会涉及到的时候会有更详细的论述，此处就不再深入。

第45至52行之间即是模块本身了，当然也包含了包裹函数。如果智商正常的话，应该还是会觉得这个模块有点鬼斧神工吧？哦，也就是晦涩难懂的意思。我们稍微整理一下：

```javascript
function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, // AMD依赖列表
		__WEBPACK_AMD_DEFINE_RESULT__; // AMD factory函数的返回值，即模块内容

	__WEBPACK_AMD_DEFINE_ARRAY__ = [];

	// 执行factory函数，获取返回值作为模块内容
	// 函数体使用.apply调用，函数体中this为exports
	// 形参则分别对应依赖列表中的各个依赖模块
	__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    alert('hello world!');
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__);

	// 如果模块内容不为空，则通过module.exports返回
	// 如果为空，则不处理，在Runtime中声明为{}
	if(__WEBPACK_AMD_DEFINE_RESULT__ !== undefined){
		module.exports = __WEBPACK_AMD_DEFINE_RESULT__;
	}

}
```

可以看到，尽管我们的例子中并没有声明什么依赖，但webpack还是为AMD模块做了很多准备工作，比如获取依赖模块内容并传给factory函数之类。主要逻辑在上面代码的例子中已经注释，就不再多解释。

值得注意的是，在模块的最后，仍然是通过`module.exports`导出模块内容的，而Runtime中则不管是否AMD都完全一样。这种在不同模块化方案下打包后结构高度统一的方案为webpack带来了诸多好处，因为webpack只需要在模块入口导出这一块处理好不同模块化的差异即可，对后续的模块加载和优化等等都打下了坚实的基础。当然，目前可能还感觉不到这些好处，但是到目前为止，你应该可以非常直观地感觉到，webpack的确能同时支持多种模块化方案混合使用。

> 为何webpack能同时使用多种模块化（及非模块化）方案的模块而传统的require.js / sea.js之类的方案则不行？这是因为webpack对模块的处理是在编译阶段，针对每一个模块都可以针对性地分析，然后对不同方案加以不同的包裹方案，最后生成可供浏览器运行的代码。而require.js之类的方案必须保证在运行时阶段能正确地引入模块并运行。
> 
> 以require.js为例，在不做包裹的情况下，require.js完全无法感知非模块化JS文件的运行状态和结果，因此无法纳入其管理体系。
> 
> 此外，require.js必须在全局定义`require`和`define`方法，而如果此时使用`<script>`引入使用UMD定义的模块，则无法正常工作，因为模块会认为当前是AMD环境，而AMD模块无法使用`<script>`直接引入。关于这一点，后续在讲解jQuery的时候会有详细说明。

## AMD依赖

在上一节中，我们并没有涉及到“依赖声明”这件事情，因为在非模块化的写法下，并不存在依赖声明这回事，如果文件B依赖文件A，则需要手工在HTML中引用A和B，而且必须保证A在B之前引入。

而AMD的诞生初衷之一就是为了解决依赖声明，因此本例中我们也会涉及到依赖声明。



