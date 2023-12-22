import type { UseElementBoundingReturn } from "@vueuse/core";
import { nanoid } from "nanoid";
import type { Ref, UnwrapNestedRefs } from "vue";
import { reactive, ref } from "vue";
import type { ResolvedTransformOptions } from "./types";

// 控制组件 转为类，便于维护
export class TransformContext {
  //对应的控制元素
  proxyEl: Ref<HTMLElement | undefined> = ref();
  //传入的props
  props: Ref<any> = ref();
  //传入的attrs
  attrs: Ref<any> = ref();
  //动画状态
  isLanded: Ref<boolean> = ref(false);
  //控制元素的位置信息
  proxyElRect: UnwrapNestedRefs<UseElementBoundingReturn> = undefined!;
  // effectScope() 函数用于创建一个 effect 作用域。
  //effect 作用域可以用来管理 effect 的生命周期，并在 effect 执行时创建一个新的 Vue 实例。
  //在本例中，effectScope() 函数的第二个参数为 true，表示该 effect 作用域是全局的。
  //这意味着该 effect 作用域中的 effect 会在所有组件中执行。

  scope = effectScope(true);
  //创建一个独一无二id 用于管理
  id = nanoid();

  //  构造器，构造该类时必须传入对应的Options
  constructor(public options: ResolvedTransformOptions) {
    this.scope.run(() => {
      //this.scope.run() 方法用于在 effect 作用域中执行一个 effect。
      // effect 是 Vue 中的一个功能，用于在组件更新时执行一些逻辑。
      ///在本例中，this.scope.run() 方法会在 effect 作用域中执行 useElementBounding 函数，该函数用于获取控制元素的位置信息。

      //当元素发生改变就会会执行 useElementBounding
      this.proxyElRect = reactive(useElementBounding(this.proxyEl));
    });
  }

  //废弃：废弃原因使用  effectScope+useElementBounding 只要元素发生改变就会执行useElementBounding 直接获取对应元素信息
  //   更新代理元素的位置信息
  // updateRect(proxyEl = this.proxyEl.value) {
  //   this.proxyElRect.value = proxyEl?.getClientRects()?.[0];
  // }

  //   变更动画状态为开始
  liftOff() {
    this.isLanded.value = false;
  }
  // 变更动画状态为完成
  land() {
    this.isLanded.value = true;
  }
}
