export function trim(string: string, chars: string): string {
  let str = ' ' + string + ' ';

  if (str && chars === undefined) {
    return string.trim();
  }

  if (!str || !chars) {
    return (string || '');
  }

  const regFirst = new RegExp(` ${chars}`, 'gi');
  const regSecond = new RegExp(`${chars} `, 'gi');

  return str
    .replace(regFirst, '')
    .replace(regSecond, '')
    .trim();
}
