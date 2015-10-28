。## Node和NPM

咦，明明在说前端代码，怎么突然要说Node和NPM？等等，哪里有说我在说前端代码？明明说的是JS代码。

好吧，前面的例子的确是在说前端代码，而且本指南全篇都将聚焦前端代码，但现在一个明显的趋势是前后端越来越趋向于融合，因此了解一些和Node/NPM的知识对于我们日常开发是有好处的。

上面的都是大道理，具体的事实大致有这些：

1. NPM已经不再是node package manager，而只是一个包管理软件，在NPM的愿景中是有前端代码这一块的
2. 越来越多的前端库也选择将代码发布到npm，包括jQuery / Angular / react等
3. 前端开发已经高度依赖于Node带来的生态端，比如各种各样的工具
4. 由于CommonJS在前端开发中应用的成熟，复用Node的代码成为可能（且越来越方便）

## Node模块和前端使用的CommonJS

Node使用的模块规范也是CommonJS，所以理想情况下，是可以做到代码在Node和浏览器中复用的。但这里面有几处关键的差异可能导致无法复用：

1. Node的模块在运行时会有一个包裹函数，下面详述
2. 浏览器并不支持所有的Node模块，因此部分使用了Node API的模块无法在浏览器中运行

首先我们来看一下Node模块在运行的时候真相是怎样的，假设我们有如下模块`example1.1.js`：

```javascript
var me = {};
module.exports = me;
```

这是一个非常简单的Node模块。不知道大家在写Node模块的时候是否有好奇过，这里的`module`（以及`require` / `exports` / `__filename` / `__dirname`）是从哪里来的？因为按照对JS的认知，如果它不是一个局部变量（含函数形参）的话，那么只能是全局变量了。

难道这些变量是全局变量？然而当我们打开Node的命令行去访问的时候又明明白白地告诉我们是`undefined`：

```sh
> console.log(global.exports)
undefined

> console.log(global.__dirname)
undefined

```

> 按照Node的文档，`global.require`确实是存在的，还有`.cache` / `.resolve()`等成员，但每个模块中使用的`require`仍然是局部变量，并非全局`require`。

这到底是怎么回事呢？如果在运行的时候去查看它的话，它会变成这样：

```javascript
(function (exports, require, module, __filename, __dirname) {
    var me = {};
    module.exports = me;
});
```

> 可以使用`node-inspector`去远程调试Node代码，于是就能看到模块运行时的真实代码。

可以看到，我们的模块代码在运行的时候是被包裹了一层的，而上面列的这些变量正是在这个包裹函数中作为形参传入的。

其中`module`指向模块本身，`module.exports`和`exports`是等价的，表示模块要导出供调用的内容，`__filename`表示当前模块的文件名，`__dirname`表示当前模块所在路径。

webpack也为这些包裹函数带来的新变量（形参）提供了模拟。

