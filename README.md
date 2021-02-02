# 一些插件

## 图片预览插件

### 使用

```javascript
import VueTools from '@niu_/vue-tools';
import '@niu_/vue-tools/css/main.css'

Vue.use(VueTools);
```

单文件中可以通过组件 `Preview` 形式或者 `this.$preview` 访问

```vue

<Preview
    v-model="show"
    :img-list="imgList"
    :minus="false"
></Preview>
<button @click="show = !show">点击显示</button>
<button @click="handlePreview"></button>

<script>
import previewImg from './previewimg.png';

export default {
    data () {
        return {
            imgList: [
                {
                    id: 1,
                    url: previewImg
                },
                {
                    id: 2,
                    url: 'https://img.png'
                }
            ]
        }
    },
    methods: {
        handlePreview () {
            this.$preview.open({
                imgList: [
                    {
                        id: 1,
                        url: previewImg
                    }
                ],
                change: (params) => {
                    // params 包含了当前图片的基本信息及切换信息
                    // 例如 角度 缩放程度等
                }
            })
        }
    }
}
</script>
```

### 数据格式

id非必填；

通过脚本引入的使用方式和以上类似

### API

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- |
| left-rotate | 是否显示左旋转按钮 | boolean | true |
| right-rotate | 是否显示右边旋转按钮 | boolean | true |
| minus | 是否显示缩小按钮 | boolean | true |
| plus | 是否显示放大按钮 | boolean | true |
| reset | 是否显示重置按钮 | boolean | true |
| value(v-model) | 控制Preview组件的显隐 | boolean | -
| img-list | 显示的图片数组 | { url: string; id?: number } | -

### 事件

| 事件名称 | 说明 | 回调参数 |
| ----- | ----- | ----- |
| close | 点击关闭按钮的回调 | false |
| change | 切换或者操作图片回调 | object |

## $preview

使用 `this.$preview` 的时候，可以通过`open` 方法打卡预览

```javascript
this.$preview.open({
    imgList: this.imgList,
    change: (params) => {
        // params 回调的参数
    },
    menuList: {
        leftRotate: false,
        // 控制菜单项
        // 同prop值
    }
})
```

还可以通过 `getContainer` 选择挂载的dom(默认的情况下全屏显示)，挂载的节点需要有 `relative`

```javascript
this.$preview.getContainer(() => document.querySelector('.container'))
    .open({
        imgList: this.imgList
    })
```
