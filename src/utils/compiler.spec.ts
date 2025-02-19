import { expect } from 'chai';
import compiler from './compiler.ts';

describe('Handlebars Template Compiler Tests', () => {

  it('should correctly compile a simple template with given props', () => {
    const template = 'Hello, {{name}}!';
    const props = { name: 'John' };

    const result = compiler(template, props);

    expect(result).to.equal('Hello, John!');
  });

  it('should handle multiple placeholders in a template', () => {
    const template = 'Hello, {{name}}! You are {{age}} years old.';
    const props = { name: 'Jane', age: 30 };

    const result = compiler(template, props);

    expect(result).to.equal('Hello, Jane! You are 30 years old.');
  });

  it('should return an empty string when no props are provided for empty placeholders', () => {
    const template = 'Hello, {{name}}!';
    const props = {};

    const result = compiler(template, props);

    expect(result).to.equal('Hello, !');
  });

  it('should handle missing props gracefully', () => {
    const template = 'Hello, {{name}}!';
    const props = { age: 25 };

    const result = compiler(template, props);

    expect(result).to.equal('Hello, !');
  });

  it('should correctly compile template with nested objects', () => {
    const template = 'Hello, {{person.name}}!';
    const props = { person: { name: 'Alice' } };

    const result = compiler(template, props);

    expect(result).to.equal('Hello, Alice!');
  });

  it('should handle arrays in the template', () => {
    const template = 'Items: {{#each items}}{{this}} {{/each}}';
    const props = { items: ['Apple', 'Banana', 'Cherry'] };

    const result = compiler(template, props);

    expect(result).to.equal('Items: Apple Banana Cherry ');
  });

  it('should handle conditional rendering with "if" helper', () => {
    const template = '{{#if isLoggedIn}}Welcome back, {{name}}!{{else}}Please log in.{{/if}}';
    const props = { isLoggedIn: true, name: 'Bob' };

    const result = compiler(template, props);

    expect(result).to.equal('Welcome back, Bob!');
  });

  it('should correctly handle empty arrays with the "each" helper', () => {
    const template = 'Items: {{#each items}}{{this}} {{/each}}';
    const props = { items: [] };

    const result = compiler(template, props);

    expect(result).to.equal('Items: ');
  });

  it('should escape HTML by default', () => {
    const template = 'Name: {{name}}';
    const props = { name: '<script>alert("XSS")</script>' };

    const result = compiler(template, props);

    expect(result).to.equal('Name: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

});
