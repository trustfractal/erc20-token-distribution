# ERC20 Token Distribution

_(cliff and lockup here used interchangeably)_

Deploys [OpenZeppelin's TokenVesting Contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/drafts/TokenVesting.sol) with the given recipient, start time, lockup duration, vesting duration, and revocability.

## Filling the contract

After deployment, the contract needs to be sent the tokens to vest.

## Vesting schedule

The vesting schedule is defined by 3 parameters (in seconds):
* `Start`: time at which both the lockup and vesting period start counting
* `CliffDuration`: lockup duration; i.e. elapsed time after `Start`, before which no assets are withdrawable, and after which any vested assets are withdrawable
* `Duration`: length of the vesting period; i.e. elapsed time after `Start`, after which all assets will be vested

:information_source: For a "first monthly tranche" to be available right after the cliff elapses, `Start` should be 1 month before the first expected tranche, and `CliffDuration` should be 1 month.

:warning: Vesting is done not monthly, but every second. This means that, once the cliff elapses, tokens can be withdrawn as frequently as desired.

### Example

:warning: In this example, 1 month = 30 days

For a 3 month lockup after 2021.02.05, 3 months vesting, and 100 FCL:
* `Start`: `1619395200` (2021.04.26, 2 months after 2021.02.25)
* `CliffDuration`: `2592000` (30 days, during which the first tranche vests)
* `Duration`: `10368000` (4 months: vesting + 1)

```
⚙️  Distribution parameters

	Amount:  100 FCL
	Lockup:  3 months
	Vesting: 3 months

	➡️  Tranches: 4 (ca. 25 FCL each)
	➡️  1st tranche due: 2021.05.26


⚙️  Contract parameters

	start:             1619395200 (2021.04.26: 1 month before first contract tranche due)
	cliffDuration:        2592000 (1 month: during which 1/4 vests)
	duration:            10368000 (4 months: vesting + 1)

	➡️  cliff ends:     2021.05.26
	➡️  vesting ends:   2021.08.24


🔮 Distribution simulation

	🗓  Before lockup ends

	2021.05.23:              0 FCL
	2021.05.24:              0 FCL
	2021.05.25:              0 FCL

	🗓  After lockup ends

	2021.05.26:             25 FCL (tranche  1 / 4: 25 FCL)
	2021.06.25:             50 FCL (tranche  2 / 4: 25 FCL)
	2021.07.25:             75 FCL (tranche  3 / 4: 25 FCL)
	2021.08.24:            100 FCL (tranche  4 / 4: 25 FCL) ✅
```

## Deploying

Uses [Hardhat](https://hardhat.org/), as recommended in OpenZeppelin's [Deploying and interacting](https://docs.openzeppelin.com/learn/deploying-and-interacting) guide.

1. `cp .env.example .env` and adapt
2. `npx hardhat run scripts/deploy.js --network <rinkeby|mainnet>`

## Interacting

You can use the [Hardhat console](https://hardhat.org/guides/hardhat-console.html). The contract's address is output by the deployment script, and its ABI can be found at `./artifacts/contracts/TokenVesting.sol/TokenVesting.json`.


```javascript
[signer] = await ethers.getSigners()
contract = new ethers.Contract(address, abi, signer)
contract.release("0xTokenAddress")
contact.unpause()
```

## Verifying in Etherscan

Uses [Hardhat's Etherscan plugin](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-etherscan).

1. Set `ETHERSCAN_API_KEY` in your `.env` file
2. Adapt `arguments.js`
3. Run ```npx hardhat verify --network <rinkeby|mainnet> --constructor-args arguments.js <contract address>```
