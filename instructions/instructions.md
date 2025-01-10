### **Project Overview**
This project involves building a **web application** that integrates with **Nango** for managing authentication and external API connections (e.g., Airtable) while using **Supabase** to handle user login and session management. The application will utilize **Nango SDK** for OAuth flows, fetching data from third-party services, and passing it to **n8n workflows** for automation.

---

### **Goals**
1. **Authentication Management**: Use Supabase for managing user login and integrate Nango for handling OAuth connections with external APIs like Airtable.
2. **Data Handling**: Fetch user-specific data (e.g., Airtable records) using Nango, store it in Supabase, and display it in the frontend.
3. **Session Management**: Implement robust session management to maintain synchronization between the web app, Supabase, Nango, and n8n workflows.
4. **Workflow Integration**: Pass relevant user data to n8n workflows for automation.
5. **Scalability**: Ensure the solution can extend to include additional APIs and workflows in the future.

---

### **Step-by-Step Summary**

#### **1. Authentication and Session Management**
1. **Supabase Login**:
   - Use Supabase's authentication system to manage user login and store user details (`UID`, `email`, etc.).
   - Generate a `sessionId` for each authenticated session.
   - Ensure `sessionId` is stored in Supabase and is updated if expired.

2. **Session Handling**:
   - Pass the `sessionId` to Nango via `connectSessionToken` during OAuth flow.
   - Ensure synchronization between `sessionId` (Supabase), `connectionId` (Nango), and integration-specific IDs.

---

#### **2. Configure Nango**
1. **Set Up Nango SDK**:
   - Initialize the Nango client with `connectSessionToken` in the frontend.
   - Trigger the OAuth flow using `nango.openConnectUI()` to show the authorization popup to the user.

     ```javascript
     const nango = new Nango({ connectSessionToken });

     await nango.openConnectUI({
         onEvent: (event) => {
             if (event.type === 'connect') {
                 saveToDatabase(connectionId, integrationId);
             }
         }
     });
     ```

2. **Store Connection Details**:
   - After successful OAuth, save `connectionId` and `integrationId` to Supabase, along with the user's data for easy retrieval.

---

#### **3. Fetch Data from External APIs**
1. **Set Up Nango Endpoints**:
   - Enable endpoints in Nango for services like Airtable and Slack.
   - Use Nango SDK to fetch data using the stored `connectionId` and `integrationId`.

     Example for fetching records:
     ```javascript
     const records = await nango.listRecords({
         connectionId: body.connectionId,
         model: body.model,
         providerConfigKey: body.providerConfigKey,
         modifiedAfter: body.modifiedAfter,
     });
     ```

2. **Webhook Handling**:
   - Set up a webhook in the web app to receive updates from Nango when new data is added, updated, or deleted.

     Example payload:
     ```json
     {
         "connectionId": "user123",
         "providerConfigKey": "airtable",
         "model": "records",
         "responseResults": { "added": 2, "updated": 6, "deleted": 0 },
         "modifiedAfter": "2023-05-31T11:46:13.390Z"
     }
     ```

3. **Store Data in Supabase**:
   - Save the fetched data from Nango into Supabase, tied to the user's UID.

---

#### **4. Display Data in Frontend**
1. **Retrieve Data from Supabase**:
   - Query Supabase to fetch stored Airtable or Slack data for the logged-in user.
2. **Render Data**:
   - Display fetched data (e.g., Airtable base and table information) in a user-friendly format on the frontend.

---

#### **5. Workflow Integration with n8n**
1. **Data Flow**:
   - Pass user-specific data from Supabase or Nango into n8n workflows as needed.
   - For workflows requiring credentials, pass the necessary authentication tokens or credentials to n8n if not handled directly by Nango.
2. **Future-Proofing**:
   - Design workflows to handle fallback scenarios where data is unavailable in Nango by pulling directly from n8n.

---

#### **6. Slack Integration (Optional)**
1. **Connect to Slack**:
   - Use Nango to integrate with Slack's API by setting up endpoints for actions such as retrieving user information or sending messages.
2. **Enable Slack Messaging**:
   - Implement Nango’s `triggerAction` to send Slack messages programmatically.

     Example:
     ```javascript
     await nango.triggerAction(integration, connectionId, 'send-message', input);
     ```

