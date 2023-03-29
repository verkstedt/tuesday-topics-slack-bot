import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { FindWinnerFunctionDefinition } from "../functions/find_winner_function.ts";

const FindWinnerWorkflow = DefineWorkflow({
  callback_id: "find_winner_workflow",
  title: "Find the Winner",
  description: "Determine the winner",
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

FindWinnerWorkflow.addStep(
  FindWinnerFunctionDefinition,
  {
    channelId: "C0516JP35SM",
  },
);

// GrabTopicsWorkflow.addStep(Schema.slack.functions.SendMessage, {
//   channel_id: "GQQJ2QD45",
//   message: "our message",
// });

// GrabTopicsWorkflow.addStep(GrabTopicsFunctionDefinition);

export default FindWinnerWorkflow;
