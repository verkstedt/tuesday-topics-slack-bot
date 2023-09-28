import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { AddSuggestionFunctionDefinition } from "../functions/add_suggestion_function.ts";
import { GrabTopicsFunctionDefinition } from "../functions/grab_topics_function.ts";
import { UpdatePollFunctionDefinition } from "../functions/update_poll_function.ts";

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
      emoji: {
        type: Schema.types.string,
      },
    },
    required: ["interactivity"],
  },
  output_parameters: {
    required: [],
    properties: {
      emoji: {
        type: Schema.types.string,
      },
    },
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
      required: ["suggestion"],
    },
  },
);

const suggestion = AddSuggestionWorkflow.addStep(
  AddSuggestionFunctionDefinition,
  {
    suggestion: form.outputs.fields.suggestion,
    suggestor: AddSuggestionWorkflow.inputs.interactivity.interactor.id,
  },
);

const poll = AddSuggestionWorkflow.addStep(
  GrabTopicsFunctionDefinition,
  {},
);

AddSuggestionWorkflow.addStep(UpdatePollFunctionDefinition, {
  message: poll.outputs.message,
  emoji: suggestion.outputs.emoji,
});

export default AddSuggestionWorkflow;