---

#### **7. Best Practices**
1. **Session Management**:
   - Use JWTs for secure and scalable session management.
   - Implement session expiration and renewal policies to prevent unauthorized access.
2. **Error Handling**:
   - Add error handling for failed API calls (e.g., connection issues with Nango or Supabase).
   - Log failed webhook events for debugging.
3. **Scalability**:
   - Use environment variables to manage API keys and sensitive credentials.
   - Structure the database to allow for additional API integrations in the future.

---

### **Deliverables**
1. A fully functional web app that integrates with Supabase, Nango, and n8n.
2. A frontend interface for managing user connections and displaying Airtable/Slack data.
3. Robust session management to ensure secure interactions across all systems.
4. Automation workflows in n8n leveraging user-specific data from Nango and Supabase.

---


# Nango Configuration documentation - additional information
## 0. What is nango
Nango Overview
Nango is the most comprehensive product integrations platform designed for developers at B2B SaaS companies.

Nango helps you build, manage, and scale integrations with third-party APIs, through a single interface. It is as flexible as building integrations in-house, while taking care of API-specific complexities for you, so you can focus on making integrations your best product feature.

With Nango you get:

Hundreds of pre-built integrations

Ready-to-use integration templates for 300+ APIs
Developer tooling pre-configured for each API

Authorization: OAuth, API key, basic, custom
Rate-limit handling, pagination and retries
Two-way sync infrastructure
End-to-end type safety and runtime data validation
Real-time webhook infrastructure
Observability and alerting: HTTP requests, customer-level reporting, etc
Per-customer integration configuration: field mappings, toggle features, etc
Tooling to develop, test, deploy, and migrate custom integrations (git-based)
API unification with your own schemas
UI components to embed in your app
Comprehensive API documentation

Hundreds of API quirks, gotchas, helpful links, and hard-earned learnings
Access to API experts

Experts for enterprise APIs (Netsuite, Workday, Salesforce, SAP, etc.)
Sandbox accounts
Service to build your custom integrations
​
How is Nango different from unified APIs and embedded iPaaS?
Nango is built to replace building integrations in-house—offering the same flexibility and control, but faster and with less maintenance overhead. It is strictly developer-first, designed to support any API and empower developers to create exactly the integrations their customers need.

Unified APIs and embedded iPaaS tools take a more rigid approach, focusing on pre-built use cases that limit what you can build. Embedded iPaaS lack key abstractions developers rely on, like end-to-end type safety and API unification. Unified APIs, meanwhile, are locked into predefined schemas and use cases, making them a point solution at best.

Nango is built with a different mindset: to unleash integration creativity. By providing best-in-class developer tooling tailored to each API, Nango removes limitations and empowers developers to create integrations that stand out—whether through deep customization, polished experiences, or handling the unique quirks of external APIs.

For a full comparison, read How is Nango different from embedded iPaaS and Unified APIs?

​
Overview of integrating Nango

The steps to integrate Nango.

1
Get user permission in your app

Use the Nango frontend SDK to get the user’s permission to access their external data.

Nango guides the user through the auth flow in a popup window.

Store the connectionId in your database to retrieve the user’s data later.

Frontend: Trigger the OAuth flow.

const nango = new Nango({ connectSessionToken });

// Shows authorization popup to the user.
await nango.openConnectUI({
    onEvent: (event) {
        if (event.type === 'connect') {
            // The auth flow succeeded. The user is connected!
            saveToDatabase(connectionId, integrationId);
        }
    }
});
When a new user connects your integration, Nango automatically starts fetching their data (e.g. issues, contacts, files, etc.) in the background.

2
Receive data update notifications

Nango uses webhooks to notify your backend when external user data has been added, updated or deleted. Nango will only notify you when there are actual changes.

Backend: Webhook payload with new data

{
    "connectionId": "user123",
    "providerConfigKey": "zendesk",
    "model": "ticket",
    "responseResults": { "added": 2, "updated": 6, "deleted": 0 },
    "modifiedAfter": "2023-05-31T11:46:13.390Z"
}
3
Collect and save the new data

