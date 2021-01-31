# 一些插件

## 图片预览插件

### 使用

```javascript
import VueTools from '@niu_/vue-tools';

Vue.use(VueTools);
```

单文件中可以通过组件 `Preview` 形式或者 `this.$preview` 访问

```vue

<Preview
    v-model="show"
    :img-list="imgList"
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
