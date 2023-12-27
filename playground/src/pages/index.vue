<template>
  <div px6 py-2>
    <div p2 flex="~ gap-2" justify-center>
      <button btn @click="toggle()">Toggle Size</button>
      <!-- <router-link btn to="/foo" saturate-0> Navigate </router-link> -->
    </div>
    <p pb-10>Shared component across routes with animations</p>

    <!-- 根据路由的修改  FloatProxy 将自己对应的样式信息 传给 FloatContainer -->
    <!-- FloatContainer带动里面的元素进行样式上的变化 -->

    <!-- 整合前 -->
    <!-- 
    <FloatProxy
      :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
      rounded-xl
    ></FloatProxy> -->

    <!-- 整合后 -->
    <div flex="~ gap-4 wrap" justify-center>
      <RouterLink
        v-for="img, idx of images"
        :key="img"
        :to="`/${idx}`"
      >
        <TheImageProxy
          transition-all duration-800
          :port="String(idx)"
          :class="mode ? 'w-50 h-50' : 'w-60 h-30'"
          :attrs="{ class: 'rounded-xl' }"
          :props="{ src: img }"
        />
        
      </RouterLink>
    </div>



  </div>
</template>

<script lang="ts" setup>
import { TheImageProxy } from "~/composables/image";
import { images } from '../composables/data'

const mode = ref(false);
const toggle = useToggle(mode);
</script>
