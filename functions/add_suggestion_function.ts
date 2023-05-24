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
    console.log("inputs: \n");
    console.log(inputs);
    console.log("New suggestion: \n");
    console.log(inputs.suggestion);

    return {};
  },
);
