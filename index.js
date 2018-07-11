const { randomHex, randomBuffer } = require('./lib')
require('seedrandom')

const NUM_ELEM_IN_ARRAY = 100
const STRING_LENGTH = 100
const getTypeFromPool = (typeStr, pool = [], seed = 0) => {
  Math.seedrandom(seed)
  switch (true) {
    case /\w+\[\]/.test(typeStr): {
      const numElem = NUM_ELEM_IN_ARRAY 
      return {
        numElem,
        random: () => [...Array(numElem)].map(_ => {
          const index = Math.round(Math.random() * (pool.length - 1))
          return pool[index]
        })
      }
    }
    case /\w+\[\d+\]/.test(typeStr): {
      const numElem = parseInt(typeStr.split('[')[1].split(']')[0])
      return {
        numElem,
        random: () => [...Array(numElem)].map(_ => {
          const index = Math.round(Math.random() * (pool.length - 1))
          return pool[index]
        })
      }
    }
    default: {
      return {
        numElem: 0,
        random: () => {
          const index = Math.round(Math.random() * (pool.length - 1))
          return pool[index]
        }
      }
    }
  }
}
const getType = (typeStr, seed = 0) => {
  Math.seedrandom(seed)
  switch (true) {
    case /\w+\[\]/.test(typeStr): {
      const numElem = Math.round(100 * Math.random())
      const type = typeStr.split('[')[0]
      const t = getType(type, seed)
      return {
        numElem,
        random: () => [...Array(numElem)].map(_ => t.random()),
        randomBuffer: () => Buffer
          .concat([...Array(numElem)].map(_ => t.randomBuffer()))
      }
    }
    case /\w+\[\d+\]/.test(typeStr): {
      const numElem = parseInt(typeStr.split('[')[1].split(']')[0])
      const type = typeStr.split('[')[0]
      const t = getType(type, seed)
      return {
        numElem,
        random: () => [...Array(numElem)].map(_ => t.random()),
        randomBuffer: () => Buffer
          .concat([...Array(numElem)].map(_ => t.randomBuffer()))
      }
    }
    case /u?int(\d*)/.test(typeStr): {
      const numBits = parseInt(typeStr.split('int')[1]) || 256
      return {
        numElem: 0,
        random: () => randomHex(numBits),
        randomBuffer: () => randomBuffer(numBits),
      }
    }
    case /bytes\d+/.test(typeStr): {
      return {
        numElem: 0,
        random: () => {
          const numBytes = parseInt(typeStr.split('bytes')[1])
          return randomHex(numBytes * 8)
        },
        randomBuffer: () => {
          const numBytes = parseInt(typeStr.split('bytes')[1])
          return randomBuffer(numBytes * 8)
        }
      }
    }
    case /bytes/.test(typeStr): {
      return {
        numElem: 0,
        random: (maxLen = 32) => {
          const numBytes = Math.round(maxLen * Math.random())  + 1
          return randomHex(numBytes * 8)
        },
        randomBuffer: (maxLen = 32) => {
          const numBytes = Math.round(maxLen * Math.random())  + 1
          return randomBuffer(numBytes * 8)
        },
      }
    }
    case /string/.test(typeStr): {
      return {
        numElem: 0,
        random: () => {
          const numBytes = STRING_LENGTH + 1
          return randomBuffer(numBytes * 8).toString()
        },
        randomBuffer: (maxLen = 1000) => {
          const numBytes = Math.round(maxLen * Math.random()) + 1
          return randomBuffer(numBytes * 8)
        },
      }
    }
    case /address/.test(typeStr): {
      return {
        numElem: 0,
        random: () => randomHex(160),
        randomBuffer: () => randomBuffer(160),
      }
    }
    case /bool/.test(typeStr): {
      const pool = [0x00, 0x01]
      return {
        numElem: 0,
        random: () => {
          const index = Math.round(Math.random())
          return pool[index]
        },
        randomBuffer: () => randomBuffer(8),
      }
    }
    default: {
      throw new Error(`unknown type ${typeStr}`)
    }
  }
}

module.exports = {
  getType,
  getTypeFromPool,
}
