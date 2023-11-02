import { Auth, Storage } from 'aws-amplify';

export const authenticateWithCognito = async (userAddress) => {
    const providerName = `docuverify.auth.provider`; 
    const logins = {};
    logins[providerName] = userAddress;

    try {
        // Authenticate with Cognito
        await Auth.federatedSignIn(providerName, { token: userAddress, identity_id: '', expires_at: (new Date().getTime() + 3600000) }, logins);

        // After successful authentication with Cognito, set up AWS credentials for Amplify's Storage
        const credentials = await Auth.currentCredentials();
        Storage.configure({ credentials });

        console.log('Successfully authenticated and configured credentials for S3');
    } catch (err) {
        console.error('Error in the authentication process:', err);
        throw err;
    }
};
