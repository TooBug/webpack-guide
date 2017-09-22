# TypeScript与Vue

> 本文适用于webpack 2+

## TypeScript（ts-loader）

要使用TypeScript的话，只需要将文件名后缀改成`.ts`，并引入`ts-loader`进行处理即可。

例如我们有一个TS文件：

```typescript
function a(num: number){
    return num+1;
}

console.log(a(5));
```

只需要在`webpack.config.js`中配置一下（注意这是webpack 2+的配置）：

```javascript
module:{
    rules:[{
        test: /\.ts$/,
        loader:'ts-loader',
    }]
}
```

即可。

## Vue单文件组件（vue-loader）

Vue为我们提供了单文件组件的写法，例如下面的`test.vue`：

```vue
<style>
    div{
        color:red;
    }
</style>
<template>
    <div>{{message}}</div>
</template>
<script>
import Vue from 'vue/dist/vue.esm.js';
new Vue({
    data: function(){
        return {
            message: 'hello'
        }
    }
});
</script>
```

这种写法需要使用`vue-loader`转换成纯JS文件才可以正常在浏览器中运行。和使用`ts-loader`类似，只要使用`vue-loader`处理即可，这里就不再演示。唯一值得注意的是`vue-loader`会需要同时安装几个模块，如果弄不清楚的话，安装`vue-loader`的时候留意一下npm的输出，把需要的模块都装上就可以了。

## TypeScript + Vue

基本用法就是同时加上`ts-loader`和`vue-loader`。但是`ts-loader`需要加上两个选项：

```javascript
options: {
    transpileOnly: true,
    appendTsSuffixTo: [/\.vue$/],
}
```

`transpileOnly`的含义是指让`ts-loader`只做转译。什么意思呢？就是不加这个选项的话，它会把转义的结果写入到文件中，而不是在内存中由webpack来处理，这会导致后续loader无法处理`ts-loader`的结果。所以加上`transpileOnly`让它按webpack的操作来，这样后续loader就可以继续处理。

`appendTsSuffixTo`的含义是碰到`.vue`结尾的文件时，加上`.ts`的后缀，这样`ts-loader`就会去处理`.vue`文件中的ts代码。

另外在使用TypeScript编写Vue代码时，可能会碰到一些类型上的问题，可以参见Vue的官方文档：<https://vuejs.org/v2/guide/typescript.html>