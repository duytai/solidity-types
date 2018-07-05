const { getType } = require('../')
const { expect } = require('chai')

const maxHex = numBits => [...Array(numBits/8)].reduce((r) => `${r}FF`, '0x')
it('<type>[]', () => {
  const types = ['string', 'bytes', 'int', 'uint', 'address', 'bool']
    .concat([...Array(32)].map((_, index) => `bytes${index + 1}`))
    .concat([...Array(32)].map((_, index) => `int${(index + 1) * 8}`))
    .concat([...Array(32)].map((_, index) => `uint${(index + 1) * 8}`))
  types.forEach(type => {
    const t = getType(`${type}[]`)
    for (let n = 0; n < 10; n++) {
      const v = t.random()
      expect(v.length).gte(0)
      expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
    }
  })
})
it('<type>[M]', () => {
  const types = ['string', 'bytes', 'int', 'uint', 'address', 'bool']
    .concat([...Array(32)].map((_, index) => `bytes${index + 1}`))
    .concat([...Array(32)].map((_, index) => `int${(index + 1) * 8}`))
    .concat([...Array(32)].map((_, index) => `uint${(index + 1) * 8}`))
  types.forEach(type => {
    for (let i = 0; i < 10; i++) {
      const t = getType(`${type}[${i}]`)
      for (let n = 0; n < 10; n++) {
        const v = t.random()
        expect(v.length).to.equal(i)
        expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
      }
    }
  })
})
it('string', () => {
  const t = getType('string')
  for (let i = 0; i < 100; i++) {
    const v = t.random()
    const buf = t.randomBuffer()
    expect(typeof v).to.equal('string')
    expect(Buffer.isBuffer(buf)).to.be.true
  }
})

it('bytes', () => {
  const t = getType(`bytes`)
  for (let i = 0; i < 100; i++) {
    const v = t.random()
    expect(v - 0).gt(0)
    expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
  }
})
it('bytes<M>', () => {
  for (let i = 1; i <= 32; i++) {
    const t = getType(`bytes${i}`)
    for (let n = 0; n < 100; n++) {
      const v = t.random()
      const maxVal = maxHex(8 * i)
      expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
      expect(v - 0).gte(0)
      expect(maxVal - v).gte(0)
    }
  }
})

it('address', () => {
  const t = getType('address')
  for (let i = 0; i < 100; i++) {
    const v = t.random()
    const buf = t.randomBuffer()
    expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
    expect(v.length).to.equal(42)
    expect(v.slice(0, 2)).to.equal('0x')
    expect(Buffer.isBuffer(buf)).to.be.true
    expect(buf.length).to.equal(20)
  }
})

it('uint<M>/int<M>', () => {
  const types = ['int', 'uint']
  types.forEach(type => {
    for (let i = 0; i <= 256; i += 8) {
      const intExt = i == 0 ? '' : i
      const intNumBits = i == 0 ? 256 : i
      const t = getType(`${type}${intExt}`)
      for (let n = 0; n < 100; n++) {
        const v = t.random()
        const maxVal = maxHex(intNumBits)
        expect(Buffer.isBuffer(t.randomBuffer())).to.be.true
        expect(v - 0).gte(0)
        expect(maxVal - v).gte(0)
      }
    }
  })
})

it('bool', () => {
  const t = getType('bool') 
  for (let i = 0; i < 100; i++) {
    const v = t.random()
    const buf = t.randomBuffer()
    expect([0, 1].includes(v)).to.equal(true)
    expect(Buffer.isBuffer(buf)).to.equal(true)
    expect(buf.length).to.equal(1)
  }
})
