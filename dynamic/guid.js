const CHARS = "0123456789abcdefghijklmnopqrstuvwxyz"

const rand = () =>
  CHARS[ Math.random() * CHARS.length | 0 ]

const stamp = () =>
  (+new Date()).toString(36)

const group = (n, result = "") =>
  result.length >= n
    ? result
    : group(n, result + rand())

export const guid = () => ([
  stamp(),
  group(4),
  group(4),
  group(4),
  group(12),
].join("-"))
