import { SlackAPIClient } from "https://deno.land/x/deno_slack_api@2.1.1/types.ts";
import { CHANNEL_ID } from "../consts.ts";

const getPollMessage = async (client: SlackAPIClient, ts: string | number) => {
  const result = await client.conversations.history({
    channel: CHANNEL_ID,
    latest: ts,
    inclusive: true,
    limit: 1,
  });

  return result.messages[0];
};

export default getPollMessage;
