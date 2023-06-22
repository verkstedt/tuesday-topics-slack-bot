import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
export const GetEmojiListFunctionDefinition = DefineFunction({
  callback_id: "get_emoji_list_function",
  title: "Get Emoji List",
  description: "Get list of available Emojis",
  source_file: "functions/get_emoji_list_function.ts",
  output_parameters: {
    required: ["emojis"],
    properties: {
      emojis: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
      },
    },
  },
});

export default SlackFunction(
  GetEmojiListFunctionDefinition,
  async ({ client, inputs }) => {
    // Get currently used emojis
    const activeTopics = await client.apps.datastore.query({
      datastore: "suggestions",
      expression: "#wasWinner = :value",
      expression_attributes: { "#wasWinner": "wasWinner" },
      expression_values: { ":value": 0 },
    });
    const emojisInUse = activeTopics.items.map((activeTopic) =>
      activeTopic.currentEmote
    );
    // const emojiList = await client.emoji.list();
    // const emojiKeys = Object.keys(emojiList).map((emojiKey) => `:${emojiKey}:`);
    // const availableEmojis = emojiKeys.filter((emojiKey) =>
    //   !emojisInUse.includes(emojiKey)
    // );
    // console.log({ availableEmojis });
    try {
      await client.dialog.open({
        // trigger_id: "Ft05D40BH9D2",
        dialog: {
          title: "Tuesday Topic",
          callback_id: "add_suggestion_function",
          // interactivity: AddSuggestionWorkflow.inputs.interactivity,
          submit_label: "Add new topic",
          description: "Suggest a new topic for Tuesday Topics!",
          fields: {
            elements: [{
              name: "suggestion",
              title: "Suggested Topic",
              type: Schema.types.string,
            }],
          },
        },
      });
    } catch (error) {
      console.log({ error });
    }
    return {
      outputs: {
        emojis: [],
      },
    };
  },
);
