import { defineBackend } from "@aws-amplify/backend";
// import { Stack } from "aws-cdk-lib";
// import {
//   AuthorizationType,
//   CognitoUserPoolsAuthorizer,
//   Cors,
//   LambdaIntegration,
//   RestApi,
// } from "aws-cdk-lib/aws-apigateway";
// import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { myApiFunction } from "./functions/api-function/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

import { FlexApiFunction } from './Flex_Api/resource';

const backend = defineBackend({
  auth,
  data,
  myApiFunction,
  FlexApiFunction
});


