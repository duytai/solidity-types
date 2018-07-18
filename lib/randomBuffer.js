const seedrandom = require('seedrandom')
const rng = seedrandom('buf')

const randomBuffer = numBits => Buffer
  .from (
    [...Array(numBits/4)]
    .reduce((r) => {
      const pool = '0123456789ABCDEF'
      const index = Math.round(rng() * 15) 
      return `${r}${pool[index]}`
    }, ''), 
    'hex'
  )

module.exports = randomBuffer

