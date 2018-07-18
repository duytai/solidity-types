class SolType {
  constructor(options) {
    const {
      numElem = 0,
      numSubElem = 0,
      value = Buffer.from([]),
      isBool = false,
      isString = false,
    } = options
    this.numElem = numElem
    this.numSubElem = numSubElem
    this.value = value
    this.isBool = isBool
    this.isString = isString
    this.bufSize = this.value.length
  }
  
  setValue(value) {
    if (!Buffer.isBuffer(value))
      throw new Error(`Input must be a buffer`)
    if (this.bufSize !== this.value.length)
      throw new Error(`Input must have size of ${this.bufSize}`)
    this.value = value
  }
  
  getValue() {
    return this.value
  }

  decode() {
    const decodeAtomicType = ({ value, isBool, isString }) => {
      if (isBool) {
        const haftByteInt = 128 
        const boolInt = parseInt(value.toString('hex'), 16)  
        if (boolInt >= haftByteInt) return 1
        return 0
      }
      if (isString) {
        return value.toString()
      }
      return `0x${value.toString('hex')}`
    }

    const decodeArrayType = ({ value, isBool, isString, numElem }) => {
      const valueSize = value.length
      const elemSize = valueSize / numElem
      const elemValues = []
      let counter = 0
      while (counter < valueSize) {
        elemValues.push(value.slice(counter, counter + elemSize))
        counter += elemSize
      }
      return elemValues.map(elemValue => decodeAtomicType({
        isBool,
        isString,
        value: elemValue,
      }))
    }

    if (!this.numSubElem && !this.numElem) {
      return decodeAtomicType({
        isBool: this.isBool,
        isString: this.isString,
        value: this.value,
      })
    }

    if (!this.numSubElem && this.numElem) {
      return decodeArrayType({
        isBool: this.isBool,
        isString: this.isString,
        value: this.value,
        numElem: this.numElem,
      })
    }

    if (this.numSubElem && this.numElem) {
      const valueSize = this.value.length
      const elemSize = valueSize / this.numElem
      const elemValues = []
      let elemCounter = 0
      while (elemCounter < valueSize) {
        const elemValue = decodeArrayType({
          isBool: this.isBool,
          isString: this.isString,
          numElem: this.numSubElem,
          value: this.value.slice(elemCounter, elemCounter + elemSize),
        })
        elemValues.push(elemValue)
        elemCounter += elemSize
      }
      return elemValues
    }
  }
}

module.exports = SolType 
