import { Contract } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { parseEther, formatEther } from '@ethersproject/units';

export async function registerDocument(docHash) {
    const contract = getContract();
    const timestamp = Math.floor(Date.now() / 1000);
    const formattedFee = parseEther('0.0001').toString();

    try {
        const transaction = await contract.registerDocument(docHash, timestamp, {
            value: formattedFee,
            gasLimit: '150000'
        });
        console.log('Transaction sent:', transaction);

        // Wait for the transaction to be confirmed
        const status = await checkTransactionStatus(transaction.hash);
        
        // Return an object that includes the status
        return { status, transactionHash: transaction.hash };
    } catch (error) {
        console.error('Error registering document:', error);
        return { status: 'Error', message: error.message };
    }
}


export async function verifyDocument(docHash, userAddress) {
    const contract = getContract();
    try {
        // Call the verifyDocument method of the contract and wait for the result
        const [verified, timestamp, ret_hash] = await contract.verifyDocument(docHash, userAddress);
        console.log('Verification result:', verified, 'Timestamp:', timestamp, 'Returned hash:', ret_hash);

        // Return the result of verification
        return { verified, timestamp, ret_hash };
    } catch (error) {
        console.error('Error verifying document:', error);
        return { verified: false, message: error.message };
    }
}


export async function checkBalance() {
    const contract = getContract();
    try {
        const balance = await contract.getBalance();
        console.log(`Contract Balance: ${formatEther(balance)} ETH`);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

export function getContract() {
    // Replace with your contract's address and ABI
    const contractAddress = '0x91C7de645952EeF92B031603eB93b25FE40d5340';
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"bytes32","name":"hash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DocumentRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"DocumentVerified","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"registerDocument","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"uploadFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"address","name":"user","type":"address"}],"name":"verifyDocument","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"verifyFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new Contract(contractAddress, abi, signer);
}

async function checkTransactionStatus(txHash) {
    const provider = new Web3Provider(window.ethereum);
    while (true) {
        let txReceipt = await provider.getTransactionReceipt(txHash);
        if (txReceipt && txReceipt.blockNumber) {
            return txReceipt.status === 1 ? 'Success' : 'Failed';
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
}
