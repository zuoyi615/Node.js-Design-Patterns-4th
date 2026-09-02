import { PassThrough, type Readable as NodeReadable, type Writable as NodeWritable } from 'stream';

// 定义流生成函数的类型签名
export type StreamFactory<T> = (this: T, options?: any) => T;

/**
 * 拦截方法，在第一次调用时触发回调（用于延迟初始化）
 */
function beforeFirstCall<T extends object, K extends keyof T>(
  instance: T,
  method: K,
  callback: (this: T, ...args: any[]) => void
): void {
  const originalMethod = instance[method];

  instance[method] = function (this: T, ...args: any[]) {
    // 1. 恢复或删除拦截，确保下一次直接调用原生逻辑
    if (originalMethod) {
      instance[method] = originalMethod;
    } else {
      delete instance[method];
    }

    // 2. 执行回调（在此处实例化真正的流并建立管道）
    callback.apply(this, args);

    // 3. 执行真正的流方法
    if (typeof instance[method] === 'function') {
      return (instance[method] as Function).apply(this, args);
    }
  } as any;
}

/**
 * 现代 ES6+ Class 与 TypeScript 改造
 */
export class Readable extends PassThrough {
  constructor(fn: StreamFactory<NodeReadable>, options?: any) {
    // 确保可以通过 new 关键字或直接函数调用（兼容旧版无需 new 的写法）
    if (!(new.target)) {
      return new Readable(fn, options);
    }

    super(options);

    // 延迟初始化可读流
    beforeFirstCall(this, '_read', function (this: Readable) {
      try {
        const source = fn.call(this, options);

        // 3. 现代 Node.js 边缘问题优化：错误向前传递与生命周期销毁
        const emitError = this.emit.bind(this, 'error');
        source.on('error', emitError);

        // 当底层流销毁时，同步销毁包装流
        source.on('close', () => this.destroy());
        this.on('close', () => source.destroy());

        source.pipe(this);
      } catch (err) {
        this.emit('error', err);
      }
    });

    // 触发可读就绪状态
    this.emit('readable');
  }
}

export class Writable extends PassThrough {
  constructor(fn: StreamFactory<NodeWritable>, options?: any) {
    if (!(new.target)) {
      return new Writable(fn, options);
    }

    super(options);

    // 延迟初始化可写流
    beforeFirstCall(this, '_write', function (this: Writable) {
      try {
        const destination = fn.call(this, options);

        // 3. 现代 Node.js 边缘问题优化：错误向前传递与生命周期销毁
        const emitError = this.emit.bind(this, 'error');
        destination.on('error', emitError);

        // 维持双向销毁状态，避免文件描述符或内存泄漏
        destination.on('close', () => this.destroy());
        this.on('close', () => destination.destroy());

        this.pipe(destination);
      } catch (err) {
        this.emit('error', err);
      }
    });

    this.emit('writable');
  }
}

/**
 * NOTE: Pattern:
 * to resolve error: EMFILE, too many open files, we can use lazy stream
 * alternative: `lazystream` package, implemented by monkey-patch
 */
