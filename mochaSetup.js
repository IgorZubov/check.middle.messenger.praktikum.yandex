import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<body></body>");

global.window = jsdom.window;
global.document = jsdom.document;
global.Node = jsdom.window.Node;
global.MouseEvent = jsdom.window.MouseEvent;
global.SubmitEvent = jsdom.window.SubmitEvent;
global.Event = jsdom.window.Event;
global.FormData = jsdom.window.FormData;
global.XMLHttpRequest = jsdom.window.XMLHttpRequest;
