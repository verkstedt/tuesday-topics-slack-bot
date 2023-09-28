import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { DefineFunction } from "deno-slack-sdk/mod.ts";
import { CHANNEL_ID, TOPICS_TITLE } from "../consts.ts";
import getCurrentPollMessage from "../utils/getCurrentPollMessage.ts";
import getPollMessage from "../utils/getPollMessage.ts";

export const UpdatePollAfterCompleteFunctionDefinition = DefineFunction({
  callback_id: "update_poll_after_complete_function",
  title: "Update Poll title after winner declared",
  description: "Update the poll after adding a new topic",
  source_file: "functions/update_poll_after_complete_function.ts",
});

export default SlackFunction(
  UpdatePollAfterCompleteFunctionDefinition,
  async ({ client }) => {
    const currentPollTs = await getCurrentPollMessage(client);
    const pollMessage = await getPollMessage(client, currentPollTs);
    const updatedText = pollMessage.text.replace(
      TOPICS_TITLE,
      `*Poll closed*`,
    );
    await client.chat.update({
      channel: CHANNEL_ID,
      ts: pollMessage.ts,
      as_user: true,
      blocks: [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: updatedText,
          verbatim: true,
        },
      }],
    });

    await client.apps.datastore.update({
      datastore: "pollmessage",
      item: {
        id: pollMessage.ts,
        active: false,
      },
    });

    return {
      outputs: {},
    };
  },
);
