import { TODOAny } from "../types.ts";

const getAvailableEmojis = async (client: TODOAny) => {
  const { emoji: emojis } = await client.emoji.list({
    include_categories: false,
  });
  const emojiList = Object.entries<string>(emojis).reduce(
    (acc: string[], [name, ref]) => {
      const emojiArray = acc;

      if (ref.startsWith("alias:")) {
        const emojiName = ref.replace("alias:", "");

        if (!emojiArray.includes(emojiName)) {
          emojiArray.push(emojiName);
        }
      } else {
        emojiArray.push(name);
      }

      return emojiArray;
    },
    [] as string[],
  );

  return emojiList;
};

export default getAvailableEmojis;
