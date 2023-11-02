function ConnectWallet({ onConnect, onDisconnect, account }) {
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                onConnect(selectedAccount);
            } catch (error) {
                console.error('User rejected request:', error);
            }
        } else {
            console.error('MetaMask is not installed!');
        }
    };

    const disconnectWallet = () => {
        if (window.ethereum) {
            window.ethereum._metamask.disconnect();
            onDisconnect();
        }
    };

    return (
        <div>
            {!account ? (
                <button onClick={connectWallet}>Connect to MetaMask</button>
            ) : (
                <>
                    <p>Connected Account: {account}</p>
                    <button onClick={disconnectWallet}>Disconnect</button>
                </>
            )}
        </div>
    );
}

export default ConnectWallet;
