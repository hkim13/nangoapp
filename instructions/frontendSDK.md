## Conversation thread to better understand the Nango frontend SDK integration process:
so i want to create a web application that handles oauth credentials. We're also using n8n to handle the workflow of the data thats received (if we receive all the necessary data from nango after access is granted from the user, then we'll simply pass on the necessary data to the n8n workflow. If not all data is able to be acquired, then we'd need to send over the external credentails (i.e. gmail or airtable) over to n8n to pull additional data within n8n). What process is recommended? OAuth, api key, basic?

Response:

Based on your requirements, I recommend using OAuth as the primary authorization method for your web application. Here's why and how you can implement it:
1. OAuth is the most secure and widely adopted method for handling third-party API access. It's especially suitable for services like Gmail and Airtable.
2. Nango supports OAuth out of the box, making it easy to implement in your application.
3. Here's how you can integrate Nango's frontend SDK to handle OAuth:
// Initialize Nango
const nango = new Nango({ publicKey: 'YOUR_PUBLIC_KEY' });
// Trigger OAuth flow
nango.auth('YOUR_INTEGRATION_ID', 'UNIQUE_CONNECTION_ID')
  .then((result) => {
    // Authorization successful
    // You can now use this connection to make API calls or pass data to n8n
  })
  .catch((error) => {
    // Handle authorization error
  });
4. After successful authorization, Nango will store the OAuth credentials securely. You can then use Nango's backend SDK to make API calls to the external service or retrieve the necessary data.
5. If you need to pass credentials to n8n for additional data retrieval:
• You can use Nango's API to get the connection details.
• Pass these details securely to your n8n workflow.
6. For cases where not all data is acquired through Nango, you can implement a hybrid approach:
• Use Nango for the initial OAuth flow and data retrieval.
• If additional data is needed, use n8n with the credentials obtained through Nango to fetch the remaining data.


so i want to create this step by step. if i integrate nango's frontend SDK to handle OAuth, does this allow the user to already connect their third party softwares like Airtable? If yes, what information do i need (nango public key,etc.)
Yes, integrating Nango's frontend SDK allows users to connect their third-party software like Airtable using OAuth. Here's a step-by-step guide on how to implement this:
7. Install Nango's frontend SDK:
npm install @nangohq/frontend

8. Initialize Nango in your frontend code:
import { Nango } from '@nangohq/frontend';

const nango = new Nango({ publicKey: 'YOUR_PUBLIC_KEY' });

9. Trigger the OAuth flow:
nango.auth('AIRTABLE_INTEGRATION_ID', 'UNIQUE_CONNECTION_ID')
  .then((result) => {
    // Authorization successful
    console.log('Connected successfully:', result);
  })
  .catch((error) => {
    // Handle authorization error
    console.error('Connection failed:', error);
  });

The information you need:
• Nango public key: You can find this in your Nango dashboard.
• Integration ID: This is specific to each integration (e.g., Airtable) and can be found in the integration settings on the Nango UI.
• Connection ID: A unique identifier for each user's connection. You generate this on your end.
Remember to set up the OAuth app for Airtable (or any other service) in their developer portal and configure it in Nango before attempting to connect.


## Frontend SDK - nango documentation
Use Integrations - Reference
Frontend SDK
Trigger authorization flows in your frontend with this SDK. It is available on NPM as @nangohq/frontend.

​
Instantiate the frontend SDK

import Nango from '@nangohq/frontend';

const nango = new Nango({ connectSessionToken: '<CONNECTION-SESSION-TOKEN>' });
Parameters


Hide child attributes

​
config
object
required

Hide options

​
publicKey
string
deprecated
Get your public key in the environment settings of the Nango UI. This is key is not sensitive.

​
host
string
Omitting the host points to Nango Cloud. For local development, use http://localhost:3003. Use your instance URL if self-hosting.

​
websocketsPath
string
For self-hosted instances only to specify a customs path for the WebSocket connection.

​
width
number
Specify a specific width for the OAuth authorization modal.

​
height
number
Specify a specific height for the OAuth authorization modal.

​
debug
boolean
Print additional console logs to debug authorization issues.

​
Connect using Nango Connect UI
Nango provides a UI component that guides your app’s users through automatically and securely setting up an integration. This UI is hosted on Nango’s servers and requires minimal setup on your end to get started quickly. This is the recommended way to use Nango in your frontend.


const connectUI = nango.openConnectUI({ sessionToken: 'SESSION_TOKEN' });
Parameters


Hide child attributes

​
sessionToken
string
The unique token to identify your user. It is required but can be set asynchronously.

​
baseURL
string
The base URL to load the UI, default: https://connect.nango.dev

​
apiURL
string
The base URL to reach Nango API, default: https://api.nango.dev

​
onEvent
function
A callback to listen to events sent by Nango Connect

Response


Hide child attributes

​
connectUI
ConnectUI
The class to manipulate Nango Connect

​
Connect using the headless client
You store end-user credentials with the nango.auth method. It creates a connection in Nango.

OAuth
API Key
Basic Auth
For OAuth, this will open a modal to let the user log in to their external account.


const result = await nango.auth('<INTEGRATION-ID>').catch((error) => {
...
});
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID that you can find in the integration settings on the Nango UI.

​
connectionId
string
The connection ID that you can find in the Connections tab on the Nango UI.

​
options
object

Hide options

​
params
object
Specify additional connection configuration necessary to perform the authorization request.

​
hmac
string
deprecated
HMAC key to secure the authorization flow

​
detectClosedAuthWindow
boolean
If true, nango.auth() would fail if the login window is closed before the authorization flow is completed.

​
authorization_params
object
For OAuth, specify the query parameters of the authorization URL.

​
user_scope
string[]
For Slack OAuth, specify user-specific scopes.

​
credentials
object

Hide credentials

​
apiKey
string
For API key authorization, pass in the user’s API key.

​
username
string
For Basic authorization, pass in the user’s username.

​
password
string
For Basic authorization, pass in the user’s password.

​
oauth_client_id_override
string
For OAuth 2, override the integration’s client ID with a connection-level client ID. This is useful when your users bring their own OAuth 2 app (e.g. Netsuite).

​
oauth_client_secret_override
string
For OAuth 2, override the integration’s client secret with a connection-level client secret. This is useful when your users bring their own OAuth 2 app (e.g. Netsuite).

Success response


Hide child attributes

​
providerConfigKey
string
The integration ID that you can find in the integration settings on the Nango UI.

​
connectionId
string
The connection ID that you can find in the Connections tab on the Nango UI.

Error response


Hide child attributes

​
error
object

Hide error

​
type
string
The type of error (e.g. ‘authorization_cancelled’).

​
message
string
The detailed error message (e.g. ‘Authorization fail: The user has closed the authorization modal before the process was complete.’).

By default we are auto generating the connectionId which is the unique identifier of this connection but ou can also specify it like this:


const result = await nango.auth('<INTEGRATION-ID>', '<CONNECTION-ID>');