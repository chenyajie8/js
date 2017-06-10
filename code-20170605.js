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




var start = async function () {
    for (var i = 1; i <= 10; i++) {
        console.log(`当前是第${i}次等待..`);
        await sleep(1000);
    }
};





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



