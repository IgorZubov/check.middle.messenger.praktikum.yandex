import { expect } from "chai";
import { HTTPTransport } from "./xhr.ts";
import { HTTP_METHODS } from "../enum.ts";
import sinon from "sinon";

describe("HTTPTransport", () => {
  let xhr: sinon.SinonFakeXMLHttpRequestStatic;
  let requests: sinon.SinonFakeXMLHttpRequest[];

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = (request) => {
      requests.push(request);
    };
  });

  afterEach(() => {
    xhr.restore();
  });

  it("should send a GET request", async () => {
    const http = new HTTPTransport();
    const url = "https://jsonplaceholder.typicode.com/posts";
    const responsePromise = http.get(url);

    expect(requests).to.have.lengthOf(1);
    const request = requests[0];

    expect(request.method).to.equal(HTTP_METHODS.GET);
    request.respond(
      200,
      { "Content-Type": "application/json" },
      JSON.stringify({ items: [] })
    );

    const response = (await responsePromise) as XMLHttpRequest;
    expect(response.status).to.equal(200);
    const responseData = JSON.parse(response.responseText);
    expect(responseData).to.deep.equal({ items: [] });
  });

  it("should send a POST request with data", async () => {
    const http = new HTTPTransport();
    const data = { username: "test", password: "password123" };
    const url = "https://jsonplaceholder.typicode.com/posts";
    const responsePromise = http.post(url, { data });

    expect(requests).to.have.lengthOf(1);
    const request = requests[0];
    
    expect(request.method).to.equal(HTTP_METHODS.POST);
    expect(request.url).to.equal(url);

    const requestData = JSON.parse(request.requestBody);
    expect(requestData).to.deep.equal(data);

    request.respond(
      201,
      { "Content-Type": "application/json" },
      JSON.stringify({ id: 1, ...data })
    );

    const response = (await responsePromise) as XMLHttpRequest;

    expect(response.status).to.equal(201);
    const responseData = JSON.parse(response.responseText);
    expect(responseData).to.deep.equal({ id: 1, ...data });
  });
});
