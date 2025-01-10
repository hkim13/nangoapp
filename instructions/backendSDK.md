## Backend SDKs - nango documentation
Node
The backend SDK lets you interact with the Nango API. It is available on NPM as @nangohq/node.

​
Instantiate the backend SDK
Install it with your favorite package manager, e.g.:


npm i -S @nangohq/node
Instantiate the Nango class:


import { Nango } from '@nangohq/node';

const nango = new Nango({ secretKey: '<SECRET-KEY>' });
Parameters


Hide child attributes

​
config
object
required

Hide config

​
secretKey
string
required
Get your secret key in the environment settings of the Nango UI. THis key should never be shared.

​
host
string
Omitting the host points to Nango Cloud. For local development, use http://localhost:3003. Use your instance URL if self-hosting.

​
Rate limits
The Nango SDK is rate-limited to prevent abuse and ensure fair usage across all clients. The rate limit is enforced on a per-account basis, with a fixed window of time and a maximum number of requests allowed within that window.

If a client exceeds the rate limit, the API will respond with a 429 Too Many Requests status code. In this case, the Retry-After header is included, indicating the number of seconds the client should wait before making another request to avoid being rate-limited.

To handle rate limiting gracefully, clients should monitor for the 429 status code and honor the Retry-After header value provided in the response.


// Example:
try {
    const res = await nango.listIntegrations();
    ...
} catch(err) {
    if (err.response.status === 429) {
        const retryAfter = err.response.headers['retry-after'];
        // wait and retry
        ...
    }
    ...
}
​
Providers
​
List all providers
Returns a list of providers.


await nango.listProviders()
Example Response


Hide child attributes


{
    "data": [
        {
            "name": "posthog",
            "categories": ["dev-tools"],
            "auth_mode": "API_KEY",
            "proxy": {
                "base_url": "https://api.posthog.com",
            },
            "docs": "https://docs.nango.dev/integrations/all/posthog"
        }
    ]
}
​
Get a provider
Returns a specific provider.


await nango.getProvider({ provider: <NAME> })
Example Response


Hide child attributes


{
    "data": {
        "name": "posthog",
        "categories": ["dev-tools"],
        "auth_mode": "API_KEY",
        "proxy": {
            "base_url": "https://api.posthog.com",
        },
        "docs": "https://docs.nango.dev/integrations/all/posthog"
    }
}
​
Integrations
​
List all integrations
Returns a list of integrations.


await nango.listIntegrations()
Example Response


Hide child attributes


{
    "configs": [
        {
            "unique_key": "slack-nango-community",
            "provider": "slack",
            "logo": "http://localhost:3003/images/template-logos/slack.svg",
            "created_at": "2023-10-16T08:45:26.241Z",
            "updated_at": "2023-10-16T08:45:26.241Z",
        },
        {
            "unique_key": "github-prod",
            "provider": "github",
            "logo": "http://localhost:3003/images/template-logos/github.svg",
            "created_at": "2023-10-16T08:45:26.241Z",
            "updated_at": "2023-10-16T08:45:26.241Z",
        },
    ]
}
​
Get an integration
Returns a specific integration.


await nango.getIntegration({ uniqueKey: <UNIQUE_KEY> });

// Deprecated
await nango.getIntegration(<INTEGRATION-ID>);
Parameters


Hide child attributes

​
uniqueKey
string
required
The integration ID

​
include
array
Include sensitive data. Allowed values: webhook

​
providerConfigKey
string
required
deprecated
The integration ID.

​
includeIntegrationCredentials
boolean
deprecated
Defaults to false.

Example Response


Hide child attributes


{
    "data": {
        "unique_key": "slack-nango-community",
        "provider": "slack",
        "logo": "http://localhost:3003/images/template-logos/slack.svg",
        "created_at": "2023-10-16T08:45:26.241Z",
        "updated_at": "2023-10-16T08:45:26.241Z",
    }
}
​
Create an integration
Create a new integration.


await nango.createIntegration(<PROVIDER-ID>, <INTEGRATION-ID>);
Parameters


Hide child attributes

​
provider
string
required
The ID of the API provider in Nango (cf. providers.yaml for a list of API provider IDs.)

​
providerConfigKey
string
required
The integration ID.

​
credentials
Record<string, string>
The credentials to include depend on the specific integration that you want to create.

​
credentials
Record<string, string>

