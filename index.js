const seedrandom = require('seedrandom')
const { 
  randomBuffer,
  SolType,
} = require('./lib')

const NUM_ELEM = 5 
const NUM_SUB_ELEM = 5
const STRING_LENGTH = 5 
const BYTES_LENGTH = 5

const getType = (typeStr, len = 0) => {
  switch (true) {
    case /\w+\[\d*\]\[\d*\]/.test(typeStr): {
      let numElem = NUM_ELEM
      let numSubElem = NUM_SUB_ELEM
      if (/\[\d+\]\[\d+\]/.test(typeStr)) {
        const typeElems = typeStr.split(/\[|\]/)
        numElem = parseInt(typeElems[1])
        numSubElem = parseInt(typeElems[3])
      }
      const type = typeStr.split('[')[0]
      const isBool = type === 'bool'
      const isString = type === 'string'
      let value = Buffer.concat(
        [...Array(numElem)].map(_ => getType(`${type}[${numSubElem}]`).getValue())
      ) 
      return new SolType({
        numElem,
        numSubElem,
        isBool,
        isString,
        value,
      })
    }
    case /\w+\[\d*\]/.test(typeStr): {
      let numElem = NUM_ELEM
      if (/\[\d+\]/.test(typeStr)) {
        numElem = parseInt(typeStr.split('[')[1].split(']')[0])
      }
      const type = typeStr.split('[')[0]
      const isBool = type === 'bool'
      const isString = type === 'string'
      const value = Buffer.concat(
        [...Array(numElem)].map(_ => getType(type).getValue())
      )
      return new SolType({
        numElem,
        isString,
        isBool,
        value,
      })
    }
    case /^u?int\d*$/.test(typeStr): {
      const numBits = parseInt(typeStr.split('int')[1]) || 256
      const type = typeStr.split(/\d+/)[0]
      const value = randomBuffer(numBits)
      return new SolType({
        value,
      })
    }
    case /^bytes\d*$/.test(typeStr): {
      let numBytes = parseInt(typeStr.split('bytes')[1]) || BYTES_LENGTH 
      const type = typeStr.split(/\d+/)[0]
      const value = randomBuffer(numBytes * 8)
      return new SolType({
        value,
      })
    }
    case /^string$/.test(typeStr): {
      const value = randomBuffer(STRING_LENGTH * 8)
      return new SolType({
        value,
        isString: true,
      })
    }
    case /^address$/.test(typeStr): {
      const value = randomBuffer(160)
      return new SolType({
        value,
      })
    }
    case /^bool$/.test(typeStr): {
      const value = randomBuffer(8)
      return new SolType({
        value,
        isBool: true,
      })
    }
    default: {
      const value = randomBuffer(len * 8)
      return new SolType({
        value,
      })
    }
  }
}

module.exports = {
  getType,
  randomBuffer,
}
