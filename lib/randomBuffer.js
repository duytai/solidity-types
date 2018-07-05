const randomBuffer = numBits => Buffer.from([...Array(numBits/4)].reduce((r) => {
  const pool = '0123456789ABCDEF'
  const index = Math.round(Math.random() * 15) 
  return `${r}${pool[index]}`
}, ''), 'hex')

module.exports = randomBuffer

