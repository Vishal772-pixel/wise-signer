> [!NOTE]
> This repo is a work in progress


# Wise Signer

This is a website for teaching people how to sign transactions, and how to make sure they are signing what's correct. It's broken down into 2 segments.

1. Simulated wallets
   1. Just show images, don't use an actual wallet
2. Real wallets

Simulated Wallet Challenges (leave for Updraft):
- EOA
  - Sign in with Ethereum (MetaMask side pop up) ✅ 
  - Basic ETH transfer (Trezor pop up) ✅ 
  - Aave Deposit (MetaMask side pop up) ✅ 
  - EIP-712 signature (MetaMask side pop up) ✅ 
- Smart contract wallet 
  - Basic Token transfer, first signer (MetaMask & trezor side pop up) 
    - Show
  - Token transfer with confusing phishing token (MetaMask & trezor side pop up) 
  - EIP-712 signature (Trezor) 
    - Do it correct, only show data 
  - EIP-712 siganture (metamask) 
    - Show EIP-712 raw 

Connected Wallet Challenges:
- Tenderly setup (virtual testnet setup)
  - eternal safe setup
  - https://eternalsafe.eth.limo?chainId=84532&chain=Base%20Sepolia&shortName=base-sepolia&rpc=https%3A%2F%2Fsepolia.base.org&currency=ETH&symbol=ETH&expAddr=https%3A%2F%2Fsepolia.basescan.org%2Faddress%2F%7B%7Baddress%7D%7D&expTx=https%3A%2F%2Fsepolia.basescan.org%2Ftx%2F%7B%7Bhash%7D%7D&l2=true&testnet=true
- EOA - Oh no! Safe Wallet is down! 
  - Uniswap swap
  - EIP-712 signature
- Smart contract wallet
  - Basic ETH transfer, first signer

# Tenderly game plan 
- Options:
  - Create tenderly network from API Key, account name, and project name
    - Saves http endpoint to local storage
  - I already have a tenderly virtual network (connect, set/check chainId)
    - Save http endpoint to local storage
  
# Safe Wallet Game Plan...
1. User connects wallet and confirms address
2. Once confirmed, in one go, do:
   1. Fund user wallet
   2. Fund anvil5 with 1 ETH 
      1. https://virtual.sepolia.rpc.tenderly.co/2266f442-859b-4462-8195-99a709746ffe 
   ```
   {method: "tenderly_addBalance",…}
   id
   : 
   3
   jsonrpc
   : 
   "2.0"
   method
   : 
   "tenderly_addBalance"
   params
   : 
   [["0x6f17CF065E3f4FF35a176fC7E2ee5791047035F6"], "0xde0b6b3a7640000"]
   0
   : 
   ["0x6f17CF065E3f4FF35a176fC7E2ee5791047035F6"]
   0
   : 
   "0x6f17CF065E3f4FF35a176fC7E2ee5791047035F6"
   1
   : 
   "0xde0b6b3a7640000"
   ```
   3. Have it deploy custom Safe address for each question, save to local storage
   4. For each question, set 2/3 signers as:
      1. anvil5
      2. whatever wallet is connected
      3. anvil6
   5. Setup eternalsafe with custom network 
3. Give user JSON object to import to eternalsafe to have safe setup
4. Drop user to question 1



