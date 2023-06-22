import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { DefineFunction } from "deno-slack-sdk/mod.ts";
import { TOPICS_TITLE } from "../consts.ts";
import getPollMessage from "../utils/getPollMessage.ts";

export const UpdatePollAfterCompleteFunctionDefinition = DefineFunction({
  callback_id: "update_poll_after_complete_function",
  title: "Update Poll title after winner declared",
  description: "Update the poll after adding a new topic",
  source_file: "functions/update_poll_after_complete_function.ts",
});

export default SlackFunction(
  UpdatePollAfterCompleteFunctionDefinition,
  async ({ client, env }) => {
    const pollMessage = await getPollMessage(client, env.CHANNEL_ID);
    const updatedText = pollMessage.text.replace(
      TOPICS_TITLE,
      `*Poll complete*`,
    );
    await client.chat.update({
      channel: env.CHANNEL_ID,
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

    return {
      outputs: {},
    };
  },
);
