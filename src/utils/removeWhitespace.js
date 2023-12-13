export function removeWhitespace(s) {
  return s.replace(/\s{1,}([\.+,?!:-])/g, '$1')
}