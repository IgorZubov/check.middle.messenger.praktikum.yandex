import { afterEach, beforeEach, describe } from "mocha";
import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import { expect } from "chai";
import { HTTPTransport } from "./HTTPTransport.ts";

describe("HTTP Transport test", () => {
  let xhr: SinonFakeXMLHttpRequestStatic;
  let instance: HTTPTransport;
  const requests: SinonFakeXMLHttpRequest[] = [];
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    global.XMLHttpRequest = xhr;

    xhr.onCreate = req => {
      requests.push(req);
    };

    instance = new HTTPTransport("");
  });

  afterEach(() => {
    requests.length = 0;
    xhr.restore();
  });

  describe("HTTP Transport", () => {
    it("вызывает метод get", () => {
      instance.get("/");

      const [request] = requests;

      expect(request.method).to.equal("GET");
    });

    it("вызывает метод post", () => {
      instance.post("/");

      const [request] = requests;

      expect(request.method).to.equal("POST");
    });

    it("вызывает метод put", () => {
      instance.put("/");

      const [request] = requests;

      expect(request.method).to.equal("PUT");
    });

    it("вызывает метод delete", () => {
      instance.delete("/");

      const [request] = requests;

      expect(request.method).to.equal("DELETE");
    });
  });
});
