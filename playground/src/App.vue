<template>
  <!-- font-sans : font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; -->
  <!-- p= x-4  =>padding-left:1rem;padding-right:1rem; -->
  <!-- p= y-10  =>padding-top:2.5rem;padding-bottom:2.5rem; -->
  <!-- text="center gray-700 dark:gray-200" 这个属性将使文本居中对齐，文本颜色为灰色（在默认模式下为灰色 700 级），在  dark` 模式下为灰色 200 级。 -->

  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <TheNav />
    <router-view />
  </main>

  <!-- 跨路由动画的条件就是这个 元素 不能被router-view管理 -->

  <!-- 根据路由的修改  页面中的 FloatProxy 将自己对应的样式信息 传给 FloatContainer -->
  <!-- FloatContainer 带动里面的元素进行样式上的变化 -->

  <!-- #imgSlot="{ attrs } 具名插槽 获取参数attrs -->

  <!-- :class="attrs.class" 为关键步骤 控制元素样式 -->
  <!-- v-bind="{ ...attrs }" 兼容 tailwind的写法(不写class="xx") -->
  <!-- <FloatContainer #imgSlot="{ attrs }">
    <TheImageNew
      :attrs="attrs"
      :class="attrs.class"
      v-bind="{ ...attrs }"
    ></TheImageNew>
  </FloatContainer> -->

  <!-- 显示元素 渲染的组件已经在floating 已经传递过需要渲染的组件了(TheImageNew) -->
  <!-- 显示元素 -->
  <TheImageContainer> </TheImageContainer>
</template>

<script setup lang="ts">
//  用于显示
import { TheImageContainer } from "./composables/image";
</script>
