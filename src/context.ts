import type { UseElementBoundingReturn } from "@vueuse/core";
import { nanoid, customAlphabet } from "nanoid";
import type { Ref, UnwrapNestedRefs } from "vue";
import { reactive, ref, watch } from "vue";
import type { ResolvedTransformOptions } from "./types";

//废弃：废弃原因：替换为函数式组件
// 控制组件 转为类，便于维护
// export class TransformContext {
//   //对应的控制元素
//   proxyEl: Ref<HTMLElement | undefined> = ref();
//   //传入的props
//   props: Ref<any> = ref();
//   //传入的attrs
//   attrs: Ref<any> = ref();
//   //动画状态
//   isLanded: Ref<boolean> = ref(false);
//   //控制元素的位置信息
//   proxyElRect: UnwrapNestedRefs<UseElementBoundingReturn> = undefined!;
//   // effectScope() 函数用于创建一个 effect 作用域。
//   //effect 作用域可以用来管理 effect 的生命周期，并在 effect 执行时创建一个新的 Vue 实例。
//   //在本例中，effectScope() 函数的第二个参数为 true，表示该 effect 作用域是全局的。
//   //这意味着该 effect 作用域中的 effect 会在所有组件中执行。

//   scope = effectScope(true);
//   //创建一个独一无二id 用于管理
//   id = nanoid();

//   //  构造器，构造该类时必须传入对应的Options
//   constructor(public options: ResolvedTransformOptions) {
//     this.scope.run(() => {
//       //this.scope.run() 方法用于在 effect 作用域中执行一个 effect。
//       // effect 是 Vue 中的一个功能，用于在组件更新时执行一些逻辑。
//       ///在本例中，this.scope.run() 方法会在 effect 作用域中执行 useElementBounding 函数，该函数用于获取控制元素的位置信息。

//       //当元素发生改变就会会执行 useElementBounding
//       this.proxyElRect = reactive(useElementBounding(this.proxyEl));
//     });
//   }

//   //废弃：废弃原因使用  effectScope+useElementBounding 只要元素发生改变就会执行useElementBounding 直接获取对应元素信息
//   //   更新代理元素的位置信息
//   // updateRect(proxyEl = this.proxyEl.value) {
//   //   this.proxyElRect.value = proxyEl?.getClientRects()?.[0];
//   // }

//   //   变更动画状态为开始
//   liftOff() {
//     this.isLanded.value = false;
//   }
//   // 变更动画状态为完成
//   land() {
//     this.isLanded.value = true;
//   }
// }

//自定义id
// customAlphabet允许您使用自己的字母表创建nanoid和 ID size
const getId = customAlphabet("abcdefghijklmnopqrstuvwxyz", 10);

// 创建控制组件
export function createTransformContext() {
  //对应的控制元素
  const proxyEl: Ref<HTMLElement | undefined> = ref();
  //传入的props
  const props: Ref<any> = ref();
  //传入的attrs
  const attrs: Ref<any> = ref();
  //控制元素的位置信息
  let proxyElRect: UseElementBoundingReturn = undefined!;
  // effectScope() 函数用于创建一个 effect 作用域。
  //effect 作用域可以用来管理 effect 的生命周期，并在 effect 执行时创建一个新的 Vue 实例。
  //在本例中，effectScope() 函数的第二个参数为 true，表示该 effect 作用域是全局的。
  //这意味着该 effect 作用域中的 effect 会在所有组件中执行。

  const scope = effectScope(true);

  //创建一个独一无二id 用于管理 我们也根据id 进行Teleport传送元素的
  const id = getId();

  //动画状态
  const isLanded: Ref<boolean> = ref(false);
  //是否显示
  const isVisible = ref(false);

  //this.scope.run() 方法用于在 effect 作用域中执行一个 effect。
  scope.run(() => {
    // effect 是 Vue 中的一个功能，用于在组件更新时执行一些逻辑。
    ///在本例中，this.scope.run() 方法会在 effect 作用域中执行 useElementBounding 函数，该函数用于获取控制元素的位置信息。
    proxyElRect = useElementBounding(proxyEl);

    //是否显示
    //如果 有控制元素的话就显示，如果没有就隐藏
    watch(proxyEl, async (v) => {
      if (v) {
        isVisible.value = true;
      }

      //为什么要加nextTick是 为了让动画更加丝滑,让消失动画得以进行
      await nextTick();
      if (!proxyEl.value) {
        isVisible.value = false;
      }
    });
  });

  return reactive({
    proxyEl,
    props,
    attrs,
    proxyElRect,
    scope,
    id,

    isLanded,
    isVisible,

    //返回元素
    elRef() {
      return proxyEl;
    },
    //更选元素
    updateRect() {
      //这里的update 是类型定义给的
      //proxyElRect:UseElementBoundingReturn

      // type UseElementBoundingReturn = {
      //       height: vue_demi.Ref<number>;
      //       bottom: vue_demi.Ref<number>;
      //       left: vue_demi.Ref<number>;
      //       right: vue_demi.Ref<number>;
      //       top: vue_demi.Ref<number>;
      //       width: vue_demi.Ref<...>;
      //       x: vue_demi.Ref<...>;
      //       y: vue_demi.Ref<...>;
      //       update: () => void;
      //   }

      proxyElRect.update();
    },
    async liftOff() {
      //如果 状态已经是动画开始状态 就不用发生改变了
      if (!isLanded.value) return;
      isLanded.value = false;
      // console.log('lift up')
    },
    async land() {
      //如果 状态已经是动画结束状态 就不用发生改变了
      if (isLanded.value) return;
      isLanded.value = true;
      // console.log('landed up')
    },
  });
}

//返回传送的类型
export type TransformContext = ReturnType<typeof createTransformContext>;
