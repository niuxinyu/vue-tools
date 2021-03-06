import { CustomObj } from '@/types/base';
import { forIn } from '@/libs/tools';

const emptyStyle = document.createElement('div').style;

export const css = (
  function () {
    const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
    const cssProps: CustomObj<any> = {};

    function getVendorProp (prop: string): string {
      // create empty style
      // https://github.com/jquery/jquery/blob/6984d1747623dbc5e87fd6c261a5b6b1628c107c/src/css/finalPropName.js#L4
      // 如果在当前浏览器支持的style内 直接返回；如果不是当前浏览器内的style属性 则需要做差异化处理；
      if (prop in emptyStyle) return prop;

      // 差异化处理
      // 如果在不是标准的css样式 需要加上前缀
      let i = cssPrefixes.length;
      let vendorName;
      const capName = prop.charAt(0)
        .toUpperCase() + prop.slice(1);
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in emptyStyle) return vendorName;
      }
      return prop;
    }

    function camelCase (string: string) {
      // 将带有前缀的css属性 通通格式化为大写
      return string.replace(/^-ms-/, 'ms-')
        .replace(/-([a-z])/gi, (match: string, letter: string) => letter.toUpperCase());
    }

    function getStyleProp (prop: string): string {
      prop = camelCase(prop);
      return cssProps[prop] || (cssProps[prop] = getVendorProp(prop));
    }

    function applyCss (element: HTMLElement, prop: string, value: string) {
      prop = getStyleProp(prop);
      (element.style as any)[prop] = value;
    }

    return function (element: HTMLElement, properties: CustomObj<any>) {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments;
      let value;
      if (args.length === 2) {
        forIn(properties, (prop) => {
          value = properties[prop];
          // 必须保证 prop 不是对象内的属性 不能是继承自原型链的属性
          // 直接使用 properties 的 hasOwnProperty 方法在极端情况下会报错
          // https://juejin.cn/post/6844903881437085709
          if (value !== undefined) applyCss(element, prop, value);
        });
      }
      else {
        applyCss(element, args[1], args[2]);
      }
    };
  }());

// 处理类名
export function getClassList (element: HTMLElement): string {
  return (' ' + (element.classList || '') + ' ').replace(/\s+/gi, ' ');
}

export function hasClass (classList: string | HTMLElement, className: string): boolean {
  const list = typeof classList === 'string' ? classList : getClassList(classList as HTMLElement);
  return list.indexOf(' ' + className + ' ') >= 0;
}

export function addClass (element: HTMLElement, className: string): void {
  const oldClassList = getClassList(element),
    newClassList = oldClassList + className;
  if (hasClass(oldClassList, className)) return;
  element.className = newClassList.substring(1);
}

export function removeClass (element: HTMLElement, className: string): void {
  let newClassList = '';
  const oldClassList = getClassList(element);
  if (!hasClass(element, className)) return;
  newClassList = oldClassList.replace(' ' + className + ' ', ' ');
  element.className = newClassList.substring(1, newClassList.length - 1);
}

// 当前浏览器支持的位移方法
export function getPositioningCSS () {
  const vendorPrefix = ('WebkitTransform' in emptyStyle) ? 'Webkit'
    : ('MozTransform' in emptyStyle) ? 'Moz'
      : ('msTransform' in emptyStyle) ? 'ms'
        : ('OTransform' in emptyStyle) ? 'O' : '';
  if (vendorPrefix + 'Perspective' in emptyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
    return 'translate3d';
  }
  if (vendorPrefix + 'Transform' in emptyStyle) {
    // Browsers without 3D support, e.g. IE9
    return 'translate';
  }

  // Browsers without translate() support, e.g. IE7-8
  return 'margin';

}
