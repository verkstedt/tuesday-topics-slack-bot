import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import getCurrentPollMessage from "../utils/getCurrentPollMessage.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const StorePollMessageFunctionDefinition = DefineFunction({
  callback_id: "store_poll_message_function",
  title: "Store poll message",
  description: "Stores the latest poll message in the datastore",
  source_file: "functions/store_poll_message.ts",
  input_parameters: {
    required: ["timestamp"],
    properties: {
      timestamp: {
        type: Schema.types.string,
      },
    },
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  StorePollMessageFunctionDefinition,
  async ({ client, inputs }) => {
    const { timestamp } = inputs;

    const currentPollId = await getCurrentPollMessage(client);

    if (currentPollId) {
      // TODO Handle error here
      await client.apps.datastore.update({
        datastore: "pollmessage",
        item: {
          id: currentPollId,
          active: false,
        },
      });
    }

    await client.apps.datastore.update({
      datastore: "pollmessage",
      item: {
        id: timestamp,
        active: true,
      },
    });

    return {
      outputs: {},
    };
  },
);