When you receive a Nango webhook, fetch the most recent data from Nango using the backend SDK or API.

Nango returns the data in the schema of your choice, which can be standardized across different APIs.

You can directly save this data to your database, or process it further, as needed.

Backend: Fetch & save new records.

const records = await nango.listRecords<Ticket>({
    providerConfigKey: 'zendesk',
    connectionId: 'user123',
    model: 'ticket',
    modifiedAfter: modifiedAfter
});

saveToDatabase(records);
4
Write back to external APIs

Push updates back to external APIs in a way that is:

Synchronous: Have your changes immediately reflected.
Unified: Benefit from standardized schemas across different APIs.
Customizable: Support intricate workflows and composed API calls.
Backend: Write back to external APIs.

const result = await nango.triggerAction({
    providerConfigKey: 'zendesk',
    connectionId: 'user123',
    action: 'create-ticket',
    input: { "title": "...", "content": "..." }
});
5
Customize integrations

Nango stands out in its ability to let you create custom integrations through code.

Your custom integration code is deployed and run by Nango, similarly to lambda functions.

## 1. Configure and integration (Already complete)
Getting Started
Configure an integration
Step-by-step guide to configure an integration in Nango.

​
Create an account
Sign up for a Nango account (free):Try Nango Cloud

​
Create an integration
Go to Integrations, click the Configure New Integration button and select the API to integrate with.

Each API has a dedicated Nango documentation page with useful links, gotchas, etc.

APIs have different ways to authorize requests: OAuth, API key, Basic, custom. Nango abstracts away the difficulties of working with each one.


Only for OAuth APIs

​
Test the authorization
If you don’t have one already, create a test account for the external API you want to integrate with.

On the Nango integration page, click “Add Connection” to test the authorization. Enter your test account credentials to authorize the API.

Once authorized, go to Connections to see the newly created connection. The “Authorization” tab contains the credentials necessary to consume the external API. These credentials are securelly stored and automatically refreshed.

## 2. Authorize users from your app
Getting Started
Authorize users from your app
Step-by-step guide to getting user authorization to access an external API from your application.

Pre-requisite: complete the Configure an integration guide.

​
Generate a session token (backend)
In your backend, set up an API endpoint that your frontend will call. This endpoint should request a session token from Nango and return it to the frontend.

Here’s an example of how to generate a session token using Nango’s API (API ref / Node SDK ref):

cURL
curl --request POST \
  --url https://api.nango.dev/connect/sessions \
  --header 'Authorization: Bearer <NANGO-SECRET-KEY>' \
  --header 'Content-Type: application/json' \
  --data '{
    "end_user": {
      "id": "<END-USER-ID>",
      "email": "<END-USER-EMAIL>",
      "display_name": "<OPTIONAL-END-USER-DISPLAY-NAME>"
    },
    "organization": {
      "id": "<OPTIONAL-ORG-ID>",
      "display_name": "<OPTIONAL-ORG-DISPLAY-NAME>"
    },
    "allowed_integrations": [
      "<INTEGRATION-ID>"
    ]
  }'


Node

import { Nango } from '@nangohq/node';

const nango = new Nango({ secretKey: process.env['<NANGO-SECRET-KEY>'] });

api.post('/sessionToken', (req, res) => {
  // Ask Nango for a secure token
  const res = await nango.createConnectSession({
    end_user: {
      id: '<END-USER-ID>',
      email: '<OPTIONAL-END-USER-EMAIL>',
      display_name: '<OPTIONAL-END-USER-DISPLAY-NAME>',
    },
    organization: {
      id: '<OPTIONAL-ORG-ID>',
      display_name: '<OPTIONAL-ORG-DISPLAY-NAME>'
    },
    allowed_integrations: ['<INTEGRATION-ID>'],
  });

  // Send this token back to your frontend
  res.status(200).send({
    sessionToken: res.data.token
  });
});

Details on end user and organization information

​
Trigger the auth flow (frontend)
In your frontend, load the Nango frontend SDK, retrieve the session token from the backend, and trigger the authorization flow.

​
Option 1: Use the Nango Connect UI

import Nango from '@nangohq/frontend';

