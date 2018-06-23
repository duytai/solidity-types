# Solidity-types
Generate random values for solidity contracts based on types
### 1. Installation

```bash
npm i --save solidity-types
```
### 2. Usage

```javascript
import { getTypes } from 'solidity-types'

// return randomized values
const t = getTypes('uint256')
const value = t.random()

// return value with seed 
const seed = 10
const t = getTypes('uint256', seed)
const value = t.random()

```
