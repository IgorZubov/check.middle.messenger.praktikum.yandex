import Handlebars from 'handlebars';

function compiler(template: string, props: Object): string {
  return Handlebars.compile(template)(props);
}

export default compiler;
