import { expect } from "chai";
import jsdom from "global-jsdom";
import Block from "./block.ts";
import Sinon from "sinon";

describe("Block tests", () => {
  let cleanup: () => void;

  before(() => {
    cleanup = jsdom();
  });

  after(() => {
    cleanup();
  });
  describe("Test block", () => {
    let blockClass: typeof Block;

    beforeEach(() => {
      class Button extends Block {
        constructor(props: any) {
          super({
            ...props,
          });
        }

        render() {
          return `<div id="div">{{text}}</div>`;
        }
      }

      blockClass = Button;
    });

    it("should render props", () => {
      const textData = 'Im a div';
      const btnComponent = new blockClass({text: textData});
      const res = (btnComponent.element as unknown as HTMLDivElement)?.innerHTML;

      expect(res).to.be.eq(textData)
    });

    it('should handle click', () => {
      const handler = Sinon.stub();
      const btnComponent = new blockClass({text: 'im a btn', events: {
        click: handler
      }});

      const event = new MouseEvent('click');
      (btnComponent.element as unknown as HTMLDivElement)?.dispatchEvent(event);

      expect(handler.calledOnce).to.be.true;
    });
  });
});
