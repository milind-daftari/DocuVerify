import { Web3Provider } from '@ethersproject/providers';
import { BigNumber} from "@ethersproject/bignumber";
import { formatEther} from "@ethersproject/units";

export const getBalance = async (address) => {
    const provider = new Web3Provider(window.ethereum);
    try {
        const balance = await provider.getBalance(address);
        console.log("Fetched raw balance:", balance);
        
        // Check if the balance is a valid BigNumber before formatting
        if (BigNumber.isBigNumber(balance)) {
            return formatEther(balance);
        } else {
            console.error("Balance is not a valid BigNumber:", balance);
            return "0.0";  // Default to zero if the balance isn't valid
        }
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
