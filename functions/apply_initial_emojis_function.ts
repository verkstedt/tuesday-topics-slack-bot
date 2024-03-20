import { CHANNEL_ID } from "../consts.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import getAvailableEmojis from "../utils/getAvailableEmojis.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ApplyInitialEmojisFunctionDefinition = DefineFunction({
  callback_id: "apply_initial_emojis_function",
  title: "Apply initial emojis",
  description: "Puts an emoji for each suggestion on the poll message",
  source_file: "functions/apply_initial_emojis_function.ts",
  input_parameters: {
    required: ["timestamp", "activeEmojis"],
    properties: {
      timestamp: {
        type: Schema.types.string,
      },
      activeEmojis: {
        type: Schema.types.array,
        items: {
          type: Schema.types.string,
        },
      },
    },
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  ApplyInitialEmojisFunctionDefinition,
  async ({ client, inputs }) => {
    try {
      const { timestamp, activeEmojis } = inputs;

      // TODO move to own function
      await client.pins.add({
        channel: CHANNEL_ID,
        timestamp,
      });

      const bookmarkTitle = "Tuesday Topics Poll";
      // Update bookmark
      const bookmarkReponse = await client.bookmarks.list({
        channel: CHANNEL_ID,
      });

      if (bookmarkReponse.ok) {
        const bookmark = bookmarkReponse.bookmarks.find((bm: any) => {
          return bm.title === bookmarkTitle;
        });

        const { permalink } = await client.chat.getPermalink({
          channel: CHANNEL_ID,
          message_ts: timestamp,
        });

        if (bookmark) {
          await client.bookmarks.edit({
            channel_id: CHANNEL_ID,
            bookmark_id: bookmark.id,
            link: permalink,
          });
        } else {
          await client.bookmarks.add({
            channel_id: CHANNEL_ID,
            title: bookmarkTitle,
            type: "link",
            emoji: ":ballot_box_with_ballot:",
            link: permalink,
          });
        }
      }

      const emojiList = await getAvailableEmojis(client);
      await Promise.all(activeEmojis.map(async (emojiName: string) => {
        const name = emojiName.slice(1, -1);
        if (emojiList.includes(name)) {
          const addReaction = await client.reactions.add({
            channel: CHANNEL_ID,
            name,
            timestamp,
          });

          if (!addReaction.ok) {
            throw new Error(addReaction.error);
          }
        } else {
          return Promise.resolve();
        }
      }));
    } catch (error) {
      console.log({ error });
    }

    return {
      outputs: {},
    };
  },
);
