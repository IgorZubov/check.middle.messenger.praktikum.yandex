import { expect } from "chai";
import { Button } from "./Button";

describe("Button", function () {
  let button;

  it("рендерит кнопку с корректным текстом", function () {
    const buttonComponent = new Button({ text: "Клик" });
    button = buttonComponent.getContent();
    expect(button?.textContent).to.equal("Клик");
  });

  it("отрабатывает событие клика", function (done) {
    const buttonComponent = new Button({
      text: "Клик",
      onClick: () => {
        done();
      },
    });
    button = buttonComponent.getContent();
    button?.click();
  });

  it('добавляет класс "button--ghost" когда передается isGhost проп', function () {
    const buttonComponent = new Button({ text: "Клик", isGhost: true });
    button = buttonComponent.getContent();
    buttonComponent.componentDidMount();
    expect(button?.classList.contains("button--ghost")).to.be.true;
  });

  it('добавляет класс "button--ghost--warning" когда передается isWarning проп', function () {
    const buttonComponent = new Button({ text: "Клик", isWarning: true });
    button = buttonComponent.getContent();
    buttonComponent.componentDidMount();
    expect(button?.classList.contains("button--ghost--warning")).to.be.true;
  });

  it('добавляет класс "button--circle" когда передается isCircle проп', function () {
    const buttonComponent = new Button({ text: "Клик", isCircle: true });
    button = buttonComponent.getContent();
    buttonComponent.componentDidMount();
    expect(button?.classList.contains("button--circle")).to.be.true;
  });

  it('добавляет класс "button--underline" когда передается underline проп', function () {
    const buttonComponent = new Button({ text: "Клик", underline: true });
    button = buttonComponent.getContent();
    buttonComponent.componentDidMount();
    expect(button?.classList.contains("button--underline")).to.be.true;
  });

  it("не добавляет дополнительные классы, если не передаются соответствующие пропы", function () {
    const buttonComponent = new Button({ text: "Клик" });
    button = buttonComponent.getContent();
    buttonComponent.componentDidMount();
    expect(button?.classList.contains("button--ghost")).to.be.false;
    expect(button?.classList.contains("button--circle")).to.be.false;
    expect(button?.classList.contains("button--underline")).to.be.false;
  });
});
