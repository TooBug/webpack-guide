# imports-loader

> 状态：草稿

imports，顾名思义是导入的意思，这个loader的作用与exports-loader刚好相反，是用来将其它模块导入到当前模块中。这个loader常常在处理一些非模块化规范编写的文件时被用到。

## 背景

举个简单的例子，有模块`b`，依赖全局变量`window.a`，那么在没有使用模块化规范的情况下，有可能它的代码中会直接写`a`：

```javascript
// 模块b直接依赖全局变量a
a.xxx();
```

而如果`a`经过webpack打包，则很有可能不会暴露全局变量，此时就需要使用imports-loader来对`a`进行导入。

## 使用

> todo:例子

```javascript
require('imports?$=jquery!./example.js');

require('imports?$=jquery,angular,config=>{size:50}!./file.js');
```

## 典型使用场景

- 为jQuery插件注入$变量 `imports?$=jquery`
- 自定义angular `imports?angular`
- 让umd模块检测不到define方法从而避免使用amd规范 `imports?define=>false`
- 将模块中的`this`还原为`window` `imports?this=window`

一目了然，不再解释。

本文全部示例代码见<https://github.com/TooBug/webpack-guide/tree/master/examples/chapter4/exports-loader/example1>。