Hide credentials

​
oauth_client_id
string
The OAuth client ID.

​
oauth_client_secret
string
The OAuth client secret.

​
oauth_scopes
string
The list of OAuth scopes

Example Response


Hide child attributes


{
    "config": {
        "unique_key": "slack-nango-community",
        "provider": "slack"
    }
}
​
Update an integration
Edits an integration (only for OAuth APIs).


await nango.updateIntegration(<PROVIDER-ID>, <INTEGRATION-ID>);
Parameters


Hide child attributes

​
provider
string
required
The ID of the API provider in Nango (cf. providers.yaml for a list of API provider IDs.)

​
providerConfigKey
string
required
The integration ID.

​
credentials
Record<string, string>
The credentials to include depend on the specific integration that you want to create.

​
credentials
Record<string, string>

Hide credentials

​
oauth_client_id
string
The OAuth client ID.

​
oauth_client_secret
string
The OAuth client secret.

​
oauth_scopes
string
The list of OAuth scopes

Example Response


Hide child attributes


{
    "config": {
        "unique_key": "slack-nango-community",
        "provider": "slack"
    }
}
​
Delete an integration
Deletes a specific integration.


await nango.deleteIntegration(<INTEGRATION-ID>);
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

Example Response


Hide child attributes


{
    "config": {
        "unique_key": "slack-nango-community",
        "provider": "slack"
    }
}
​
Connections
​
List connections
Returns a list of connections without credentials.


await nango.listConnections();
Parameters


Hide child attributes

​
connectionId
string
Filter the list of connections based on this connection ID.

​
search
string
Will partially match connection IDs or end user profiles.

​
connectionId
string
required
Filter the list of connections based on the given end user id.

​
connectionId
string
required
Filter the list of connections based on the given end user’s organization id.

Example Response


Hide child attributes


{
    "connections": [
        {
            "id": 1,
            "connection_id": "test-1",
            "provider": "slack",
            "provider_config_key": "slack-nango-community",
            "created": "2023-06-03T14:53:22.051Z",
            "metadata": null,
            "errors": []
        },
        {
            "id": 2,
            "connection_id": "test-2",
            "provider": "slack",
            "provider_config_key": "slack-nango-community",
            "created": "2023-06-03T15:00:14.945Z",
            "metadata": {
                "bot_id": "some-uuid"
            },
            "errors": [{ "type": "auth", "log_id": "VrnbtykXJFckCm3HP93t"}],
            "end_user": {
                "id": "your-internal-id",
                "email": "user@example.com",
                "organization": {
                    "id": "user-organization-id"
                }
            }
        }
    ]
}
​
Get a connection (with credentials)
Returns a specific connection with credentials.


await nango.getConnection(<INTEGRATION-ID>, <CONNECTION-ID>);
The response content depends on the API authentication type (OAuth 2, OAuth 1, API key, Basic auth, etc.).

If you do not want to deal with collecting & injecting credentials in requests for multiple authentication types, use the Proxy (step-by-step guide).

When you fetch the connection with this API endpoint, Nango will check if the access token has expired. If it has, it will refresh it.

We recommend not caching tokens for longer than 5 minutes to ensure they are fresh.

Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
connectionId
string
required
The connection ID.

​
forceRefresh
boolean
Defaults to false. If false, the token will only be refreshed if it expires within 15 minutes. If true, a token refresh attempt will happen on each request. This is only useful for testing and should not be done at high traffic.

​
refreshToken
boolean
Defaults to false. If false, the refresh token is not included in the response, otherwise it is. In production, it is not advised to return the refresh token, for security reasons, since only the access token is needed to sign requests.

Example Response


Hide child attributes


{
    "id": 18393,
    "created_at": "2023-03-08T09:43:03.725Z",
    "updated_at": "2023-03-08T09:43:03.725Z",
    "provider_config_key": "github",
    "connection_id": "1",
    "credentials": {
        "type": "OAUTH2",
        "access_token": "gho_tsXLG73f....",
        "refresh_token": "gho_fjofu84u9....",
        "expires_at": "2024-03-08T09:43:03.725Z",
        "raw": { // Raw token response from the OAuth provider: Contents vary!
            "access_token": "gho_tsXLG73f....",
            "refresh_token": "gho_fjofu84u9....",
            "token_type": "bearer",
            "scope": "public_repo,user"
        }
    },
    "connection_config": {
        "subdomain": "myshop",
        "realmId": "XXXXX",
        "instance_id": "YYYYYYY"
    },
    "metadata": {
        "myProperty": "yes",
        "filter": "closed=true"
    }
}
​
Get connection metadata
Returns a connection’s metadata.


