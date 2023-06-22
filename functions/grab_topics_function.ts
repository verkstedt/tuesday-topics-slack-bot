import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { TOPICS_TITLE } from "../consts.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GrabTopicsFunctionDefinition = DefineFunction({
  callback_id: "grab_topics_function",
  title: "Grab topics",
  description: "Grab topics",
  source_file: "functions/grab_topics_function.ts",
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
      },
      channel_id: {
        type: Schema.types.string,
      },
    },
    required: ["message", "channel_id"],
  },
});

export default SlackFunction(
  GrabTopicsFunctionDefinition,
  // @ts-ignore
  async ({ client, env }) => {
    console.log({ env }, env.CHANNEL_ID);
    const data = await client.apps.datastore.query({
      datastore: "suggestions",
      expression: "#wasWinner = :value",
      expression_attributes: { "#wasWinner": "wasWinner" },
      expression_values: { ":value": 0 },
    });

    const suggestions = data?.items?.filter(({ currentEmote }) =>
      Boolean(currentEmote)
    ).map((
      { text, currentEmote },
    ) => `${currentEmote} ${text.trim()}`).join("\n");

    if (suggestions.length) {
      return {
        outputs: {
          message: `${TOPICS_TITLE}\n${suggestions}`,
        },
      };
    }

    return {
      outputs: {
        message:
          `${TOPICS_TITLE}\nThere are no topics to left :tumbleweed:. Please suggest one!`,
        channel_id: env.CHANNEL_ID,
      },
    };
  },
);
