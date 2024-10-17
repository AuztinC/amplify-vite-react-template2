import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/Flex_Api'
import axios from 'axios';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  const request = await axios.get(env.API_ENDPOINT, {
    headers: {
      // this is the value of secret named "MY_API_KEY"
      'X-Auth-Token': `${env.API_KEY}`
    }
  })
  // ...
  
  return request
}