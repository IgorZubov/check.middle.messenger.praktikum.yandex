import store from "./store";
import Block from "./block";
import { STORE_EVENTS } from "../enum";

export function connect(Component: typeof Block) {
  return (props: any = {}) =>
    class ConnectedComponent extends Component {
      constructor() {
        super({ ...props, ...store.getState() });

        store.on(STORE_EVENTS.Updated, () => {
          console.log("Store обновился: ", store.getState());
          this.setProps({ ...store.getState() });
          if (store.getState().messages && store.getState().messages.length) {
            this.setLists({ messages: store.getState().messages })
          }
        });
      }
    };
}
