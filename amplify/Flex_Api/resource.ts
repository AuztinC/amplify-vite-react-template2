import { defineFunction, secret } from '@aws-amplify/backend';

export const scanLogApi = defineFunction({ 
    environment: {
        API_ENDPOINT: 'https://ssav.flexrentalsolutions.com/f5/api/scan-log/scan-history?page=0&size=20&sort=scanDate%2Cdesc',
        API_KEY: secret('X_AUTH_TOKEN')
    }
 });