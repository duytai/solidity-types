const { randomHex } = require('./lib')
require('seedrandom')

const getType = (typeStr, seed = 0) => {
  Math.seedrandom(seed)
  switch (true) {
    case /\w+\[\]/.test(typeStr): {
      const numElem = Math.round(100 * Math.random())
      const type = typeStr.split('[')[0]
      const t = getType(type, seed)
      return {
        random: () => [...Array(numElem)].map(_ => t.random()),
      }
    }
    case /\w+\[\d+\]/.test(typeStr): {
      const numElem = parseInt(typeStr.split('[')[1].split(']')[0])
      const type = typeStr.split('[')[0]
      const t = getType(type, seed)
      return {
        random: () => [...Array(numElem)].map(_ => t.random()),
      }
    }
    case /u?int(\d*)/.test(typeStr): {
      const numBits = parseInt(typeStr.split('int')[1]) || 256
      return {
        random: () => randomHex(numBits)
      }
    }
    case /bytes\d+/.test(typeStr): {
      return {
        random: () => {
          const numBytes = parseInt(typeStr.split('bytes')[1])
          return randomHex(numBytes * 8)
        } 
      }
    }
    case /bytes/.test(typeStr): {
      return {
        random: (maxLen = 32) => {
          const numBytes = Math.round(maxLen * Math.random())  + 1
          return randomHex(numBytes * 8)
        }
      }
    }
    case /string/.test(typeStr): {
      return {
        random: (maxLen = 1000) => {
          const numBytes = Math.round(maxLen * Math.random()) + 1
          return Buffer.from(randomHex(numBytes * 8).slice(2), 'hex').toString()
        },
      }
    }
    case /address/.test(typeStr): {
      return {
        random: () => randomHex(160),
      }
    }
    case /bool/.test(typeStr): {
      const pool = [0x00, 0x01]
      return {
        random: () => {
          const index = Math.round(Math.random())
          return pool[index]
        }
      }
    }
    default: {
      throw new Error(`unknown type ${typeStr}`)
    }
  }
}

module.exports = {
  getType,
}
