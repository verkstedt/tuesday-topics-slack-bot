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
  output_parameters: {
    properties: {
      winner: {
        type: Schema.types.string,
        description: "The winning result",
      },
    },
    required: ["winner"],
  },
});

export default SlackFunction(
  FindWinnerFunctionDefinition,
  // @ts-ignore
  async ({ client }) => {
    const history = await client.conversations.history({
      channel: "C0516JP35SM",
    });

    const pollMessage = history.messages?.filter((message) => {
      return message?.text.includes("Topics for Tuesday");
    })[0];

    const winningReaction = pollMessage.reactions.reduce((max, reaction) =>
      max.count > reaction.count ? max : reaction
    );

    const pollSuggestions = pollMessage.text.split(
      "*Topics for Tuesday*",
    )[1]
      .split("\n").map((str: string) => str.trim()).filter(Boolean);

    const winner = pollSuggestions.find((suggestion: string) =>
      suggestion.startsWith(`:${winningReaction.name}:`)
    );

    const suggestionKey = winner.replace(`:${winningReaction.name}: `, "");

    await client.apps.datastore.update({
      datastore: "suggestions",
      item: {
        id: suggestionKey,
        wasWinner: 1,
      },
    });

    pollSuggestions.map(async (sugg) => {
      await client.apps.datastore.delete({
        datastore: "suggestions",
        id: sugg,
      });
    });

    return {
      outputs: {
        winner,
      },
    };
  },
);