const nango = new Nango();
const connect = nango.openConnectUI({
  onEvent: (event) => {
    if (event.type === 'close') {
      // Handle modal closed.
    } else if (event.type === 'connect') {
      // Handle auth flow successful.
    }
  },
});

const res = await fetch('/sessionToken', { method: 'POST' }); // Retrieve the session roken from your backend.
connect.setSessionToken(res.sessionToken); // A loading indicator is shown until this is set.
​
Option 2: Use your custom UI
Refer to the Authorize an API from your app with custom UI guide for details on implementing a custom user interface.

​
Save the Connection ID (backend)
The connection ID, a UUID generated by Nango, is required to manage the connection and access its credentials & data. So you need to persist this ID.

Upon successful authorization, Nango will send a webhook to your backend with the connection ID.

To set up this webhook:

go to the Environment Settings tab in the Nango UI
specify a Webhook URL where Nango should send notifications
enable the Send New Connection Creation Webhooks option
create the specified route in your backend to handle Nango webhooks
Successful authorization webhooks sent by Nango are POST requests with the following JSON body:


{
    "type": "auth",
    "operation": "creation",
    "success": true,
    "connectionId": "<CONNECTION-ID>",
    "endUser": { "endUserId": "<END-USER-ID>", "organizationId": "<ORGANIZATION-ID>" },
    ...
}
For each successful authorization, persist the connectionId value alongside its corresponding user or organization, designated by endUser.endUserId and endUser.organizationId.

​
Troubleshoot authorization errors
If an authorization request fails, you can analyze the relevant log in the Logs tab of the Nango UI.

​
Reconnect an existing connection
When testing or troubleshooting an issue, you may need a user to re-authorize an API. Nango allows you to do this without deleting and recreating the connection. Instead, you can reconnect an existing connection while preserving its metadata and configuration.

In your backend, use the POST /connect/sessions/reconnect endpoint (API/SDK reference) to generate a session token specifically for reconnecting a user. This token is then used on the frontend in the same way as when creating a connection, but it will reconnect the existing connection instead.

cURL


curl --request POST \
  --url https://api.nango.dev/connect/sessions/reconnect \
  --header 'Authorization: Bearer <NANGO-SECRET-KEY>' \
  --header 'Content-Type: application/json' \
  --data '{
    "connection_id": "<CONNECTION-ID>",
    "integration_id": "<INTEGRATION-ID>"
  }'

Node

import { Nango } from '@nangohq/node';

const nango = new Nango({ secretKey: process.env['<NANGO-SECRET-KEY>'] });

api.post('/sessionToken', (req, res) => {
  // Ask Nango for a secure token to reconnect
  const res = await nango.createReconnectSession({
    connection_id: "<CONNECTION-ID>",
    integration_id: '<INTEGRATION-ID>',
  });

  // Send this token back to your frontend
  res.status(200).send({
    sessionToken: res.data.token
  });
});


Reconnect using a custom UI

​
You are ready
You have successfully set up the authorization flow for your users. Next steps:

View new connections & associated credentials in the Connections tab of the Nango UI
Retrieve connection credentials with the API or Node SDK
Read data from the API
Write data to the API
Proxy request to the API

## 3. Read from an API 
Read from an API
Step-by-step guide on how to continuously sync data from an API (using a sync template).

Pre-requisite: complete the Configure an integration guide.

​
Activate a sync template
Nango uses syncs to read data from APIs continuously. For common use cases, templates are available to let you get started fast.

Select your integration in the Integrations tab, and navigate to the Endpoints tab. Available sync templates will appear in the endpoint list. Select the relevant one and enable it with the toggle.

Nango will automatically sync the corresponding records in the background for each relevant connection.

Is there no template for your API? Or none matching your exact use case?

Learn more about how to build a custom integration and extend a template.

​
Listen for webhooks from Nango
Nango sends webhook notifications to your backend whenever new data is available for a connection & sync combination.

To set this up, go to the Environment Settings tab and configure a Webhook URL to which Nango will send notifications.

The webhook from Nango is a POST request with the following body:


