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
      activeEmojis: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
      },
      emoji: {
        type: Schema.types.string,
      },
      success: {
        type: Schema.types.boolean,
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  GrabTopicsFunctionDefinition,
  // @ts-ignore
  async ({ client }) => {
    const data = await client.apps.datastore.query({
      datastore: "suggestions",
      expression: "#wasWinner = :value",
      expression_attributes: { "#wasWinner": "wasWinner" },
      expression_values: { ":value": 0 },
    });

    const suggestionsWithEmojis = data?.items?.filter(({ currentEmote }) =>
      Boolean(currentEmote)
    );

    const activeEmojis = suggestionsWithEmojis.map(({ currentEmote }) =>
      currentEmote
    );

    const suggestions = suggestionsWithEmojis.map((
      { text, currentEmote },
    ) => `${currentEmote} ${text.trim()}`).join("\n");

    const topicsExist = Boolean(suggestions.length);

    return {
      outputs: {
        message: topicsExist
          ? `${TOPICS_TITLE}\n<!here>\n${suggestions}`
          : `${TOPICS_TITLE}\nThere are no topics to left :tumbleweed:. Please suggest one!`,
        activeEmojis,
        success: topicsExist,
      },
    };
  },
);
