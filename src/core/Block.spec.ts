import Block from "./Block";
import { expect } from "chai";
import sinon from "sinon";

describe("Block Component", function () {
  let block: Block;
  let mockEventBus;

  beforeEach(() => {
    mockEventBus = {
      on: sinon.spy(),
      emit: sinon.spy(),
    };

    block = new Block({
      events: {
        click: sinon.spy(),
      },
      attr: { "data-test": true },
    });

    block.eventBus = () => mockEventBus;
  });

  it("инициализируется с корректными дефолтными значениями", function () {
    expect(block).to.be.an.instanceof(Block);
    expect(block.props).to.have.property("events");
    expect(block.props.events).to.have.property("click");
    expect(block.props.attr).to.have.property("data-test").that.is.true;
  });

  it("корректно регистрирует события", function () {
    block._registerEvents(mockEventBus);
    expect(mockEventBus.on.callCount).to.equal(4);
  });

  it("генерирует событие INIT при создании", function () {
    block.eventBus().emit("init");
    expect(mockEventBus.emit.calledWith("init")).to.be.true;
  });

  it("корректно устанавливает пропсы используя setProps", function () {
    const newProps = { attr: { "data-new": "value" } };
    block.setProps(newProps);
    expect(block.props.attr).to.deep.equal(newProps.attr);
  });

  it("скрывает элемент при вызове метода hide", function () {
    const element = {
      style: { display: "" },
    };

    block._element = element;
    block.hide();

    expect(element.style.display).to.equal("none");
  });

  it("отображает элемент при вызове метода show", function () {
    const renderSpy = sinon.spy();
    block.show("query", renderSpy);

    expect(mockEventBus.emit.calledWith("init")).to.be.true;
    expect(renderSpy.calledOnce).to.be.true;
  });

  it("не должен изменять приватные значения", function () {
    expect(() => (block.props._element = "new value")).to.throw("Нет прав");
  });
});
