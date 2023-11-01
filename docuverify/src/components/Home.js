import React, { useState, useEffect } from 'react';
import { getBalance, getNetworkName } from '../utility/blockchain'; 

function Home({ account }) {
    const [balance, setBalance] = useState(null);
    const [networkName, setNetworkName] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            if (account) {
                try {
                    const accountBalance = await getBalance(account);
                    const netName = await getNetworkName();
                    setBalance(accountBalance);
                    setNetworkName(netName);
                } catch (error) {
                    console.error("Error fetching details:", error);
                }
            }
        };
        fetchDetails();
    }, [account]);

    return (
        <div className="container" style={{ marginTop: '4rem' }}>
            {account ? (
                <>
                    <h2>Welcome to DocuVerify</h2>
                    <p>Hi, {account}</p>
                    {balance !== null && <p>Your balance: {balance}</p>}
                    {networkName && <p>Network: {networkName}</p>}
                </>
            ) : (
                <p>Please connect with your wallet.</p>
            )}
        </div>
    );
}

export default Home;
