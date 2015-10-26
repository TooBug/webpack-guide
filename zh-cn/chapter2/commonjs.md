# CommonJS模块打包

经过前面非模块化和AMD打包的例子，本节我们就不再绕圈子，直接看例子。

HTML代码和之前仍然是一样的，不再重复，JS文件如下：

入口文件`example1.1.js`：

```javascript
var example2 = require('./example1.2');
example2.sayHello();
```

被依赖的`example1.2.js`：

```javascript
var me = {
    sayHello:function(){
        alert('hello world!');
    }
};
module.exports = me;
```

同样使用webpack编译就能看到相同的弹窗。

我们直接来看编译后的代码<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/commonjs/bundle1.1.js>：

呃。是不是惊呆了？前41行Runtime仍然长得那个鸟样，而后面的两个模块代码，几乎和我们编写时完全一样！！唯一的改动是`require`被替换成了`__webpack_require__`了。

那就假装webpack是天然支持CommonJS的吧。所以通过这个例子也能感觉到，在使用webpack的项目中，使用CommonJS规范会省事很多。

