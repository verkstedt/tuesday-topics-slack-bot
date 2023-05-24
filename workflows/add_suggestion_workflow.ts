import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { AddSuggestionFunctionDefinition } from "../functions/add_suggestion_function.ts";

const AddSuggestionWorkflow = DefineWorkflow({
  callback_id: "add_suggestion_workflow",
  title: "Store to DS",
  description: "Stores new suggestion to DS if unique",
  input_parameters: {
    properties: {
      suggestion: {
        type: Schema.slack.types.string,
      },
    },
    required: ["suggestion"],
  },
});

AddSuggestionWorkflow.addStep(
  AddSuggestionFunctionDefinition,
  {
    suggestion: JSON.stringify(AddSuggestionWorkflow.inputs.suggestion),
  },
);  

export default AddSuggestionWorkflow;