await nango.getMetadata('<INTEGRATION-ID>', 'CONNECTION-ID');
If you know the structure of the metadata, you can specify a type;


interface CustomMetadata {
    anyKey: Record<string, string>;
}
const myTypedMetadata = await nango.getMetadata<CustomMetadata>('<INTEGRATION-ID>', '<CONNECTION-ID>');
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID of the connection.

​
connectionId
string
required
The connection ID.

Example Response


Hide child attributes


{
    "custom_key1": "custom_value1"
}
​
Set connection metadata
Set custom metadata for the connection or connections (overrides existing metadata).


await nango.setMetadata('<INTEGRATION-ID>', 'CONNECTION-ID', { 'CUSTOM_KEY1': 'CUSTOM_VALUE1' });

# set an array of connection ids
await nango.setMetadata('<INTEGRATION-ID>', ['CONNECTION-ID', 'CONNECTION-ID-TWO'], { 'CUSTOM_KEY1': 'CUSTOM_VALUE1' });
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID of the connection.

​
connectionId
string | string[]
required
The connection ID or connection IDs.

​
metadata
Record<string, any>
required
The custom metadata to store in the connection.

Response


Hide child attributes


{
    "connection_id": "<string | [string]>",
    "provider_config_key": "<string>",
    "metadata": {
        "CUSTOM_KEY1": "CUSTOM_VALUE1"
    }
}
​
Edit connection metadata
Edit custom metadata for the connection or connections. Only overrides specified properties, not the entire metadata.


await nango.updateMetadata('<INTEGRATION-ID>', 'CONNECTION-ID', { 'CUSTOM_KEY1': 'CUSTOM_VALUE1' });

# update an array of connection ids
await nango.updateMetadata('<INTEGRATION-ID>', ['CONNECTION-ID', 'CONNECTION-ID-TWO'], { 'CUSTOM_KEY1': 'CUSTOM_VALUE1' });
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID of the connection.

​
connectionId
string | string[]
required
The connection ID or connection IDs.

​
metadata
Record<string, any>
required
The custom metadata to store in the connection.

Response


Hide child attributes


{
    "connection_id": "<string | [string]>",
    "provider_config_key": "<string>",
    "metadata": {
        "CUSTOM_KEY1": "CUSTOM_VALUE1"
    }
}
​
Delete a connection
Deletes a specific connection.


await nango.deleteConnection('<INTEGRATION-ID>', 'CONNECTION-ID');
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID of the connection.

​
connectionId
string
required
The connection ID.

Response

Empty response.

​
Integration scripts
​
Get integration scripts config
Return the configuration for all integration scripts


const scriptsConfig = await nango.getScriptsConfig();
Example Response


Hide child attributes


