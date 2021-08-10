export const characters = [
  {
    name: 'a space',
    in: /·/g,
    out: ' ',
    char: '·'
  },
  {
    name: 'a tab',
    in: /»/g,
    out: '\t',
    char: '»'
  },
  {
    name: 'a carriage return and a line feed',
    in: /␍␊\n?/g,
    out: '\r\n',
    char: '␍␊'
  },
  {
    name: 'a line feed',
    in: /␊\n?/g,
    out: '\n',
    char: '␊'
  }
]
