import type { Ref } from "vue";
import { ref } from "vue";
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
  landed: Ref<boolean> = ref(false);
  //控制元素的位置信息
  proxyElRect: Ref<DOMRect | undefined> = ref();

  //动画定时器
  private landingTimer: any;

  //  构造器，构造该类时必须传入对应的Options
  constructor(public options: ResolvedTransformOptions) {}

  //   更新代理元素的位置信息
  updateRect(proxyEl = this.proxyEl.value) {
    this.proxyElRect.value = proxyEl?.getClientRects()?.[0];
  }

  //   变更动画状态为开始
  liftOff() {
    this.landed.value = false;
    clearTimeout(this.landingTimer);
  }
  // 变更动画状态为完成
  land() {
    clearTimeout(this.landingTimer);
    this.landingTimer = setTimeout(() => {
      this.landed.value = true;
    }, this.options.duration);
  }
}