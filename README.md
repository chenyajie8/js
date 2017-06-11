# JavaScript期末大作业 

## 目前最好的JavaScript异步方案async await

构建一个应用程序总是会面对异步调用，不论是在 Web 前端界面，还是 Node.js 服务端都是如此，JavaScript 里面处理异步调用一直是非常恶心的一件事情。以前只能通过回调函数，后来渐渐又演化出来很多方案，最后 Promise 以简单、易用、兼容性好取胜，但是仍然有非常多的问题。其实 JavaScript 一直想在语言层面彻底解决这个问题，在 ES6 中就已经支持原生的 Promise，还引入了 Generator 函数，终于在 ES7 中决定支持 async 和 await。

### 基本语法

async/await 究竟是怎么解决异步调用的写法呢？简单来说，就是将异步操作用同步的写法来写。先来看下最基本的语法：async 表示`这是一个async函数`，`await只能用在这个函数里面`。await 表示在这里`等待promise返回结果`了，再继续执行。await 后面跟着的`应该是一个promise对象`

```js
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = async () => {
  const t = await f();
  console.log(t);
};

testAsync();
```

首先定义了一个函数 `f` ，这个函数返回一个 Promise，并且会延时 2 秒， `resolve` 并且传入值 123。 `testAsync` 函数在定义时使用了关键字 `async` ，然后函数体中配合使用了 `await` ，最后执行 `testAsync` 。整个程序会在 2 秒后输出 123，也就是说 `testAsync` 中常量 `t` 取得了 `f` 中 `resolve` 的值，并且通过 `await` 阻塞了后面代码的执行，直到 `f` 这个异步函数执行完。



await等待的虽然是promise对象，但不必写`.then(..)`，直接可以得到返回值。

```javascript
var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // 返回 ‘ok’
            resolve('ok');
        }, time);
    })
};

var start = async function () {
    let result = await sleep(3000);
    console.log(result); // 收到 ‘ok’
};
```

### 一个例子

Async/Await应该是目前最简单的异步方案了，首先来看个例子。

这里我们要实现一个暂停功能，输入N毫秒，则停顿N毫秒后才继续往下执行。

```javascript
var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

var start = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    await sleep(3000);
    console.log('end');
};

start();
```

控制台先输出`start`，稍等`3秒`后，输出了`end`。

### 对比 Promise

仅仅是一个简单的调用，就已经能够看出来 async/await 的强大，写码时可以非常优雅地处理异步函数，彻底告别回调恶梦和无数的 `then` 方法。我们再来看下与 Promise 的对比，同样的代码，如果完全使用 Promise 会有什么问题呢？

```javascript
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
    }, 2000);
  });
};

const testAsync = () => {
  f().then((t) => {
    console.log(t);
  });
};

testAsync();
```

从代码片段中不难看出 Promise 没有解决好的事情，比如要有很多的 `then`方法，整块代码会充满 Promise 的方法，而不是业务逻辑本身，而且每一个 `then` 方法内部是一个独立的作用域，要是想共享数据，就要将部分数据暴露在最外层，在 `then` 内部赋值一次。虽然如此，Promise 对于异步操作的封装还是非常不错的，所以 `async/await` 是基于 Promise 的， `await` 后面是要接收一个 Promise 实例。

### 异常处理

通过使用 async/await，我们就可以配合 try/catch 来捕获异步操作过程中的问题，包括 Promise 中 reject 的数据。

```javascript
const f = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(234);
    }, 2000);
  });
};

const testAsync = async () => {
  try {
    const t = await f();
    console.log(t);
  } catch (err) {
    console.log(err);
  }
};

testAsync();
```

代码片段中将 `f` 方法中的 `resolve` 改为 `reject` ，在 `testAsync` 中，通过`catch` 可以捕获到 `reject` 的数据，输出 err 的值为 234。 `try/catch` 使用时也要注意范围和层级。如果 `try` 范围内包含多个 `await` ，那么 `catch` 会返回第一个 `reject` 的值或错误。

```javascript
const f1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(111);
    }, 2000);
  });
};

const f2 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(222);
    }, 3000);
  });
};

const testAsync = async () => {
  try {
    const t1 = await f1();
    console.log(t1);
    const t2 = await f2();
    console.log(t2);
  } catch (err) {
    console.log(err);
  }
};

testAsync();
```

