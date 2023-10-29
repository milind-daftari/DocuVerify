import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseEther } from 'ethers';

export const getBalance = async (address) => {
    const provider = new Web3Provider(window.ethereum);
    try {
        const balance = await provider.getBalance(address);
        console.log("Fetched balance:", balance);
        return formatEther(balance);
    } catch (error) {
        console.error("Error getting balance:", error);
    }
}

export const getNetworkName = async () => {
    const provider = new Web3Provider(window.ethereum);
    try {
        const network = await provider.getNetwork();
        console.log("Fetched network:", network);
        return network.name;
    } catch (error) {
        console.error("Error getting network:", error);
    }
}

export const sendTransaction = async (to, value) => {
    const signer = (new Web3Provider(window.ethereum)).getSigner();
    const txResponse = await signer.sendTransaction({
        to: to,
        value: parseEther(value)
    });
    return txResponse;
}
