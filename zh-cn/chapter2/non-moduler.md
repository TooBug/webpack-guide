# 非模块化文件打包

为了演示webpack的强大，我们将首先演示非模块化文件打包。

## Demo

首先准备一个HTML（`example1.1.html`）：

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

> 前面解释过，webpack是一个开发时进行打包的工具，因此我们需要准备两份文件，一份是用于开发维护的源码，一份则是由webpack打包生成的文件。
>
> 在这个示例中，我们关注源码就好。如果是放到实际项目中，则也需要仔细规划打包后文件的路径。

首先我们使用非模块化的方案，准备我们的源文件`example1.1.js`：

```javascript
alert('hello world');
```

接下来使用webpack将它打包：


```sh
cd {index.html所在目录}
webpack example1.1.js bundle1.1.js
```

此时就可以看到目录下生成了一个`bundle1.1.js`，正是我们在html中引用的JS文件。

访问一下`example1.1.html`，则可以看到我们的弹出框。

![1.1.1](../images/chapter2/non-moduler/1.1.1.png)

## 解析

看到这里，你可能会开始怀疑人生了：你真的不是在逗我玩吗？这么简单一个demo，我直接引用源文件不就好了？干嘛要用webpack打包，多此一举？

这个问题，我也无法回答你，非模块化的文件被模块化打包工具支持，本来就是一件很神奇的事情。至于初衷，我也只能想到是为了让开发者能更低成本地迁移到webpack上来。

不过，为了保证我真的没有忽悠你，我们还是可以看一看打包之后的文件：<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/non-moduler/bundle1.1.js>。可以看到，一个原本1行的JS文件被打包成了一个50行的文件。而这剩下的49行到底是什么呢？我们简单解析一下：

整体上看，文件被分为两个部分：第1至41行，是一个函数定义，这也就是官方文档中提到的**Runtime**，作用是保证模块的顺利加载和运行。第45至49行则是我们原来写的JS文件，只是被包裹了一个函数，也就是**模块**。运行的时候模块是作为Runtime的参数被传进去的，也就是这样的形式：

```javascript
(function(modules){
	// Runtime
})([
	// 模块数组
])
```

这里面特别值得注意的一点是第20行和第45行。

```javascript
// 第20行
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

// 第45行
function(module, exports) {
```

其中第45行是模块被包裹的函数，给了`module`和`exports`参数。（如果有需要的话，还会给出`require`参数。）而这两个参数本质上都是Runtime中定义的`module.exports`，是一个空对象（第14行）。这样就实现了使用Common.js的方式来定义模块返回值。不过由于我们还在讨论非模块化的文件，就不深入。

真正值得注意的是第20行，使用了`.call`，第一个参数是`module.exports`，这就导致模块的包裹函数的作用域中的`this`指向了`module.exports`。这会带来两个后果：

1. 模块中无法使用`this`指代全局变量（浏览器中就是`window`）
2. 模块中可以使用`this.xxx`来指定模块包含的成员，类似Common.js中`exports.xxx`的方式（感觉我们找到了除AMD/Common.js之外的另一种模块化规范，不过因为webpack官方并没有强调这个，我们也只是代过。）

## 影响

当然，聪明的你肯定早就意识到了另一个更明显的结果，即模块不是暴露在全局作用域下了。也即通过`var xxx`的方式定义的`xxx`变量不再挂在全局对象下。这可能是在非模块化的代码迁移到webpack中碰到的最大的问题，需要手工将`var xxx`的定义方式改为`window.xxx`。

同样，由于模块源码是采用非模块化的方案编写的，因此没有通过AMD的`return`或者CommonJS的`exports`或者`this`导出模块本身，这会导致模块被引入的时候只能执行代码而无法将模块引入后赋值给其它模块使用。

例如上面的`example1.1.js`，当我们引入的时候（以CommonJS为例），`var a = require('example1.1');`，此时`a`为`undefined`。

你可能觉得这样好像没什么意义是吧？但是事实上有大量的模块是用这种方式编写的，包括著名的Angular.js（1.4以下），这会导致无法直接使用`var angular = require('angular')`来引入`angular`，需要通过额外的方式来做（exports-loader），后面详述。