如代码片段所示， `testAsync` 函数体中 `try` 有两个 `await` 函数，而且都分别 `reject` ，那么 `catch` 中仅会触发 `f1` 的 `reject` ，输出的 err 值是 111。

```javascript
var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // 模拟出错了，返回 ‘error’
            reject('error');
        }, time);
    })
};

var start = async function () {
    try {
        console.log('start');
        await sleep(3000); // 这里得到了一个返回错误
        
        // 所以以下代码不会被执行了
        console.log('end');
    } catch (err) {
        console.log(err); // 这里捕捉到错误 `error`
    }
};
```

既然`.then(..)`不用写了，那么`.catch(..)`也不用写，可以直接用标准的`try catch`语法捕捉错误。

### 循环多个await

await看起来就像是同步代码，所以可以理所当然的写在`for`循环里，不必担心以往需要`闭包`才能解决的问题。

```javascript
..省略以上代码

var start = async function () {
    for (var i = 1; i <= 10; i++) {
        console.log(`当前是第${i}次等待..`);
        await sleep(1000);
    }
};
```

值得注意的是，`await`必须在`async函数的上下文中`的。

```javascript
..省略以上代码

let 一到十 = [1,2,3,4,5,6,7,8,9,10];

//错误示范
一到十.forEach(function (v) {
    console.log(`当前是第${v}次等待..`);
    await sleep(1000); // 错误!! await只能在async函数中运行
});

//正确示范
for(var v of 一到十) {
    console.log(`当前是第${v}次等待..`);
    await sleep(1000); // 正确, for循环的上下文还在async函数中
}
```
## vue.js 轻巧、高性能的前端组件化方案

### 基本信息

vue是法语中视图的意思，vue.js是一个轻巧、高性能、可组件化的MVVM库，同时拥有非常容易上手的API。

### 安装

使用npm安装：

```javascript
npm install vue
```

当然你也可以在github上clone最新的版本并作为单文件引入，或者使用CDN:

```
http://cdn.jsdelivr.net/vue/1.0.7/vue.min.js
http://cdnjs.cloudflare.com/ajax/libs/vue/1.0.7/vue.min.js
```

### 一个例子

app.html:

```html
<div id="app">
    <div>{{message}}</div>
    <input type="text" v-model="message">
</div>
```

app.js:

```javascript
new Vue({
    el:'#app',
    data: {
        message:'hello vue.js.'
    }
});
```

在使用Vue.js之前，我们需要先像这样实例化一个Vue对象：

```javascript
new Vue({
   el:'#app'
});
```



### 响应的数据绑定

vue.js 的核心是一个响应的数据绑定系统，它让数据与 DOM 保持同步非常简单。

```html
<!--html页面-->
<div id="example">
    hello {{name}}
</div>
```

```javascript
//js文件
var exampleData = {
  name: 'Vue.js'
}

// 创建一个 Vue 实例或 "ViewModel"
// 它连接 View 与 Model
var exampleVM = new Vue({
  el: '#example',
  data: exampleData
})
```

