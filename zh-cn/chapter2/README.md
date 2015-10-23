# 第二章 webpack入门

与require.js / sea.js不同，webpack是一个在开发阶段进行打包的模块化工具，也就是说它无法不经过打包直接在线上使用。

webpack同时兼容AMD、Common.js以及非模块化的写法。注意这里的同时兼容可不是指你可以任选一种，而是……你可以同时用三种！

当然你可能会说，谁他X同时用三种模块化方案？执念（就是神经病的意思）吧？

Yes，如果你是一个全新的项目，当然不应该如此规划，但如果是一个已经换了几拨人，跑了好多年的老项目，可能情况就没那么理想了。而这种情况下webpack也能比较从容的应对。简单说，适应性超强的。

而webpack之所以好用，正是因为有诸如此类超出预期的特性，有可能你不需要，但如果你想要的时候就会爽得不要不要的。

webpack基于Node.js编写，在进入下文前，请确保已正确安装Node.js。后文中我们可能会使用全局安装的webpack或者gulp来完成打包，因此建议全局安装好webpack和gulp，后文不再解释。

```sh
npm install -g webpack gulp
```

> 由于是全局安装，在Mac/Linux下，如果碰到`EACCES`错误，则可能需要在前面加`sudo`才能安装成功。
> 
> 由于众所周知的原因，国内使用npm有时候不太顺利，可以考虑使用淘宝的镜像。
>
> ```npm install -g webpack gulp --registry=http://registry.npm.taobao.org```

闲话不多说，咱们走着！