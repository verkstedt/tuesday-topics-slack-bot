import { CHANNEL_ID, TOPICS_TITLE } from "../consts.ts";
import { TODOAny } from "../types.ts";

const getPollMessage = async (client: TODOAny) => {
  const history = await client.conversations.history({
    channel: CHANNEL_ID,
  });

  const pollMessage = history.messages?.filter((message: TODOAny) => {
    return message?.text.includes(TOPICS_TITLE);
  })[0];

  return pollMessage;
};

export default getPollMessage;