{
    "connectionId": "<CONNECTION-ID>",
    "providerConfigKey": "<INTEGRATION-ID>",
    "syncName": "<SYNC-NAME>",
    "model": "<MODEL-NAME>",
    "responseResults": { "added": 123, "updated": 123, "deleted": 123 },
    "syncType": "INITIAL" | "INCREMENTAL",
    "modifiedAfter": "<TIMESTAMP>"
}
Webhooks with non-2xx responses are retried with exponential backoff.

Before using webhooks in production, verify their origin (step-by-step guide).

​
Fetch the latest data
After receiving a Nango webhook, fetch the latest records using the backend SDK (reference) or API (reference).

Use the modifiedAfter timestamp from the webhook payload as a parameter in your request to fetch only the modified records.

cURL (standard endpoint)

curl -G https://api.nango.dev/records \
  --header 'Authorization: Bearer <ENVIRONMENT-SECRET-KEY>' \
  --header 'Provider-Config-Key: <providerConfigKey-in-webhook-payload>' \
  --header 'Connection-Id: <connectionId-in-webhook-payload>' \
  --data-urlencode 'model=<model-in-webhook-payload>' \
  --data-urlencode 'modified_after=<modifiedAfter-in-webhook-payload>' \

Node SDK

import { Nango }  from '@nangohq/node';

const nango = new Nango({ secretKey: '<ENVIRONMENT-SECRET-KEY>' });

const result = await nango.listRecords({
    providerConfigKey: '<providerConfigKey-in-webhook-payload>',
    connectionId: '<connectionId-in-webhook-payload>',
    model: '<model-in-webhook-payload>',
    modifiedAfter: '<modifiedAfter-in-webhook-payload>'
});


This returns an array of records conforming to the specified data model.

Each record contains useful metadata automatically generated by Nango:


{
    records:
        [
            {
                id: 123,
                ..., // Fields as specified in the model you queried
                _nango_metadata: {
                    deleted_at: null,
                    last_action: 'ADDED',
                    first_seen_at: '2023-09-18T15:20:35.941305+00:00',
                    last_modified_at: '2023-09-18T15:20:35.941305+00:00',
                    cursor: 'MjAyNC0wMy0wNFQwNjo1OTo1MS40NzE0NDEtMDU6MDB8fDE1Y2NjODA1LTY0ZDUtNDk0MC1hN2UwLTQ1ZmM3MDQ5OTdhMQ=='
                }
            },
            ...
        ],
    next_cursor: "Y3JlYXRlZF9hdF4yMDIzLTExLTE3VDExOjQ3OjE0LjQ0NyswMjowMHxpZF4xYTE2MTYwMS0yMzk5LTQ4MzYtYWFiMi1mNjk1ZWI2YTZhYzI"
}
​
Cursor-based synchronization
In practice, webhook notifications can be missed, and relying solely on the webhook payload to fetch modified records can cause you to miss some updates.

A more reliable way of keeping track of how far you’ve synced records (for each connection & sync combination) is to rely on record cursors.

Each record comes with a synchronization cursor in _nango_metadata.cursor. Nango uses cursors internally to keep a chronological list of record modifications.

Each time you fetch records, you should store the cursor of the last record you fetched to remember how far you’ve synced (for each connection & sync combination).

The next time you fetch records, pass in the cursor of the last-fetched record to only receive records modified after that record:

cURL (standard endpoint)

curl -G https://api.nango.dev/records \
  --header 'Authorization: Bearer <ENVIRONMENT-SECRET-KEY>' \
  --header 'Provider-Config-Key: <providerConfigKey-in-webhook-payload>' \
  --header 'Connection-Id: <connectionId-in-webhook-payload>' \
  --data-urlencode 'model=<model-in-webhook-payload>' \
  --data-urlencode 'cursor=<cursor-of-last-fetched-record>' \

Node SDK

import { Nango }  from '@nangohq/node';

const nango = new Nango({ secretKey: '<ENVIRONMENT-SECRET-KEY>' });

const result = await nango.listRecords({
    providerConfigKey: '<providerConfigKey-in-webhook-payload>',
    connectionId: '<connectionId-in-webhook-payload>',
    model: '<model-in-webhook-payload>',
    cursor: '<cursor-of-last-fetched-record>'
});