[
    {
        "providerConfigKey": "demo-github-integration",
        "syncs": [
            {
                "name": "github-issue-example",
                "type": "sync",
                "models": [
                    {
                        "name": "GithubIssue",
                        "fields": [
                            {
                                "name": "id",
                                "type": "integer"
                            },
                            {
                                "name": "owner",
                                "type": "string"
                            },
                            {
                                "name": "repo",
                                "type": "string"
                            },
                            {
                                "name": "issue_number",
                                "type": "number"
                            },
                            {
                                "name": "title",
                                "type": "string"
                            },
                            {
                                "name": "author",
                                "type": "string"
                            },
                            {
                                "name": "author_id",
                                "type": "string"
                            },
                            {
                                "name": "state",
                                "type": "string"
                            },
                            {
                                "name": "date_created",
                                "type": "date"
                            },
                            {
                                "name": "date_last_modified",
                                "type": "date"
                            },
                            {
                                "name": "body",
                                "type": "string"
                            }
                        ]
                    }
                ],
                "sync_type": "FULL",
                "runs": "every half hour",
                "track_deletes": false,
                "auto_start": false,
                "last_deployed": "2024-02-28T20:16:38.052Z",
                "is_public": false,
                "pre_built": false,
                "version": "4",
                "attributes": {},
                "input": {},
                "returns": [
                    "GithubIssue"
                ],
                "description": "Fetches the Github issues from all a user's repositories.\nDetails: full sync, doesn't track deletes, metadata is not required.\n",
                "scopes": [
                    "public_repo"
                ],
                "endpoints": [
                    {
                        "GET": "/github/issue-example"
                    }
                ],
                "nango_yaml_version": "v2",
                "webhookSubscriptions": []
            }
        ],
        "actions": [
            {
                "name": "fetch-issues",
                "type": "action",
                "models": [
                    {
                        "name": "GithubIssue",
                        "fields": [
                            {
                                "name": "id",
                                "type": "integer"
                            },
                            {
                                "name": "owner",
                                "type": "string"
                            },
                            {
                                "name": "repo",
                                "type": "string"
                            },
                            {
                                "name": "issue_number",
                                "type": "number"
                            },
                            {
                                "name": "title",
                                "type": "string"
                            },
                            {
                                "name": "author",
                                "type": "string"
                            },
                            {
                                "name": "author_id",
                                "type": "string"
                            },
                            {
                                "name": "state",
                                "type": "string"
                            },
                            {
                                "name": "date_created",
                                "type": "date"
                            },
                            {
                                "name": "date_last_modified",
                                "type": "date"
                            },
                            {
                                "name": "body",
                                "type": "string"
                            }
                        ]
                    }
                ],
                "runs": "",
                "is_public": false,
                "pre_built": false,
                "version": "4",
                "last_deployed": "2024-02-28T20:16:38.052Z",
                "attributes": {},
                "returns": [
                    "GithubIssue"
                ],
                "description": "",
                "scopes": [],
                "input": {},
                "endpoints": [
                    {
                        "GET": "/github/issues"
                    }
                ],
                "nango_yaml_version": "v2"
            }
        ],
        "postConnectionScripts": [],
        "provider": "github"
    }
]
​
Syncs
​
Get records
Returns the synced data.


import type { ModelName } from '<path-to-nango-integrations>/models'

const records = await nango.listRecords<ModelName>({
    providerConfigKey: '<INTEGRATION-ID>',
    connectionId: '<CONNECTION-ID>',
    model: '<MODEL-NAME>'
});
nango.getRecords() is deprecated and will be removed in future releases as it does not support efficient pagination. Please use nango.listRecords() detailed below.

Parameters


Hide child attributes

​
config
object
required

Hide config

​
providerConfigKey
string
required
The integration ID.

​
connectionId
string
required
The connection ID.

​
model
string
required
The name of the model of the data you want to retrieve.

​
cursor
string
Each record from this endpoint comes with a synchronization cursor in _nango_metadata.cursor.

Save the last fetched record’s cursor to track how far you’ve synced.

By providing the cursor to this method, you’ll continue syncing from where you left off, receiving only post-cursor changes.

This same cursor is used to paginate through the results of this endpoint.

​
limit
number
The maximum number of records to return. Defaults to 100.

​
filter
string
Filter to only show results that have been added or updated or deleted.

Available options: added, updated, deleted

​
modifiedAfter
string
Timestamp, e.g. 2023-05-31T11:46:13.390Z. If passed, only records modified after this timestamp are returned, otherwise all records are returned.

​
delta
string
DEPRECATED (use modifiedAfter) Timestamp, e.g. 2023-05-31T11:46:13.390Z. If passed, only records modified after this timestamp are returned, otherwise all records are returned.

Example Response

This endpoint returns a list of records, ordered by modification date ascending. If some records are updated while you paginate through this endpoint, you might see these records multiple times.


Hide child attributes


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
                    cursor: 'MjAyNC0wMi0yNlQwMzowMDozOS42MjMzODgtMDU6MDB8fGVlMDYwM2E1LTEwNDktNDA4Zi05YTEwLTJjNzVmNDkwODNjYQ=='
                }
            },
            ...
        ],
    next_cursor: "Y3JlYXRlZF9hdF4yMDIzLTExLTE3VDExOjQ3OjE0LjQ0NyswMjowMHxpZF4xYTE2MTYwMS0yMzk5LTQ4MzYtYWFiMi1mNjk1ZWI2YTZhYzI"
}
​
Trigger sync(s)
Triggers an additional, one-off execution of specified sync(s) for a given connection or all applicable connections if no connection is specified.


