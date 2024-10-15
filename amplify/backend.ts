import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { scanLogApi } from './Flex_Api/resource';

defineBackend({
  auth,
  data,
  scanLogApi
});
