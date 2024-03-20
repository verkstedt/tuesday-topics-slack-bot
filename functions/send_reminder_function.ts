import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import getCurrentPollMessage from "../utils/getCurrentPollMessage.ts";
import { CHANNEL_ID } from "../consts.ts";

export const GetLatestPollFunctionDefinition = DefineFunction({
  callback_id: "send_reminder_function",
  title: "Send reminder to vote",
  description: "Send reminder to vote",
  source_file: "functions/send_reminder_function.ts",
});

export default SlackFunction(
  GetLatestPollFunctionDefinition,
  /* @ts-ignore */
  async ({ client }) => {
    const currentPollTs = await getCurrentPollMessage(client);

    const { permalink } = await client.chat.getPermalink({
      channel: CHANNEL_ID,
      message_ts: currentPollTs,
    });

    await client.chat.postMessage({
      channel: CHANNEL_ID,
      text: `<!here> Don't forget to vote for the Tuesday Topic!\n${permalink}`,
    });

    return {
      outputs: {},
    };
  },
);
