import { CHANNEL_ID, TOPICS_TITLE } from "../consts.ts";

const getPollMessage = async (client) => {
  const history = await client.conversations.history({
    channel: CHANNEL_ID,
  });

  const pollMessage = history.messages?.filter((message) => {
    return message?.text.includes(TOPICS_TITLE);
  })[0];

  return pollMessage;
};

export default getPollMessage;
