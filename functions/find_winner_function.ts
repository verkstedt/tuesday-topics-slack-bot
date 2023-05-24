// @ts-nocheck
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

    // TODO Filter replies so only 1 user per reply

    const pollSuggestions = pollMessage.text.split(
      "\n      *Topics for Tuesday*",
    )[1]
      .split("\n").filter((str) => Boolean(str.trim()));

    // console.log({ pollSuggestions, pollMessageReplies });

    const votes = pollMessageReplies.messages
      .filter((message) => !message?.bot_id)
      .reduce((results, value) => {
        if (!results[value.text]) {
          results[value.text] = 1;
        } else {
          results[value.text] += 1;
        }

        return results;
      }, {});
    const voteKeys = Object.keys(votes);

    let response;
    if (voteKeys.length) {
      const winnerIndex = voteKeys.reduce((a, b) =>
        votes[a] > votes[b] ? a : b
      );

      // console.log({ winnerIndex });

      const winner = pollSuggestions.find((suggestion) =>
        suggestion.includes(`#${winnerIndex}`)
      );

      response = await client.chat.postMessage({
        channel: channelId,
        text: `
      *The winner is...*
      ${winner}
      `,
      });

      const suggestions = history.messages?.filter((message) => {
        return message?.username === "Add Tuesday topic";
      });

      // {
      //   type: "message",
      //   subtype: "bot_message",
      //   text: "Vedran Josipovic added a topic:\n&gt; _Hakans topic_",
      //   ts: "1674642474.485009",
      //   username: "Add Tuesday topic",
      //   bot_id: "B04L8JDM2RH",
      //   app_id: "A04KU612K9V",
      //   blocks: [ [Object] ],
      //   edited: { user: "B04L8JDM2RH", ts: "1674652657.000000" }
      // },

      const winningSuggestion = suggestions.find(({ text }) => {
        const matches = winner.match(/#\d+ (.*)/);
        return text.includes(`added a topic:\n&gt; ${matches[1]}`);
      });
    } else {
      response = await client.chat.postMessage({
        channel: channelId,
        text: `No votes`,
      });
    }

    //     const message = `
    // 1. Your fav option 1
    // 2. Your fav option 2
    // 3. Your fav option 3
    //     `;

    const message = response;

    return { outputs: { message } };
  },
);
