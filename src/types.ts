import type { Component } from "vue";

// 类型文件 专门存放文件类型TS
//用于设置动画的可配置参数的接口
export interface TransformOptions {
  duration?: number;
}
//用于设置动画的可配置参数的接口 后期可能进行拓展
export type ResolvedTransformOptions = Required<TransformOptions>;
//动画实例 暂时无用
export interface TransformInstance<T extends Component = Component> {
  component: T;
  container: T;
  proxy: T;
  options: TransformOptions;
}
