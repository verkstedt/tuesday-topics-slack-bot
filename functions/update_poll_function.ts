import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineFunction } from "deno-slack-sdk/mod.ts";
import { CHANNEL_ID } from "../consts.ts";
import getCurrentPollMessage from "../utils/getCurrentPollMessage.ts";
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
      emoji: {
        type: Schema.types.string,
        description: "The emoji assigned to the suggestion",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  UpdatePollFunctionDefinition,
  async ({ inputs, client }) => {
    const { message, emoji } = inputs;
    const pollMessageTs = await getCurrentPollMessage(client);

    await client.chat.update({
      channel: CHANNEL_ID,
      ts: pollMessageTs,
      as_user: true,
      text: message,
    });

    const name = emoji && emoji.slice(1, -1);

    if (name) {
      await client.reactions.add({
        name: emoji.slice(1, -1),
        timestamp: pollMessageTs,
        channel: CHANNEL_ID,
      });
    }

    return {
      outputs: {},
    };
  },
);
