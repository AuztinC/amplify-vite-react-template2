import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/Flex_Api'
import axios from 'axios';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  const { API_STRING } = event.arguments
  const request = await axios.get(env.API_ENDPOINT + API_STRING, {
    headers: {
      // this is the value of secret named "MY_API_KEY"
      'X-Auth-Token': `${env.API_KEY}`
    }
  })
  // ...
  const response = request.data.content
  return response
}