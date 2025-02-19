import { afterEach, beforeEach } from "mocha";
import { expect } from "chai";
import { Router } from "./Router.ts";
import Block from "./Block.ts";
import sinon from "sinon";

class MockBlock extends Block {
  render() {
    return "<div>Mock Block</div>";
  }
}

describe("Router Singleton", () => {
  it("единственный экземпляр", () => {
    const routerInstance1 = Router.getInstance();
    const routerInstance2 = Router.getInstance();

    expect(routerInstance1).to.equal(routerInstance2);
  });

  it("уничтожает экземпляр", () => {
    const routerInstance1 = Router.getInstance();

    Router.destroy();

    const routerInstance2 = Router.getInstance();

    expect(routerInstance1).not.to.equal(routerInstance2);
  });
});

describe("Router", function () {
  let router: Router;

  beforeEach(function () {
    router = Router.getInstance();
  });

  afterEach(function () {
    Router.destroy();
  });

  it("корректно добавляет маршрут используя метод use", function () {
    const blockProps = { key: "value" };
    router.use("/test", MockBlock, blockProps);

    const route = router.getRoute("/test");
    expect(route).to.not.be.undefined;
    expect(route._pathname).to.equal("/test");
    expect(route._blockClass).to.equal(MockBlock);
    expect(route._props).to.deep.equal({
      rootQuery: "#app",
      defaultProps: blockProps,
    });

    route.render();
    expect(route._block).to.not.be.null;
    expect(route._block instanceof MockBlock).to.be.true;
  });

  it("отрисовывает корректный маршрут, когда метод go() вызван", function () {
    const blockProps = { key: "value" };
    router.use("/test", MockBlock, blockProps);

    const mockRender = sinon.spy(MockBlock.prototype, "render");
    router.go("/test");

    expect(mockRender.calledOnce).to.be.true;
    expect(mockRender.firstCall.thisValue).to.be.instanceOf(MockBlock);
  });

  it("возвращается по истории когда вызван метод back()", function () {
    const mockHistoryBack = sinon.stub(window.history, "back");
    router.back();
    expect(mockHistoryBack.calledOnce).to.be.true;
  });

  it("следует вперед по истории когда вызван метод forward()", function () {
    const mockHistoryForward = sinon.stub(window.history, "forward");
    router.forward();
    expect(mockHistoryForward.calledOnce).to.be.true;
  });

  it("очищает предыдущий роут, когда переходит на новый", function () {
    const blockProps = { key: "value" };
    router.use("/test1", MockBlock, blockProps);
    router.use("/test2", MockBlock, blockProps);
    router.go("/test1");

    const currentRoute = router["_currentRoute"];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const mockLeave = sinon.spy(currentRoute, "leave");

    router.go("/test2");

    expect(mockLeave.calledOnce).to.be.true;
  });
});
