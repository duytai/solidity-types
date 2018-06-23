const randomHex = numBits => [...Array(numBits/4)].reduce((r) => {
  const pool = '0123456789ABCDEF'
  const index = Math.round(Math.random() * 15) 
  return `${r}${pool[index]}`
},'0x')

module.exports = randomHex