const records = await nango.triggerSync('<INTEGRATION-ID>', ['SYNC_NAME1', 'SYNC_NAME2'], '<CONNECTION_ID>');
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
syncs
string[]
required
The name of the syncs to trigger. If the array is empty, all syncs are triggered.

​
connectionId
string
The connection ID. If omitted, the sync will trigger for all relevant connections.

Response

Empty response.

​
Start schedule for sync(s)
Starts the schedule of specified sync(s) for a given connection or all applicable connections if no connection is specified. Upon starting the schedule, the sync will execute immediately and then continue to run at the specified frequency. If the schedule was already started, this will have no effect.


await nango.startSync('<INTEGRATION-ID>', ['SYNC_NAME1', 'SYNC_NAME2'], '<CONNECTION_ID>')
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
syncs
string[]
required
The name of the syncs that should be triggered.

​
connectionId
string
The connection ID. If omitted, the sync will trigger for all relevant connections.

Response

Empty response.

​
Pause schedule for sync(s)
Pauses the schedule of specified sync(s) for a given connection or all applicable connections if no connection is specified.


await nango.startSync('<INTEGRATION-ID>', ['SYNC_NAME1', 'SYNC_NAME2'], '<CONNECTION_ID>')
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
syncs
string[]
required
The name of the syncs that should be paused.

​
connectionId
string
The connection ID. If omitted, the sync will pause for all relevant connections.

Response

Empty response.

​
Sync status
Get the status of specified sync(s) for a given connection or all applicable connections if no connection is specified.


await nango.syncStatus('<INTEGRATION-ID>', ['SYNC_NAME1', 'SYNC_NAME2'], '<CONNECTION_ID>')
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
syncs
string[]
required
The name of the syncs you want to fetch a status for. Pass in ”*” to return all syncs.

​
connectionId
string
The connection ID. If omitted, all connections will be surfaced.

Response


Hide child attributes


{
    "syncs": [
        {
            "id": "<string>",
            "connection_id": "<string>",
            "name": "<string>",
            "status": "RUNNING",
            "type": "INCREMENTAL",
            "finishedAt": "<string>",
            "nextScheduledSyncAt": "<string>",
            "frequency": "<string>",
            "latestResult": {
                "<string>": {
                    "added": <number>,
                    "updated": <number>,
                    "deleted": <number>,
                }
            },
            "recordCount": {
                "<string>": <number>
                ...
            }
        }
    ]
}
​
Override sync connection frequency
Override a sync’s default frequency for a specific connection, or revert to the default frequency.


await nango.updateSyncConnectionFrequency('<INTEGRATION-ID>', 'SYNC_NAME', '<CONNECTION_ID>', '<FREQUENCY>')
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
sync
string
required
The name of the sync.

​
connectionId
string
required
The connection ID.

​
frequency
string
required
The frequency you want to set (ex: ‘every hour’). Set to null to revert to the default frequency. Uses the https://github.com/vercel/ms notations. Min frequency: 5 minutes.

Response


Hide child attributes


{
    "frequency": "<string>"
}
​
Get environment variables
Retrieve the environment variables as added in the Nango dashboard.


await nango.getEnvironmentVariables();
Parameters

No parameters.

Response


Hide child attributes


[
    {
        "name": "MY_SECRET_KEY",
        "value": "SK_373892NSHFNCOWFO..."
    }
]
​
Actions
​
Trigger an action
Triggers an action for a connection.


await nango.triggerAction('<INTEGRATION-ID>', '<CONNECTION_ID>', '<ACTION-NAME>', { 'custom_key1': 'custom_value1' });
Parameters


Hide child attributes

​
providerConfigKey
string
required
The integration ID.

​
connectionId
string
required
The connection ID.

​
actionName
string
required
The name of the action to trigger.

​
input
unknown
required
The necessary input for your action’s runAction function.

Response


Hide child attributes


{
    "your-properties": "The data returned by the action"
}
​
Proxy
Makes an HTTP request using the proxy:


const config = {
    endpoint: '/some-endpoint',
    providerConfigKey: '<INTEGRATION-ID>',
    connectionId: '<CONNECTION-ID>'
};

await nango.get(config); // GET request
await nango.post(config); // POST request
await nango.put(config); // PUT request
await nango.patch(config); // PATCH request
await nango.delete(config); // DELETE request
Parameters


