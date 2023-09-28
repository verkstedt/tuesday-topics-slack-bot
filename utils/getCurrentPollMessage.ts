import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.1/types.ts";

const getCurrentPollMessage = async (client: SlackAPIClient) => {
  const pollMessages = await client.apps.datastore.query({
    datastore: "pollmessage",
    expression_values: {
      ":active": true,
    },
    limit: 1,
  });

  return pollMessages?.items?.[0]?.id;
};

export default getCurrentPollMessage;
