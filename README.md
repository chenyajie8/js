# JavaScript期末大作业 

## JavaScript语言新动向：async await

### 目前最好的JavaScript异步方案async await

构建一个应用程序总是会面对异步调用，不论是在 Web 前端界面，还是 Node.js 服务端都是如此，JavaScript 里面处理异步调用一直是非常恶心的一件事情。以前只能通过回调函数，后来渐渐又演化出来很多方案，最后 Promise 以简单、易用、兼容性好取胜，但是仍然有非常多的问题。其实 JavaScript 一直想在语言层面彻底解决这个问题，在 ES6 中就已经支持原生的 Promise，还引入了 Generator 函数，终于在 ES7 中决定支持 async 和 await。

#### 基本语法

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

#### 一个例子

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

#### 对比 Promise

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

#### 异常处理

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

#### 循环多个await

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

// 错误示范
一到十.forEach(function (v) {
    console.log(`当前是第${v}次等待..`);
    await sleep(1000); // 错误!! await只能在async函数中运行
});

// 正确示范
for(var v of 一到十) {
    console.log(`当前是第${v}次等待..`);
    await sleep(1000); // 正确, for循环的上下文还在async函数中
}
```