// Tumhara naya V2 Contract Address
export const WATCHLIST_CONTRACT_ADDRESS = '0x7C6a623Ec16d436cc4EFcF959Ed2Ef2F71A64654';

// Naya ABI (isme addCoin, removeCoin, aur dono events hain)
export const WATCHLIST_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_coinId", "type": "string" }],
    "name": "addCoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_coinId", "type": "string" }],
    "name": "removeCoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyWatchlist",
    "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "coinId", "type": "string" }
    ],
    "name": "CoinAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "coinId", "type": "string" }
    ],
    "name": "CoinRemoved",
    "type": "event"
  }
] as const;