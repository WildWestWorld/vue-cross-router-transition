<!-- 废弃,原始组件 -->
<template>
  <!-- ref 不能放到slot上面 -->
  <!-- 用于测试元素的移动位置 -->
  <!-- <div bg-gray-400:10 ref="el"> -->
  <!-- 为什么要在外层加个ref ，因为我们要利用ref来获取该元素在页面的位置 -->
  <div ref="el">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { metadataTest, proxyElTest } from "~/composables/floating";
// 在 Vue 3 中，我们使用  defineProps  函数来定义 props，而不是在组件选项中声明 props。
// 在上述代码中， <{}>  表示 props 对象没有任何属性，即 props 是一个空对象。
// 如果你需要定义具有特定属性的 props 对象，你可以在  <{}>  中添加属性名和类型

// props 是一个空对象
const props = defineProps<{}>();
// useAttrs  函数允许您访问传递给组件的属性。它返回一个表示属性的对象。
// useAttrs  函数在  setup  函数内部被调用，以获取属性对象。
// 可以将  attrs  对象展开（使用  v-bind ）到  <input>  元素上，从而允许您将任何属性传递给组件

// 重要 useAttrs 用于获取组件中的属性
//attrs 就是挂载 元素 上的所有属性，例如我们项目使用的unocss 就是直接作用在attrs上的
//换句话说，获取attrs就是获取元素的css
const attrs = useAttrs();

//将FloatProxy得到的prop 和arrts 传入的全局变量中
metadataTest.props = props;
metadataTest.attrs = attrs;

// 获取 顶替元素的位置
const el = ref<HTMLElement>();

onMounted(() => {
  //将顶替元素赋值给全局变量ProxyEl
  //proxy其实本质上就是个控制器，根据proxy元素的属性 传给全局变量proxyEl
  //通过全局变量proxyEl 传给Container 元素，然后根据Container元素 根据全局变量proxyEl 传入的位置进行移动
  proxyElTest.value = el.value;
});
</script>

<!-- inheritAttrs: false, div就不会根据最外层 设置的样式而改变了 -->
<!-- 因为这个是个组件，如果不为true，我们在外部调用的时候，写在组件上的unocss属性就不会生效了 -->
<script lang="ts">
export default {
  inheritAttrs: true,
};
</script>
