# 高级配置项

> 状态：草稿

## `output.publicPath`

一般情况下，用上面的配置就能搞定了。但如果你的网站稍大一点，可能需要引入CDN，而且很可能CDN还有一些很古怪的前缀，这个时候可以通过`output.publicPath`来搞定。

例如，在前面的例子中，输出的脚本路径是`dist/example4.1.js`，而在生产环境中访问的时候却有可能是`http://cdn.toobug.net/scripts/webpack_guide/dist/example4.1.js`。这种情况下，就需要使用`output.publicPath`来将前面的路径补全：

```javascript
output:{
	publicPath:'http://cdn.toobug.net/scripts/webpack_guide/'
}
```

这样发布到生产环境以后，就会到CDN上对应的路径去加载脚本了。

> 这个选项适用于各种非入口文件的场景，包括分片后的文件、loader加载文件时的路径、css中引入的图片资源文件路径等等。

## `output.library`、`output.libraryTarget`和`output.umdNamedDefine`

如我们在前面很多例子中看到的那样，webpack在打包的时候会将`entry`中配置的文件打包成一个在浏览器中直接运行的文件，也即我们前面定义过的“入口文件”。而如果我们想要的并不是入口文件，而是一个可供其它脚本再引用的类库要怎么办呢？此时就可以用`output.library`和`output.libraryTarget`来告诉webpack，我们想要的打包结果是一个类库。

> todo:介绍一下入口文件和类库一般有什么区别

首先看`output.library`，它被用来指定模块的名字，就像jQuery，它的模块名叫`jquery`，至于这个名字有什么用，马上就会看到。我们在后文中都以{Library}来代替它的值。

`output.libraryTarget`，它的意思是指定打包后的脚本如何导出模块。前面我们介绍过模块化规范，有AMD、CommonJS、UMD以及直接定义变量等等。这个选项即是指定用哪种方式来对模块内容进行导出。

它的可选项如下：

- 'var' 通过`var {Library} = xxx;`的方式导出模块，即定义（隐性）全局变量
- 'this' 通过`this[{Library}] = xxx;`的方式导出模块，其中this一般指向window，也是定义全局变量
- 'commonjs' 通过指定`exports`属性的方式导出模块，例如`exports[{Library}] = xxx;`，引用的时候需要`require('xxx.js')[{Library}]`才能引用到`xxx`。
- 'commonjs2' 通过指定`module.exports`的方式导出模块，例如`module.exports = xxx;`，引用的时候直接使用`require('xxx.js')`即可引用到`xxx`。




