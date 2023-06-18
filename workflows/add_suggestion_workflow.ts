import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { AddSuggestionFunctionDefinition } from "../functions/add_suggestion_function.ts";

const AddSuggestionWorkflow = DefineWorkflow({
  callback_id: "add_suggestion_workflow",
  title: "Add suggestion for a topic to vote on",
  description: "Stores new suggestion to DS if unique",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      suggestion: {
        type: Schema.types.string,
      },
      suggestor: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity"],
  },
});

const form = AddSuggestionWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Tuesday Topic",
    interactivity: AddSuggestionWorkflow.inputs.interactivity,
    submit_label: "Add new topic",
    description: "Suggest a new topic for Tuesday Topics!",
    fields: {
      elements: [{
        name: "suggestion",
        title: "Suggested Topic",
        type: Schema.types.string,
      }],
    },
  },
);

AddSuggestionWorkflow.addStep(
  AddSuggestionFunctionDefinition,
  {
    suggestion: form.outputs.fields.suggestion,
    suggestor: AddSuggestionWorkflow.inputs.interactivity.interactor.id,
  },
);

export default AddSuggestionWorkflow;
