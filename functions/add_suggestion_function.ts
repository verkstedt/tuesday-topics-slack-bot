import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

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
  const emojiList = await client.emoji.list();
  const emojiKeys = Object.keys(emojiList.emoji).map((emojiKey) =>
    `:${emojiKey}:`
  );
  const availableEmojis = emojiKeys.filter((emojiKey) =>
    !emojisInUse.includes(emojiKey)
  );

  console.log({ emojiList, emojiKeys, availableEmojis });
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
          channel: "C0516JP35SM",
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
      console.log({ response });
      if (!response.ok) {
        const error = `Failed to save a row in datastore: ${response.error}`;
        return { error };
      } else {
        console.log(`A new row saved: ${JSON.stringify(response.item)}`);

        const history = await client.conversations.history({
          channel: "C0516JP35SM",
        });

        const pollMessage = history.messages?.filter((message) => {
          return message?.text.includes("Topics for Tuesday");
        })[0];
        console.log({ pollMessage });
        // await client.chat.update({
        //   channel: 'C0516JP35SM',
        //   ts: pollMessage.ts
        // })

        await client.chat.postMessage({
          channel: "C0516JP35SM",
          text:
            `${user.profile.display_name} has added a topic.\n> ${suggestion}`,
        });

        return { outputs: {} };
      }
    } catch (error) {
      console.log({ error });
      await client.chat.postMessage({
        channel: "C0516JP35SM",
        text: `Sorry, the topic suggestion failed :cry:. Please try again.`,
      });
    }
  },
);
