import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const FindWinnerFunctionDefinition = DefineFunction({
  callback_id: "find_winner_function",
  title: "Find winner",
  description: "Find winner",
  source_file: "functions/find_winner_function.ts",
  input_parameters: {
    properties: {
      channelId: {
        type: Schema.slack.types.channel_id,
        description: "Channel ID ",
      },
    },
    required: ["channelId"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "Greeting for the recipient",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  FindWinnerFunctionDefinition,
  // @ts-ignore
  async ({ inputs, client }) => {
    const { channelId } = inputs;

    const reponse = await client.apps.datastore.query({
      datastore: "suggestions",
      expression: "#wasWinner = :value",
      expression_attributes: {"#wasWinner": "wasWinner"},
      expression_values: { ":value": 0 },
    });

    const validSuggestions = reponse.items.filter((item) => item.text);
     
    console.log({validSuggestions});

    return 
  },
);
