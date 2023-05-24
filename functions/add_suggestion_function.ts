import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const AddSuggestionFunctionDefinition = DefineFunction({
  callback_id: "add_suggestion_function",
  title: "Add Suggestion",
  description: "Add suggestion function",
  source_file: "functions/add_suggestion_function.ts",
  input_parameters: {
    properties: {
      suggestion: {
        type: Schema.types.object,
        description:
          "Whole Suggestion obj comming from event trigger stringified",
      },
    },
    required: ["suggestion"],
  },
});
const isSuggestionUnique = async (client, text) => {
  const response = await client.apps.datastore.query({
    datastore: "suggestions",
    expression: "#text = :value",
    expression_attributes: { "#text": "text" },
    expression_values: { ":text": text },
  });

  return !response.ok
    ? false
    : Boolean(response.items.filter((item) => item.text).length);
};

export default SlackFunction(
  AddSuggestionFunctionDefinition,
  async ({ inputs, client }) => {
    const { suggestion } = inputs;
    const [suggester, text] = suggestion.text.split(" added a topic:\n&gt; ");
    const uuid = crypto.randomUUID();
    const isUnique = await isSuggestionUnique(client, text);

    if (!isUnique) {
      await client.chat.postMessage({
        channel: "C0516JP35SM",
        text: `Suggestion "${text}" already exists.`,
      });

      return { outputs: {} };
    }

    const response = await client.apps.datastore.put({
      datastore: "suggestions",
      item: {
        id: uuid,
        text,
        suggester,
        createdAt: new Date().toISOString(),
        currentEmote: "",
        currentVoteCount: 0,
        wasWinner: 0,
      },
    });

    if (!response.ok) {
      const error = `Failed to save a row in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A new row saved: ${JSON.stringify(response.item)}`);
      return { outputs: {} };
    }
  },
);
