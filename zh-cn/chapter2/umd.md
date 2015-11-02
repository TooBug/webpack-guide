# UMD模块打包

按理说，分别讲完非模块化、AMD、CommonJS的打包后，并没有必要再专门引入一篇讲UMD打包的。但因为UMD的实现中依赖一些特殊的变量，因此还是提一下。

首先回顾一下UMD的模块定义：

```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));
```

上面的代码来自<https://github.com/umdjs/umd/blob/master/returnExports.js>。我们按这样的方式来定义一个模块`example1.1.js`（去掉了对`b`的依赖），看看webpack会如何处理。

打包后的代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/umd/bundle1.1.js>，可以看到，使用UMD声明的模块会默认按照AMD的方式去打包。而核心的一句就是第48行，原本是

```javascript
if (typeof define === 'function' && define.amd) {
```

被webpack直接替换成了
```javascript
if (true) {
```

可见webpack还是相当聪明的！既满足了AMD的判断条件，又没有真的在全局注入`define`变量，这样就不会像require.js一样，一旦引入就无法再使用`<script>`引入UMD脚本。

如果你希望webpack不要使用AMD的方式引入，而是使用CommonJS的方式的话，则需要指定让webpack不按AMD的方式去解析，具体方法则是使用`imports-loader`。

关于loader，后面会有详细解释，这里只说怎么用。首先`npm init`然后`npm install imports-loader --save`安装依赖，接下来在打包时加一些参数：

```sh
webpack example1.1.js bundle1.2.js --module-bind 'js=imports?define=>false' 
```

意思是针对`.js`文件，使用`imports-loader`，传给loader的参数是`define=>false`，即定义`define`为`false`，这样模块就不会使用AMD的方式打包了。imports-loader的参数具体含义可参见[文档](https://github.com/webpack/imports-loader)。

打包后的代码见<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/umd/bundle1.2.js>，如我们所愿，AMD的条件判断不再是`true`。因为没有`define`变量，又因为在模块的包裹函数中传了`module`且`module.exports`存在，所以最终这个模块会按CommonJS的方式被使用。


