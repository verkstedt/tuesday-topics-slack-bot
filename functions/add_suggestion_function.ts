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

export default SlackFunction(
  AddSuggestionFunctionDefinition,
  async ({ inputs, client }) => {
console.log("New suggestion: \n");
    console.log(inputs)
    console.log("New suggestion: \n");
    console.log(inputs.suggestion);

    const uuid = crypto.randomUUID();
    const response = await client.apps.datastore.put({
      datastore: "suggestions",
      item: {
        id: uuid,
        text: inputs.suggestion.text,
        createdAt: inputs.suggestion.event_timestamp,
        currentEmote: "",
        currentVoteCount: 0,
        wasWinner: false,
      },
    });

    if (!response.ok) {
      const error = `Failed to save a row in datastore: ${response.error}`;
      return { error };
    } else {
      console.log(`A new row saved: ${JSON.stringify(response.item}`);
      return { outputs: {} };
    }

    return {};
  },
);
