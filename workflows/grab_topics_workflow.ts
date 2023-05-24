import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { GrabTopicsFunctionDefinition } from "../functions/grab_topics_function.ts";

const GrabTopicsWorkflow = DefineWorkflow({
  callback_id: "grab_topics_workflow",
  title: "Grab the topics",
  description: "Collate all the suggestions into a list",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: [],
  },
});
// GreetingWorkflow.addStep(Schema.slack.functions.SendMessage, {
//   channel_id: inputForm.outputs.fields.channel,
//   message: greetingFunctionStep.outputs.greeting,
// });

GrabTopicsWorkflow.addStep(
  GrabTopicsFunctionDefinition,
  {
    channelId: "C0516JP35SM",
  },
);

// GrabTopicsWorkflow.addStep(Schema.slack.functions.SendMessage, {
//   channel_id: "GQQJ2QD45",
//   message: "our message",
// });

// GrabTopicsWorkflow.addStep(GrabTopicsFunctionDefinition);

export default GrabTopicsWorkflow;
