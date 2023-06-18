import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { CHANNEL_ID } from "../consts.ts";
import { FindWinnerFunctionDefinition } from "../functions/find_winner_function.ts";

const FindWinnerWorkflow = DefineWorkflow({
  callback_id: "find_winner_workflow",
  title: "Find the Winner",
  description: "Determine the winner",
  output_parameters: {
    properties: {
      winner: {
        type: Schema.types.string,
      },
    },
    required: [],
  },
});

const findWinner = FindWinnerWorkflow.addStep(
  FindWinnerFunctionDefinition,
  {},
);

FindWinnerWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CHANNEL_ID,
  message:
    `And the winner is... :drum_with_drumsticks:\n${findWinner.outputs.winner}`,
});

// GrabTopicsWorkflow.addStep(GrabTopicsFunctionDefinition);

export default FindWinnerWorkflow;
