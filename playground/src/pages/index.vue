<template>
  <div px8 py-2>
    <p>Shared component across routes with animations</p>
    <div p4>
      <button btn @click="toggle()">Toggle Size</button>
    </div>

    <!-- 根据路由的修改  FloatProxy 将自己对应的样式信息 传给 FloatContainer -->
    <!-- FloatContainer带动里面的元素进行样式上的变化 -->

    <!-- 整合前 -->
    <!-- 
    <FloatProxy
      :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
      rounded-xl
    ></FloatProxy> -->

    <!-- 整合后 -->
    <TheImageProxy
      :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
      rounded-xl
      :attrs="{ class: 'rounded-xl' }"
    ></TheImageProxy>
  </div>
</template>

<script lang="ts" setup>
import { TheImageProxy } from "~/composables/image";

const mode = ref(false);
const toggle = useToggle(mode);
</script>