![Vue.js 快速入门](http://static.open-open.com/lib/uploadImg/20151109/20151109171527_549.png)

就像HelloWorld展示的那样，app.html是view层，app.js是model层，通过vue.js（使用v-model这个指令）完成中间的底层逻辑，实现绑定的效果。改变其中的任何一层，另外一层都会改变。

### 指令

指令 (Directives) 是特殊的带有前缀 v- 的特性。指令的值限定为**绑定表达式**，因此上面提到的 JavaScript 表达式及过滤器规则在这里也适用。指令的职责就是当其表达式的值改变时把某些特殊的行为应用到 DOM 上.

#### v-on指令用于监听 DOM 事件

```html
<!--html页面-->
<div id="example">
    <p>{{msg}}</p>
    <button v-on:click="change">hello</button>
</div>
```

```javascript
//js文件

var vm = new Vue({
  el: '#example',
  data:{
        msg:"first"
   },
   method:{
       change:function(){
              this.msg = "second"
        }, 
   }, 
})
```

#### v-bind 指令用于响应地更新 HTML 特性

```html
<!--html页面-->
<div id="example">
    <!--绑定url-->
    <a v-bind:href="url"></a>

    <!--绑定class-->
    <div v-bind:class="classA"></div>
</div>
```

```javascript
//js文件
var vm = new Vue({
    el:"example",
    data:{
        url:"http://cn.vuejs.org/",
        classA:"container",
    },
})
```

#### v-for指令用于渲染列表

这个指令使用特殊的语法，形式为item in items，items 是数据数组，item 是当前数组元素的别名.

```html
<!--html页面-->
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
```

```javascript
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

#### v-model指令用于数据双向绑定

```html
<!--html页面-->
<div id="example">
    <span>Message is: {{ message }}</span>
    <br>
    <input type="text" v-model="message" placeholder="edit me">
</div>
```

```javascript
//js文件
var vm = new Vue({
    el:"example",
    data:{
        message:'',
    },
})
```

#### v-if条件渲染

```html
<div id ="example">
    <h1 v-if="ok">Yes</h1>
    <h1 v-else>No</h1>
     <button v-on:click="changeOk">hello</div>
</div>
```

```javascript
var vm = new Vue({
    el:"example",
    data:{
        ok:true,
    },
    methods:{
        changeOk:function(){
            this.ok = false
        }
    }
})
```



### 总结

在发布之初，Vue.js原本是着眼于轻量的嵌入式使用场景。在今天，Vue.js也依然适用于这样的场景。由于其轻量（22kb min+gzip）、高性能的特点，对于移动场景也有很好的契合度。更重要的是，设计完备的组件系统和配套的构建工具、插件，使得Vue.js在保留了其简洁API的同时，也已经完全有能力担当起复杂的大型应用的开发。



## Vue原理解析之Virtual Dom

`DOM`是文档对象模型(`Document Object Model`)的简写，在浏览器中我们可以通过js来操作`DOM`，但是这样的操作性能很差，于是`Virtual Dom`应运而生。我的理解，`Virtual Dom`就是在js中模拟`DOM`对象树来优化`DOM`操作的一种技术或思路。

### VNode对象

一个VNode的实例对象包含了以下属性

![img](https://segmentfault.com/img/bVITKL?w=419&h=458)

- `tag`: 当前节点的标签名

- `data`: 当前节点的数据对象，具体包含哪些字段可以参考vue源码`types/vnode.d.ts`中对`VNodeData`的定义

- `children`: 数组类型，包含了当前节点的子节点

- `text`: 当前节点的文本，一般文本节点或注释节点会有该属性

- `elm`: 当前虚拟节点对应的真实的dom节点

- `ns`: 节点的namespace

- `context`: 编译作用域

- `functionalContext`: 函数化组件的作用域

- `key`: 节点的key属性，用于作为节点的标识，有利于patch的优化

- `componentOptions`: 创建组件实例时会用到的选项信息

- `child`: 当前节点对应的组件实例

- `parent`: 组件的占位节点

- `raw`: raw html

- `isStatic`: 静态节点的标识

- `isRootInsert`: 是否作为根节点插入，被`<transition>`包裹的节点，该属性的值为`false`

- `isComment`: 当前节点是否是注释节点

- `isCloned`: 当前节点是否为克隆节点

- `isOnce`: 当前节点是否有`v-once`指令

  ## VNode分类

  ![img](https://segmentfault.com/img/bVITTR?w=495&h=540)

`VNode`可以理解为vue框架的虚拟dom的基类，通过`new`实例化的`VNode`大致可以分为几类

- `EmptyVNode`: 没有内容的注释节点
- `TextVNode`: 文本节点
- `ElementVNode`: 普通元素节点
- `ComponentVNode`: 组件节点
- `CloneVNode`: 克隆节点，可以是以上任意类型的节点，唯一的区别在于`isCloned`属性为`true`

### createElement解析

```javascript
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

function createElement (context, tag, data, children, normalizationType, alwaysNormalize) {
  // 兼容不传data的情况
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  // 如果alwaysNormalize是true
  // 那么normalizationType应该设置为常量ALWAYS_NORMALIZE的值
  if (alwaysNormalize) normalizationType = ALWAYS_NORMALIZE
  // 调用_createElement创建虚拟节点
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (context, tag, data, children, normalizationType) {
  /**
   * 如果存在data.__ob__，说明data是被Observer观察的数据
   * 不能用作虚拟节点的data
   * 需要抛出警告，并返回一个空节点
   * 
   * 被监控的data不能被用作vnode渲染的数据的原因是：
   * data在vnode渲染过程中可能会被改变，这样会触发监控，导致不符合预期的操作
   */
  if (data && data.__ob__) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // 当组件的is属性被设置为一个falsy的值
  // Vue将不会知道要把这个组件渲染成什么
  // 所以渲染一个空节点
  if (!tag) {
    return createEmptyVNode()
  }
  // 作用域插槽
  if (Array.isArray(children) &&
      typeof children[0] === 'function') {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 根据normalizationType的值，选择不同的处理方法
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  // 如果标签名是字符串类型
  if (typeof tag === 'string') {
    let Ctor
    // 获取标签名的命名空间
    ns = config.getTagNamespace(tag)
    // 判断是否为保留标签
    if (config.isReservedTag(tag)) {
      // 如果是保留标签,就创建一个这样的vnode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
      // 如果不是保留标签，那么我们将尝试从vm的components上查找是否有这个标签的定义
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // 如果找到了这个标签的定义，就以此创建虚拟组件节点
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // 兜底方案，正常创建一个vnode
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
    // 当tag不是字符串的时候，我们认为tag是组件的构造类
    // 所以直接创建
  } else {
    vnode = createComponent(tag, data, context, children)
  }
  // 如果有vnode
  if (vnode) {
    // 如果有namespace，就应用下namespace，然后返回vnode
    if (ns) applyNS(vnode, ns)
    return vnode
  // 否则，返回一个空节点
  } else {
    return createEmptyVNode()
  }
}
```

### patch原理

`patch`函数接收6个参数：

- `oldVnode`: 旧的虚拟节点或旧的真实dom节点
- `vnode`: 新的虚拟节点
- `hydrating`: 是否要跟真是dom混合
- `removeOnly`: 特殊flag，用于`<transition-group>`组件
- `parentElm`: 父节点
- `refElm`: 新节点将插入到`refElm`之前

`patch`的策略是：

1. 如果`vnode`不存在但是`oldVnode`存在，说明意图是要销毁老节点，那么就调用`invokeDestroyHook(oldVnode)`来进行销毁

2. 如果`oldVnode`不存在但是`vnode`存在，说明意图是要创建新节点，那么就调用`createElm`来创建新节点

3. 当`vnode`和`oldVnode`都存在时

   - 如果`oldVnode`和`vnode`是同一个节点，就调用`patchVnode`来进行`patch`
   - 当`vnode`和`oldVnode`不是同一个节点时，如果`oldVnode`是真实dom节点或`hydrating`设置为`true`，需要用`hydrate`函数将虚拟dom和真是dom进行映射，然后将`oldVnode`设置为对应的虚拟dom，找到`oldVnode.elm`的父节点，根据vnode创建一个真实dom节点并插入到该父节点中`oldVnode.elm`的位置

   这里面值得一提的是`patchVnode`函数，因为真正的patch算法是由它来实现的（patchVnode中更新子节点的算法其实是在`updateChildren`函数中实现的，为了便于理解，我统一放到`patchVnode`中来解释）。

### 生命周期

`patch`提供了5个生命周期钩子，分别是

- `create`: 创建patch时
- `activate`: 激活组件时
- `update`: 更新节点时
- `remove`: 移除节点时
- `destroy`: 销毁节点时

这些钩子是提供给Vue内部的`directives`/`ref`/`attrs`/`style`等模块使用的，方便这些模块在patch的不同阶段进行相应的操作，这里模块定义在`src/core/vdom/modules`和`src/platforms/web/runtime/modules`2个目录中

`vnode`也提供了生命周期钩子，分别是

- `init`: vdom初始化时
- `create`: vdom创建时
- `prepatch`: patch之前
- `insert`: vdom插入后
- `update`: vdom更新前
- `postpatch`: patch之后
- `remove`: vdom移除时
- `destroy`: vdom销毁时

vue组件的生命周期底层其实就依赖于vnode的生命周期，在`src/core/vdom/create-component.js`中我们可以看到，vue为自己的组件vnode已经写好了默认的`init`/`prepatch`/`insert`/`destroy`，而vue组件的`mounted`/`activated`就是在`insert`中触发的，`deactivated`就是在`destroy`中触发的