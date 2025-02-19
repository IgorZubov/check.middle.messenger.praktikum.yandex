import Block from "@/core/Block";
import { Router } from "@/core/Router";

export function withRouter<T extends { router?: Router }>(WrappedBlock: typeof Block) {
  return class extends WrappedBlock {
    constructor(props: Omit<T, "router">) {
      super({ ...props, router: window.router as Router });
    }
  };
}
