import store, { State, StoreEvents } from "@/core/Store.ts";
import Block, { BlockProps } from "@/core/Block.ts";
import { isEqual, PlainObject } from "@/utils/isEqual.ts";

export const withStore =
  (mapStateToProps: (state: State) => unknown) =>
  <P extends BlockProps>(Component: typeof Block<P>) =>
    class extends Component {
      constructor(props: P) {
        let state = mapStateToProps(store.getState()) as PlainObject<unknown>;
        super({ ...props, ...(mapStateToProps(store.getState()) as object) });
        store.on(StoreEvents.Updated, () => {
          const propsFromState = mapStateToProps(store.getState()) as PlainObject<unknown>;

          if (!isEqual(state, propsFromState)) {
            this.setProps({ ...(propsFromState as object) });
          }
          state = propsFromState;
        });
      }
    };
