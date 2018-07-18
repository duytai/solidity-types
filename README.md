# Solidity-types
Generate random values for solidity contracts based on types
### 1. Installation

```bash
npm i --save solidity-types
```
### 2. Usage

```javascript
import { getType } from 'solidity-types'

// return randomized values
const t = getType('uint256')
const value = t.decode() // get value to encode abi
const buf = t.getValue() // return buffer which contains your type

```
