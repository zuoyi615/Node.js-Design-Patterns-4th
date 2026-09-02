/**
 * 1. Promise/A+ 是什么?
 * 2. then 为什么可以链式调用?
 * 3. then 返回 Promise 时为什么会等待它?
 * 4. 为什么要防止循环引用
 * 5. thenable 是什么?
 * 6. 如何实现一个 Promise
 *
 * Promise/A+ 是一个社区规范，用于指导实现 Promise, 每个 Promise 必须有一个 then() 方法，用于不同方案之间的 Promise 可以互相转换
 * 
 * 有 then() 方法的对象，可以称为 thenable, 它不一定是 Promise 对象，但其 then() 方法如果可以像 Promise 的 then() 方法那样工作，就认为它有 .then()
 * 
 * Promise/A+ 本质是在规定: 
 *    1. 一个 Promise 的结果是如何 "传递" 和 "展开"的
 *    2. Promise 的 then 方法如何工作
 *
 * Promise 有三种状态:
 *    1. pending
 *    2. fulfilled
 *    3. rejected
 *
 *    状态流转只能: pending --> fulfilled/rejected; fulfilled --x rejected ; rejected --x fulfilled
 *
 * Promise/A+ 最重要的规则: then() 方法执行后必须返回一个新的 Promise
 */

// Promise/A+ 最重要的规则: then() 方法执行后必须返回一个新的 Promise
{
  const promise1 = Promise.resolve(8)
  const promise2 = promise1.then(v => v ** 2)
  console.log(promise1 === promise2) // false
}

// 为什么要返回一个新的 Promise
{
  const p1 = Promise.resolve(1)
  const p2 = p1.then(v => v ** 2)
  const p3 = p2.then(v => console.log(v))

  // p1.then() --> p2 --> p2.then() --> p3 --> p3.then() --> ...
  // p1 --> p2 --> p3 // Promise 链
  // 因为每一个 Promise 都有 then() 方法，所以可以链式调用
}


// then(cb) 中的回调要返回什么
{
  const p1 = Promise.resolve()
  // const p2 = p1.then(() => x) // 这个 x 有哪些情况
  // 四种情况:
  // 1. 普通值: string/number/obejct/boolean
  // 2. Promise
  // 3. thenable
  // 4. 抛出异常
  //
  // 根据 x 的不同类型，决定返回 p2 最终的状态, 这个过程叫 Promise Resolution Procedure
  // 定义一个函数: resolvePromise(promiseNext, x)
}

// 第一种情况: x 是普通值
{
  const p1 = Promise.resolve()
  const p2 = p1.then(() => 2)
  // p2 直接 fulfilled(2) 相当于 resolve(2)
}

// 第二种情况: x 是抛出错误
{
  const p1 = Promise.resolve()
  const p2 = p1.then(() => {
    throw new Error('this is an error message')
  })
  // p2 直接 rejected(error) 相当于 rejecte(2)
}

// 第三种情况: x 是 Promise
{
  const p1 = Promise.resolve()
  const p2 = p1.then(() => {
    const innerPromise = Promise.resolve(2)
    return innerPromise
  })
  // p2 等待 innerPromise fulfilled(2) --> p2.then() 里面拿到值后再 fulfilled(2)
  // 所以如果 then 返回一个 Promise 新的 Promise (p2) 必须 adopt / follow 它的状态
}

// 第四种情况: x 是 thenable
{
  // 一个拥有 then() 方法的对象, thenable, dock typing
  // 如果它看起来像 Promise
  // 如果它有 then 方法
  // 那么尝试按照 Promise 处理
  const o = {
    then(resolve: (v: any) => void) {
      setTimeout(() => {
        resolve(2)
      }, 4000)
    }
  }

  Promise.resolve().then(() => o).then(console.log)

  console.log(o instanceof Promise) // false

  const p1 = Promise.resolve()
  const p2 = p1.then(() => {
    const innerPromise = Promise.resolve(2)
    return innerPromise
  })
  // p2 等待 innerPromise fulfilled(2) --> p2.then() 里面拿到值后再 fulfilled(2)
  // 所以如果 then 返回一个 Promise 新的 Promise (p2) 必须 adopt / follow 它的状态
}

// Promise Resolution Procedure
{
  const promise = Promise.resolve(1)

  // 在 then() 方法的返回时，大概有这么个类似的方法, 解析如何处理返回值，并生成新的 Promise
  function resolvePromise(currentPromise: Promise<any>, x: any) {
    if (currentPromise === x) {
      // reject(new TypeError('Chaining cycle detected'))
    }
  }

  // 1. currentPromise 和 x 不能是同一个对象，否则会造成循环依赖
  // 2. x 如果是是一个 Promise, x 的状态会决定 currentPromise 的状态：
  //    x --> fulfilled(value) --> currentPromise --> fulfilled(value)
  //    x --> rejected(error) --> currentPromise --> rejected(error)
  //    x --> pending --> currentPromise --> pending
  //    这个过程就叫 promise adoption/follow
  // 3. 如果 x 是 thenable
  // 4. 防止 thenable 同时调用 resolve 和 reject
  // 5. 读取 then 属性本身可能抛异常

  // 3. 如果 x 是 thenable
  const x = {
    then(resolve: (v: any) => void, reject?: (e: Error) => void) {
      resolve(2)
    }
  }

  x.then(y => resolvePromise(promise, y)) // 这里是递归展开(resolve)

  // 4. 防止 thenable 同时调用 resolve 和 reject
  const thenable = {
    then(resolve: (v: any) => void, reject: (Error: Error) => void) {
      resolve(1) // 只有第一次调用生效
      reject(new Error())
    }
  }

  let called = false

  function then(onFulfiled: (v: any) => void, onRejected: (error: Error) => void) {
    // TODO:
  }

  then.call(
    x,
    (y: any) => {
      if (called) return
      called = true
      resolvePromise(promise, y)
    },
    (reason: Error) => {
      if (called) return
      called = true
      // reject(reason)
    }
  )


  // 5. 读取 then 属性本身可能抛异常
  const obj = {
    get then() {
      throw new Error('boom')
    }
  }

  try {
    const then = obj.then
  } catch (e) {
    // reject(e)
  }
}