Hide child attributes

​
config
object
required

Hide config

​
endpoint
string
required
The endpoint of the request.

​
providerConfigKey
string
required
The integration ID (for credential injection).

​
connectionId
string
required
The connection ID (for credential injection).

​
headers
Record<string, string>
The headers of the request.

​
params
Record<string, string | number>
The query parameters of the request.

​
data
unknown
The body of the request.

​
retries
number
The number of retries in case of failure (with exponential back-off). Optional, default 0.

​
retryOn
number[]
Array of additional status codes to retry a request in addition to the 5xx, 429, ECONNRESET, ETIMEDOUT, and ECONNABORTED

​
baseUrlOverride
string
The API base URL. Can be omitted if the base URL is configured for this API in the providers.yaml.

​
decompress
boolean
Override the decompress option when making requests. Optional, defaults to false

​
responseType
'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
The type of the response.

Response


Hide child attributes

The response from the external API is passed back to you exactly as Nango gets it:

response code
response headers
response body
​
Connect
​
Create a connect session
Create a connect session for a given end user


const { data } = await nango.createConnectSession({
  end_user: {
    id: '<END-USER-ID>',
    email: '<END-USER-EMAIL>',
    display_name: '<END-USER-NAME>'
  },
  organization: {
    id: '<ORGANIZATION-ID>',
    display_name: '<ORGANIZATION-NAME>'
  },
  allowed_integrations: ['<INTEGRATION-ID-1>', '<INTEGRATION-ID-2>'],
  integrations_config_defaults: {
    <INTEGRATION-ID-1>: {
      connection_config: {
        <CONFIG-KEY>: '<VALUE>'
      }
    }
  }
});
Parameters


Hide child attributes

​
end_user
object
required

Hide end_user

​
id
string
required
The unique identifier for the end user.

​
email
string
The email address of the end user.

​
display_name
string
The display name of the end user.

​
organization
object

Hide organization

​
id
string
required
The unique identifier for the organization.

​
display_name
string
The display name of the organization.

​
allowed_integrations
string[]
An array of integration IDs that are allowed for this session.

​
integrations_config_defaults
object
Default configuration for specific integrations.

Returns


Hide child attributes


{
    "data": {
        "token": "nango_connect_session_4603dbca8a588315ba69b5bfddde52e72d312dc2d2870bd5e45da6357333601c",
        "expires_at": "2024-09-27T19:49:51.449Z"
    }
}
​
Create a reconnect session
Create a reconnect session for a given connection_id. Optionally, you can set end_user and organization to update those attributes of the connection. Use this method when a user needs to input new credentials or to manually refresh token.

This method is only compatible with connection_id created with a session token.

const { data } = await nango.createReconnectSession({
  // Required
  connection_id: '<CONNECTION-ID>'
  integration_id: '<INTEGRATION-ID>',

  // Optional
  end_user: {
    id: '<END-USER-ID>',
    email: '<END-USER-EMAIL>',
    display_name: '<END-USER-NAME>'
  },
  organization: {
    id: '<ORGANIZATION-ID>',
    display_name: '<ORGANIZATION-NAME>'
  },
  integrations_config_defaults: {
    <INTEGRATION-ID-1>: {
      connection_config: {
        <CONFIG-KEY>: '<VALUE>'
      }
    }
  }
});
Parameters


Hide child attributes

​
connection_id
string
required
The unique identifier for the connection.

​
integration_id
string
required
The unique identifier for the integration.

​
end_user
object

Hide end_user

​
id
string
required
The unique identifier for the end user.

​
email
string
The email address of the end user.

​
display_name
string
The display name of the end user.

​
organization
object

Hide organization

​
id
string
required
The unique identifier for the organization.

​
display_name
string
The display name of the organization.

​
integrations_config_defaults
object
Default configuration for specific integrations.

Returns


Hide child attributes


{
    "data": {
        "token": "nango_connect_session_4603dbca8a588315ba69b5bfddde52e72d312dc2d2870bd5e45da6357333601c",
        "expires_at": "2024-09-27T19:49:51.449Z"
    }
}
​
Webhook
​
Verify Webhook Signature
Asserts that a Webhook is coming from Nango’s backend.


async (req, res) => {
    const signature = req.headers['x-nango-signature'];
    const isValid = nango.verifyWebhookSignature(signature, req.body);
}