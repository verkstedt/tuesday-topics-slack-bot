import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { CHANNEL_ID } from "../consts.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const AddSuggestionFunctionDefinition = DefineFunction({
  callback_id: "add_suggestion_function",
  title: "Add Suggestion",
  description: "Add suggestion function",
  source_file: "functions/add_suggestion_function.ts",
  input_parameters: {
    properties: {
      suggestion: {
        type: Schema.types.string,
        description:
          "Whole Suggestion obj comming from event trigger stringified",
      },
      suggestor: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["suggestion"],
  },
});

const getEmoji = async (client): Promise<string> => {
  const activeTopics = await client.apps.datastore.query({
    datastore: "suggestions",
    expression: "#wasWinner = :value",
    expression_attributes: { "#wasWinner": "wasWinner" },
    expression_values: { ":value": 0 },
  });
  const emojisInUse = activeTopics.items.map((activeTopic) =>
    activeTopic.currentEmote
  );
  const allEmojis = await client.emoji.list({ include_categories: true });
  const emojiList = allEmojis.categories.reduce(
    (acc: string[], { emoji_names }: { emoji_names: string[] }) => {
      return acc.concat(emoji_names);
    },
    [],
  );

  const emojiKeys = emojiList.map((emojiKey) => `:${emojiKey}:`);
  const availableEmojis = emojiKeys.filter((emojiKey) =>
    !emojisInUse.includes(emojiKey)
  );

  return availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
};

export default SlackFunction(
  AddSuggestionFunctionDefinition,
  async ({ inputs, client }) => {
    const { suggestion, suggestor } = inputs;
    const user = await client.users.profile.get({
      user: suggestor,
    });

    try {
      const uniqueCheck = await client.apps.datastore.get({
        datastore: "suggestions",
        id: suggestion,
      });

      if (uniqueCheck.item?.id) {
        await client.chat.postMessage({
          channel: CHANNEL_ID,
          text: `Suggestion "${suggestion}" already exists.`,
        });

        return {
          outputs: {},
        };
      }

      const emoji = await getEmoji(client);

      const response = await client.apps.datastore.put({
        datastore: "suggestions",
        item: {
          id: suggestion,
          text: suggestion,
          suggester: suggestor,
          createdAt: new Date().toISOString(),
          currentEmote: emoji,
          currentVoteCount: 0,
          wasWinner: 0,
        },
      });

      if (!response.ok) {
        const error = `Failed to save a row in datastore: ${response.error}`;
        return { error };
      } else {
        console.log(`A new row saved: ${JSON.stringify(response.item)}`);

        await client.chat.postMessage({
          channel: CHANNEL_ID,
          text:
            `${user.profile.display_name} has added a topic.\n> ${suggestion}`,
        });

        return { outputs: {} };
      }
    } catch (error) {
      console.log({ error });
      await client.chat.postMessage({
        channel: CHANNEL_ID,
        text: `Sorry, the topic suggestion failed :cry:. Please try again.`,
      });
    }
  },
);
