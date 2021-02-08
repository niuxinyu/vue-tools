import { CustomObj } from '@/types/base';

const typesMap = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regExp',
  '[object Undefined]': 'undefined',
  '[object Null]': 'null',
  '[object Object]': 'object',
} as CustomObj<string>;

export function typeOf (source: any): string {
  const toString = Object.prototype.toString;
  return typesMap[toString.call(source)];
}

/**
 * @date 2020/12/28
 * @desc: 比较安全的for in
 * @author niu
 */
export function forIn (obj: CustomObj<any>, cb: (key: string) => void): void {
  for (const key in obj) {
    if (key && Object.prototype.hasOwnProperty.call(obj, key)) {
      cb(key);
    }
  }
}

/**
 * @date 2020/12/28
 * @desc: 节流
 * @author niu
 */

export function throttle (fn: (params?: any) => void, timer = 200) {
  let canRun = true;
  return function (this: typeof fn, ...rest: any) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, rest);
      canRun = true;
    }, timer);
  };
}

/**
 * @date 2020/12/28
 * @desc: 防抖
 * @author niu
 */
export function debounce (fn: (params?: any) => void, timer = 500) {
  let timeout: NodeJS.Timeout;
  return function (this: typeof fn, ...rest: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, rest);
      // fn(rest);
    }, timer);
  };
}

// 唯一id
export const getUniqueId = (len = 8): string => {
  const $char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const maxPos = $char.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line no-bitwise
    str += $char.charAt(Math.random() * maxPos | 0);
  }
  return str;
};

// 简易深克隆
export const simpleDeepClone = (source: any) => JSON.parse(JSON.stringify(source));

// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/explicit-module-boundary-types
export function noop () {
}
