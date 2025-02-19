import { expect } from "chai";
import Sinon from "sinon";
import Router from "./Router.ts";
import Block from "./block.ts";

describe("Router tests", () => {
  let router: Router;

  class MockBlock extends Block {
    render(): string {
      return `<div>MockBlock</div>`;
    }
  }

  beforeEach(() => {
    router = new Router("#app");
  });

  it("should add a new route", () => {
    router.use("/test", MockBlock);

    const route = router.getRoute("/test");
    expect(route).to.exist;
    expect(route?.match("/test")).to.be.true;
  });

  it("should go forward in history", () => {
    const goStub = Sinon.stub(window.history, "forward");
    router.forward();
    expect(goStub.calledOnce).to.be.true;
    goStub.restore();
  });
});
