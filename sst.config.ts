import { SSTConfig } from "sst";
import { Api, NextjsSite, Table } from "sst/constructs"; 

export default {
  config(_input) {
    return {
      name: "alavi-hospitals-app",
      region: "ap-south-1",
      profile: "ah-prod",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      
      const api = new Api(stack, "Api", {
        cors: {
          allowMethods: ["ANY"],
          allowHeaders: ["*"],
          allowOrigins: [
            "http://localhost:3000"
          ],
        },
        defaults: {
          function: {
            handler: "packages/functions/src/index.handler",
            environment: {
                GMAIL_USER: "alavihospitalsdm@gmail.com", 
                GMAIL_PASS: "lwht lurc uegf kwgw",
                AWS_S3_BUCKET_NAME: "alavi-hospitals-assets", 
            },
            permissions: ["dynamodb", "s3"],
          },
        },
        routes: {
          "ANY /{proxy+}": "packages/functions/src/index.handler",
          "POST /api/submit-form": "packages/functions/src/forms.submit",
        },
      });

      // 2. DISABLE THE FRONTEND (Deployment moved to Amplify)
      const site = new NextjsSite(stack, "Site", {
        path: "packages/client-web",
        environment: {
          NEXT_PUBLIC_API_URL: api.url,
        },
      });

      // 3. OUTPUT THE API URL
      stack.addOutputs({
        ApiEndpoint: api.url,
      });
    });
  },
} satisfies SSTConfig;