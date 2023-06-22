import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineFunction } from "deno-slack-sdk/mod.ts";
import getPollMessage from "../utils/getPollMessage.ts";

export const UpdatePollFunctionDefinition = DefineFunction({
  callback_id: "update_poll_function",
  title: "Update Poll",
  description: "Update the poll after adding a new topic",
  source_file: "functions/update_poll_function.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The fully formed message",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  UpdatePollFunctionDefinition,
  async ({ inputs, client, env }) => {
    const { message } = inputs;
    const pollMessage = await getPollMessage(client);

    await client.chat.update({
      channel: env.CHANNEL_ID,
      ts: pollMessage.ts,
      as_user: true,
      blocks: [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
          verbatim: true,
        },
      }],
    });

    return {
      outputs: {},
    };
  },
);
