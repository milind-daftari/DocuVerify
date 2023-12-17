async function registerDocument(docContent) {

    const docHash = ethers.utils.id(docContent);
    const contract = getContract();

    // Generate a current timestamp (in seconds)
    const timestamp = Math.floor(Date.now() / 1000);

    // Convert the fee to wei
    const formattedFee = ethers.utils.parseEther('0.0001').toString();

    try {
        const transaction = await contract.registerDocument(docHash, timestamp, {
            value: formattedFee
        });
        console.log('Transaction sent:', transaction);
    } catch (error) {
        console.error('Error registering document:', error);
    }
}


async function verifyDocument(docContent, userAddress) {

    const hash = ethers.utils.id(docContent);
    const contract = getContract();

    try {
        const [verified, timestamp, ret_hash] = await contract.verifyDocument(hash, userAddress);
        console.log('Verification result:', verified, 'Timestamp:', timestamp);
    } catch (error) {
        console.error('Error verifying document:', error);
    }
}

async function checkBalance() {
    const contract = getContract();
    try {
        const balance = await contract.getBalance();
        document.getElementById('balance').innerText = `Contract Balance: ${ethers.utils.formatEther(balance)} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

function getContract() {
    // Replace with your contract's address and ABI
    const contractAddress = '0x91C7de645952EeF92B031603eB93b25FE40d5340';
    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"bytes32","name":"hash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"DocumentRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"DocumentVerified","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"registerDocument","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"uploadFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"address","name":"user","type":"address"}],"name":"verifyDocument","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"verifyFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
}
