const { getType } = require('../')
const { expect } = require('chai')

it('<type>[][]', () => {
  const types = ['string', 'bytes', 'int', 'uint', 'address', 'bool']
    .concat([...Array(32)].map((_, index) => `bytes${index + 1}`))
    .concat([...Array(32)].map((_, index) => `int${(index + 1) * 8}`))
    .concat([...Array(32)].map((_, index) => `uint${(index + 1) * 8}`))
  // dynamic
  types.forEach(type => {
    const t = getType(`${type}[10][10]`)
    const value = t.getValue()
    const data = t.decode()
    expect(data.length).to.equal(10)
    expect(Buffer.isBuffer(value)).to.be.true
    for (let i = 0; i < 10; i++) {
      expect(data[i].length).to.equal(10)
    }
  })
})

it('<type>[]', () => {
  const types = ['string', 'bytes', 'int', 'uint', 'address', 'bool']
    .concat([...Array(32)].map((_, index) => `bytes${index + 1}`))
    .concat([...Array(32)].map((_, index) => `int${(index + 1) * 8}`))
    .concat([...Array(32)].map((_, index) => `uint${(index + 1) * 8}`))
  types.forEach(type => {
    for (let n = 0; n < 10; n++) {
      const t = getType(`${type}[]`)
      const value = t.getValue()
      const data = t.decode()
      expect(Buffer.isBuffer(value)).to.be.true
    }
  })
})
it('<type>[M]', () => {
  const types = ['string', 'bytes', 'int', 'uint', 'address', 'bool']
    .concat([...Array(32)].map((_, index) => `bytes${index + 1}`))
    .concat([...Array(32)].map((_, index) => `int${(index + 1) * 8}`))
    .concat([...Array(32)].map((_, index) => `uint${(index + 1) * 8}`))
  types.forEach(type => {
    for (let i = 1; i < 10; i++) {
      for (let n = 0; n < 10; n++) {
        const t = getType(`${type}[${i}]`)
        const value = t.getValue()
        const data = t.decode()
        expect(data.length).to.equal(i)
        expect(Buffer.isBuffer(value)).to.be.true
      }
    }
  })
})
it('string', () => {
  for (let i = 0; i < 100; i++) {
    const t = getType('string')
    const value = t.getValue()
    const str = t.decode() 
    expect(typeof str).to.equal('string')
    expect(Buffer.isBuffer(value)).to.be.true
  }
})

it('bytes', () => {
  for (let i = 0; i < 100; i++) {
    const t = getType(`bytes`)
    const value = t.getValue()
    expect(value.length).gt(0)
    expect(t.decode().slice(0, 2)).to.equal('0x')
    expect(Buffer.isBuffer(value)).to.be.true
  }
})
it('bytes<M>', () => {
  for (let i = 1; i <= 32; i++) {
    for (let n = 0; n < 100; n++) {
      const t = getType(`bytes${i}`)
      const value = t.getValue()
      const data = t.decode()
      expect(data.slice(0, 2)).to.equal('0x')
      expect(value.length).to.equal(i)
      expect(Buffer.isBuffer(value)).to.be.true
    }
  }
})

it('address', () => {
  for (let i = 0; i < 100; i++) {
    const t = getType('address')
    const value = t.getValue()
    expect(Buffer.isBuffer(value)).to.be.true
    expect(value.length).to.equal(20)
    expect(t.decode().length).to.equal(42)
    expect(t.decode().slice(0, 2)).to.equal('0x')
  }
})

it('uint<M>/int<M>', () => {
  const types = ['int', 'uint']
  types.forEach(type => {
    for (let i = 0; i <= 256; i += 8) {
      const intExt = i == 0 ? '' : i
      const intNumBits = i == 0 ? 256 : i
      for (let n = 0; n < 100; n++) {
        const t = getType(`${type}${intExt}`)
        const value = t.getValue()
        const data = t.decode()
        expect(Buffer.isBuffer(value)).to.be.true
        expect(value.length).to.equal(intNumBits/8)
        expect(data.slice(0, 2)).to.equal('0x')
      }
    }
  })
})

it('bool', () => {
  for (let i = 0; i < 100; i++) {
    const t = getType('bool') 
    const value = t.getValue()
    expect([0, 1].includes(t.decode())).to.be.true
    expect(Buffer.isBuffer(value)).to.equal(true)
    expect(value.length).to.equal(1)
  }
})
