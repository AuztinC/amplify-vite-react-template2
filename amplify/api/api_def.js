import { API } from '@aws-amplify/api';
import { secret } from '@aws-amplify/backend';

const apiName = 'getScanLog';
const path = 'https://ssav.flexrentalsolutions.com/f5/api/scan-log/scan-history?page=0&size=20';
const headers = {
  'X-Auth-Token': secret('X_AUTH_TOKEN'),
};

const getScanLog = async ()=>{
    API.get(apiName, path, {
        headers,
      })
        .then(response => console.log(response))
        .catch(error => console.error(error));
};

export {
    getScanLog
};

