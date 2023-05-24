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

    // const reponse = await client.apps.datastore.query({
    //   datastore: "suggestions",
    //   expression: "#wasWinner = :value",
    //   expression_attributes: {"#wasWinner": "wasWinner"},
    //   expression_values: { ":value": 0 },
    // });

    // const validSuggestions = reponse.items?.filter((item) => item.text);
     
    // // console.log({validSuggestions});

    const history = await client.conversations.history({
      channel: channelId,
    });
    
    // Get the latest poll
    const pollMessage = history.messages?.filter((message) => {
      return message?.text.includes("Topics for Tuesday");
    })[0];

    // Get ID of pollMessage
    // Send request to get thread
    //
    const pollMessageReplies = await client.conversations.replies({
      channel: channelId,
      ts: pollMessage.ts,
    });

    const pollSuggestions = pollMessage.text.split(
      "*Topics for Tuesday*",
    )[1]
      .split("\n").filter((str) => Boolean(str.trim()));

    console.log({ pollSuggestions });
    const votes = pollMessageReplies.messages.reduce((results, value) => {
      if (!results[value.text]) {
        results[value.text] = 1;
      } else {
        results[value.text] += 1;
      }

      return results;
    }, {});

    const winnerIndex = Object.keys(votes).reduce((a, b) =>
      votes[a] > votes[b] ? a : b
    );

    const winnerText = pollSuggestions.find((suggestion) =>
      suggestion.includes(`${winnerIndex}.`)
    );

    const winnerSuggestion = (await client.apps.datastore.query({
      datastore: "suggestions",
      expression: "#text = :text",
      expression_attributes: {"#text": "text"},
      expression_values: { ":text": winnerText },
    })).items[0];

    await client.apps.datastore.update({datastore: 'suggestion', item: {id: winnerSuggestion.id, wasWinner: 1} });

    const response = await client.chat.postMessage({
      channel: channelId,
      text: `
      *The winner is...*
      ${winnerSuggestion.text}
      `,
    });

    return {}
  },
);
