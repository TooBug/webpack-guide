# expose-loader

> 状态：草稿

expose是暴露的意思，那么expose-loader的作用即是将变量暴露到window对象下成为全局变量。

## 使用

```javascript
require('expose?GLOBAL_VAR!example.js');
```

在使用expose-loader之后，模块原本要导出的内容（`module.exports`）会被暴露到全局变量中，而全局变量的名字则是上面示例中的`GLOBAL_VAR`。这个全局变量的名字是可以自己定义的。

例如官方有一个示例，将`React`暴露到全局变量：

```javascript
require('expose?React!react');
```

要将模块导出的内容暴露给多个全局变量的话，可以使用多次expose-loader：

```javascript
expose?$!expose?jQuery!
```

todo: 与exports-loader结合使用