So, the overall logic for cursor-based synchronization should be:

Receive a webhook notification from Nango
Query your database for the cursor of the last-fetched record
Fetch the modified records (passing the cursor)
Store the modified records
Store the last-fetched record cursor

## 4. Write to an API 
Write to an API
Step-by-step guide on how to write to an API (using an action template).

Pre-requisite: complete the Configure an integration guide.

​
Activate an action template
Nango uses actions to perform workflows involving external APIs. Workflows can involve arbitrary series of API requests & data transformations. For common use cases, templates are available to let you get started fast.

Select your integration in the Integrations tab, and navigate to the Endpoints tab. Available action templates will appear in the endpoint list. Select the relevant one and enable it with the toggle.

Is there no template for your API? Or none matching your exact use case?

Learn more about how to build a custom integration and extend a template.

​
Trigger an action
Actions can take inputs, and they return a result synchronously. Trigger actions using the backend SDK (reference) or API (reference):

cURL (standard endpoint)


curl --request POST \
  --url https://api.nango.dev/action/trigger \
  --header 'Authorization: Bearer <PROJECT-SECRET-KEY>' \
  --header 'Connection-Id: <string>' \
  --header 'Provider-Config-Key: <string>' \
  --data '{ "action_name": "<string>", "input": <json> }'

Node SDK

import { Nango }  from '@nangohq/node';

const nango = new Nango({ secretKey: '<PROJECT-SECRET-KEY>' });

const result = await nango.triggerAction('<INTEGRATION-ID>', '<CONNECTION-ID>', '<ACTION-NAME>', jsonInput);

If you consume the API (vs. the SDK), you can use the standard endpoint (above) or a unique generated endpoint described in the Endpoints tab of your integration in the Nango UI. The generated endpoint documents the specific parameters & responses of each action.

​
Troubleshoot errors & monitor
Navigate to the Logs tab to inspect potential errors & monitor action executions.

# Important Implementation Notes
## 0. Adding Logs:  
- Always add server-side logs to your code so we can debug any potential issues.

## 1. Project Setup:  
- All new components should go in `/components` at the root (not in the app folder) and be named like `example-component.tsx` unless otherwise specified.  
- All new pages go in `/app`.  
- Use the Next.js 14 app router.  
- All data fetching should be done in a server component and pass the data down as props.  
- Client components (`useState`, hooks, etc.) require that `'use client'` is set at the top of the file.  

## 2. Server-Side API Calls:  
- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.  
- Create dedicated API routes in the `pages/api` directory for each external API interaction.  
- Client-side components should fetch data through these API routes, not directly from external APIs.  

## 3. Environment Variables:  
- Store all sensitive information (API keys, credentials) in environment variables.  
- Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.  
- For production, set environment variables in the deployment platform (e.g., Vercel).  
- Access environment variables only in server-side code or API routes.  

## 4. Error Handling and Logging:  
- Implement comprehensive error handling in both client-side components and server-side API routes.  
- Log errors on the server-side for debugging purposes.  
- Display user-friendly error messages on the client-side.  

## 5. Type Safety:  
- Use TypeScript interfaces for all data structures, especially API responses.  
- Avoid using `any` type; instead, define proper types for all variables and function parameters.  

## 6. API Client Initialization:  
- Initialize API clients (e.g., Snoowrap for Reddit, OpenAI) in server-side code only.  
- Implement checks to ensure API clients are properly initialized before use.  

## 7. Data Fetching in Components:  
- Use React hooks (e.g., `useEffect`) for data fetching in client-side components.  
- Implement loading states and error handling for all data fetching operations.  

## 8. Next.js Configuration:  
- Utilize `next.config.mjs` for environment-specific configurations.  
- Use the `env` property in `next.config.mjs` to make environment variables available to the application.  

## 9. CORS and API Routes:  
- Use Next.js API routes to avoid CORS issues when interacting with external APIs.  
- Implement proper request validation in API routes.  

## 10. Component Structure:  
- Separate concerns between client and server components.  
- Use server components for initial data fetching and pass data as props to client components.  

## 11. Security:  
- Never expose API keys or sensitive credentials on the client-side.  
