import { createApp, defineComponent, ref, h, VNode, App, nextTick } from 'vue';
import Message from './message.vue';
import { WithInstallType } from '../shared';
import { TdMessageProps, MessageThemeList } from './type';

import './style';

function create(props: TdMessageProps): void {
  const visible = ref(false);
  const root = document.createElement('div');
  document.body.appendChild(root);

  const component = defineComponent({
    render: (): VNode =>
      h(Message, {
        ...props,
        visible: visible.value,
        onClose: () => {
          visible.value = false;
        },
        onClosed: () => {
          root.remove();
        },
      }),
  });

  createApp(component).mount(root);

  nextTick(() => {
    visible.value = true;
  });
}

(['info', 'success', 'warning', 'error'] as MessageThemeList[]).forEach((type: MessageThemeList): void => {
  Message[type] = (options: TdMessageProps | string) => {
    let props = {
      content: '',
      theme: type,
    };

    if (typeof options === 'string') {
      props.content = options;
    } else {
      props = { ...props, ...options };
    }

    create(props);
  };
});

Message.install = (app: App, name = '') => {
  app.component(name || Message.name, Message);

  // 添加插件入口
  // eslint-disable-next-line no-param-reassign
  app.config.globalProperties.$message = Message;
};

type MessageApi = {
  /** 展示普通消息 */
  info: (options?: TdMessageProps | string) => void;
  /** 展示成功消息 */
  success: (options?: TdMessageProps | string) => void;
  /** 展示警示消息 */
  warning: (options?: TdMessageProps | string) => void;
  /** 展示错误消息 */
  error: (options?: TdMessageProps | string) => void;
};

export const MessagePlugin: WithInstallType<typeof Message> = Message as any;
export default MessagePlugin;

declare module '@vue/runtime-core' {
  // Bind to `this` keyword
  interface ComponentCustomProperties {
    $message: MessageApi;
  }
}
