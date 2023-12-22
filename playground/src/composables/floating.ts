//用于定义VueStyle/Component TS类型
import type { Component, StyleValue } from "vue";
import { Teleport, h, Ref } from "vue";

//用于生成唯一id
import { nanoid } from "nanoid";

// 废弃，给原始组件用的
export const metadataTest = reactive<any>({
  props: {},
  attrs: {},
});
// 废弃，给原始组件用的
export const proxyElTest = ref<HTMLElement | null>();

//用于设置动画的可配置参数的接口
export interface TransformOptions {
  duration?: number;
  landing?: boolean;
}
//用于设置动画的可配置参数的接口 后期可能进行拓展
export type ResolvedTransformOptions = Required<TransformOptions>;

//暂时无用
export interface TransformInstance {
  component: Component;
  container: Component;
  proxy: Component;
  options: TransformOptions;
}

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

// 封装 Float组件
// 传入元素我们封装成组件
export function createFloating<T extends Component>(
  component: T,
  options: TransformOptions = {}
) {
  //配置
  const transformOptions: ResolvedTransformOptions = {
    duration: 800,
    // TODO: fix teleports
    landing: false,
    ...options,
  };
  //   设置默认的id
  const defaultId = nanoid();
  //   重要：当前浮空元素合集，我们用来管理 浮空元素
  const contextMap = new Map<string, TransformContext>();

  //   通过id 获取对应 浮空元素， 如果该浮空元素没有id就手动给他创建一个id
  function getContext(port = defaultId) {
    if (!contextMap.has(port))
      contextMap.set(port, new TransformContext(transformOptions));
    //! 表示强制类型转换，将 contextMap.get(port) 转换为 TransformContext 类型 让他不能为undefine类型。
    return contextMap.get(port)!;
  }

  //代理元素的位置信息，我们用这个位置信息来 改变显示元素的位置
  //   let proxyElRect = $ref<DOMRect | undefined>();

  //显示元素给用户看的元素 ，根据 代理元素传入的位置信息 进行位置和形状的变化
  //defineComponent 自定义组件并使用h来渲染
  const container = defineComponent({
    props: {
      port: {
        type: String,
        default: defaultId,
      },
    },
    setup(props) {
      //将获取到的Context 变成响应式的
      const context = $computed(() => getContext(props.port));
      //context包含 对应的控制元素，控制元素为位置信息，attr
      const { proxyElRect, proxyEl, attrs } = $(context);

      // 代理元素/站位元素的位置信息
      // 这些信息用于移动 我们的动画元素
      // const proxyElRect = ref<DOMRect>();

      // (废弃改为 useuseElementBounding )
      // 当ProxyEl 元素发生变化时，我们的 实际元素也需要发生变化
      // watch(
      //   proxyEl,
      //   (el) => {
      //     // 打印占位元素的信息
      //     // console.log(el?.getBoundingClientRect());
      //     // 获取占位元素的 信息
      //     proxyElRect = el?.getBoundingClientRect();
      //   },
      //   { immediate: true }
      // );

      // 拿到占位元素的信息之后我们利用compute进行 动画元素的移动
      const AniElementStyle = computed((): StyleValue => {
        const fixed: StyleValue = {
          transition: `all ${transformOptions.duration}ms ease-in-out`,
          position: "fixed",
        };

        // 如果不存在 占位元素信息/占位元素 就变成透明
        if (!proxyElRect || !proxyEl) {
          return {
            opacity: 0,
            pointerEvents: "none",
          };
        }

        return {
          ...fixed,
          left: `${proxyElRect.x ?? 0}px`,
          top: `${proxyElRect.y ?? 0}px`,
          width: `${proxyElRect.width ?? 0}px`,
          height: `${proxyElRect.height ?? 0}px`,
        };
      });

      // (废弃改为useMutationObserver) 原因 检测不到 元素位置的变化
      // 用于修复 当页面的元素 发生变化，我们的对应 Rect没有得到更新导致，元素不在位置的BUG
      // useElementBounding 在元素发生变化时就会重新获取对应的 元素信息而且会取消掉上次获取的函数，获得更好的性能
      // const proxyElRect = reactive(useElementBounding(proxyEl));

      // 更新Rect
      //废弃:改用getClientRects 获取xy
      //   function updateRect() {
      //     proxyElRect = proxyEl.value?.getBoundingClientRect();
      //   }
      // 使用useMutationObserver 对proxyEl 进行位置变化监听
      // 如果发生变化就执行更新  占位元素的位置操作

      // -  childList: true  表示要监听子节点的添加或移除。
      // -  subtree: true  表示要监听整个子树中的节点变化。
      // -  attributes: true  表示要监听属性的变化。
      // -  characterData: true  表示要监听文本内容的变化。

      //这里最重要就是监听属性变化的更改
      //之前是proxyElRect 现在是context.proxyEl
      useMutationObserver(context.proxyEl, () => context.updateRect(), {
        attributes: true,
      });

      // 当页面尺寸发生变化我们也更新对应的元素位置
      useEventListener("resize", () => context.updateRect());

      // watchEffect(updateRect)  是 Vue 3 中的一个 API，用于监测响应式数据的变化并执行相应的副作用函数。
      // 在这个例子中， updateRect  是一个副作用函数，它将在响应式数据发生变化时被调用。
      //  watchEffect  函数会自动追踪在副作用函数中使用的响应式数据，并在这些数据发生变化时重新运行副作用函数。
      // 换句话说 proxyEl.value 改变 执行 updateRect

      watchEffect(() => context.updateRect());

      //   该组件是核心组件，实际上我们看到的图片显示都是由他来做的

      //   导入Float全局变量用于传输 样式变量 进行路由动画
      //  将其传入子元素 Img 就会进行动画
      //    metadata.attrs 是我们定义的全局变量  他怎么来的呢？他是根据当前页面Proxy的Attr属性来的
      //   {{ metadata.attrs }}
      //   插槽传参
      //   传入attrs 样式参数

      //   拿到占位元素的信息之后我们利用compute进行 动画元素的移动
      //   进行移动的时候 不能有其他元素存在，动画元素移动后 无法覆盖占位元素
      //   AniElementStyle 定义了动画的过渡时间，更重要的是他获取了当前页面的proxy的位置，从而进行位置的动画操作

      //   这个component就是用于存放 要显示的元素 然后利用attrs来 传入对应的元素样式

      //显示元素的创建 (对标FloatContainer)
      //我们直接用compent代替slot 进行组件的创建
      return () => {
        //如果动画状态已经结束，就把 组件 传送到 控制元素的位置
        //也就是把元素 真正的放到了dom树里面，这里很重要
        //如果没有结束就继续渲染/继续执行动画

        //传入的组件
        const comp = h(component, attrs);
        //遇到的问题(严重):Teleport元素 转换为AniRender时，组件中的定时器会不受控制 直接触发导致 landed状态直接为true，无动画效果
        // 当前我们上面的BUG暂时还没有修复，所以我们设置了landing 一直为true，保证代码运行正常

        const teleports = false;
        return h(
          "div",
          { style: AniElementStyle.value, class: "starport-container" },
          [
            teleports
              ? h(
                  Teleport,
                  {
                    to: proxyEl,
                    disabled: teleports,
                  },
                  [comp]
                )
              : comp,
          ]
        );

        // return h(
        //   "div",
        //   {
        //     style: AniElementStyle.value,
        //   },
        //   [h(component, metadata.attrs)]
        // );
      };
    },
  }) as T;

  //代理元素，也就是 控制器元素，当代理元素改变时，会传入代理元素改变后的位置信息到全局变量
  //显示元素根据全局变量做位置移动的动画效果
  const proxy = defineComponent({
    props: {
      port: {
        type: String,
        default: defaultId,
      },
      props: {
        type: Object,
        default: () => {},
      },
      attrs: {
        type: Object,
        default: () => {},
      },
    },
    setup(props, ctx) {
      // 在 Vue 3 中，我们使用  defineProps  函数来定义 props，而不是在组件选项中声明 props。
      // 在上述代码中， <{}>  表示 props 对象没有任何属性，即 props 是一个空对象。
      // 如果你需要定义具有特定属性的 props 对象，你可以在  <{}>  中添加属性名和类型

      // props 是一个空对象
      // const props = defineProps<{}>();
      // useAttrs  函数允许您访问传递给组件的属性。它返回一个表示属性的对象。
      // useAttrs  函数在  setup  函数内部被调用，以获取属性对象。
      // 可以将  attrs  对象展开（使用  v-bind ）到  <input>  元素上，从而允许您将任何属性传递给组件

      // 重要 useAttrs 用于获取组件中的属性
      //   const attrs = useAttrs();

      const context = $computed(() => getContext(props.port));

      context.attrs.value = props.attrs;
      context.props.value = props.props;
      // 获取 顶替元素的位置
      //   这里得到的ref就是元素本身 获取到el我们就发送给对应的全局变量
      const el = ref<HTMLElement>();

      //将FloatProxy得到的prop 和arrts 传入的全局变量中
      //   metadata.props = props;
      //   metadata.attrs = attrs;

      //控制元素如果渲染了，就把位置信息传入到代理元素的储存变量中去
      //proxyEl.value  就在本文件的最上层
      onMounted(() => {
        // 将顶替元素赋值给全局变量ProxyEl
        context.proxyEl.value = el.value;
        context.updateRect(el.value);
        context.land();
      });
      //在元素被销毁之前 就把代理元素 位置信息全局变量置为默认值
      onBeforeUnmount(() => {
        context.updateRect(el.value);
        context.liftOff();
        // console.log("元素销毁");
        // proxyEl.value = undefined;
      });

      //   <!-- ref 不能放到slot上面 -->
      //   <!-- 用于测试元素的移动位置 -->
      //   <!-- <div bg-gray-400:10 ref="el"> -->
      //     <!-- 为什么要在外层加个ref ，因为我们要利用ref来获取该元素在页面的位置 -->
      //控制元素的创建 (对标FloatProxy)
      //ctx.slots.imgSlot 也就是创建一个slot插槽

      //  h(类型,props,children)
      //ctx.slots.default 这里一定要写默认的插槽，不然会无法正常 显示动画
      return () =>
        h(
          "div",
          {
            ref: el,
            class: "starport-proxy",
          },
          [ctx.slots.default ? h(ctx.slots.default) : null]
        );
    },
  }) as T;

  return {
    container,
    proxy,
  };
}
