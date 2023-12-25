<template>
  <div px6 py-2 flex="~ col" items-center>
    <div p2 flex="~ gap-2">
      <router-link btn to="/" saturate-0> Back </router-link>
      <button btn @click="enlarge()">Enlarge</button>
      <button btn @click="reset()">Reset</button>
    </div>
    <!-- 根据路由的修改  FloatProxy 将自己对应的样式信息 传给 FloatContainer -->
    <!-- FloatContainer带动里面的元素进行样式上的变化 -->

    <!-- 注意：FloatProxy 不能带有 margin样式，margin 会导致无法定位到 占位元素位置，因为margin 了位置  -->
    <!-- 如果要使用margin的话得在外层套个marign -->
    <!--sm:row 非手机端 col 布局  -->
    <div m10 flex="~ col sm:row-reverse gap-4" items-center max-w-180>
      <!-- 整合前 -->
      <!-- 
      <FloatProxy
        :style="{ width: size + 'px', height: size + 'px' }"
        rounded="1/2"
      ></FloatProxy>

-->

      <!-- 整合后 -->
      <TheImageProxy
        :style="{ width: size + 'px', height: size + 'px' }"
        :attrs="{ class: 'rounded-1/2 shadow-xl' }"
        transition-all
        duration-600
      />
      <p flex-1 text-left>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TheImageProxy } from "~/composables/image";

// 设置图片的大小  用于测试 占位元素的检测是否会自适应
// let size = $ref(100);

// 将size 存到store里面这样还原回来的时候还是 原来的数值

// 使用  $(...)  语法可以在  <script setup>
// 区块中执行表达式，并将结果作为响应式的值绑定到组件中。
let size = $(useStorage("size", 200));

// 增大图片
const enlarge = () => {
  size = size + 20;
};
// 还原图片
const reset = () => {
  size = 200;
};
</script>
