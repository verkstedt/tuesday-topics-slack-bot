import { TOPICS_TITLE } from "../consts.ts";
import { TODOAny } from "../types.ts";

const getPollMessage = async (client: TODOAny, channel_id: string) => {
  const history = await client.conversations.history({
    channel: channel_id,
  });

  const pollMessage = history.messages?.filter((message: TODOAny) => {
    return message?.text.includes(TOPICS_TITLE);
  })[0];

  return pollMessage;
};

export default getPollMessage;
