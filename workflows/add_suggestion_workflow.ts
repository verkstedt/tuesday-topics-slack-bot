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
        type: Schema.types.object,
      },
    },
    required: ["suggestion"],
  },
});

AddSuggestionWorkflow.addStep(
  AddSuggestionFunctionDefinition,
  {
    suggestion: AddSuggestionWorkflow.inputs.suggestion,
  },
);

export default AddSuggestionWorkflow;
