import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackAPI } from "deno-slack-api/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GrabTopicsFunctionDefinition = DefineFunction({
  callback_id: "grab_topics_function",
  title: "Grab topics",
  description: "Grab topics",
  source_file: "functions/grab_topics_function.ts",
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
  GrabTopicsFunctionDefinition,
  // @ts-ignore
  async ({ inputs, client }) => {
    const { channelId } = inputs;

    // let postMsgResponse = await client.chat.postMessage({
    //   channel: "C123456",
    //   text: "Hello World",a
    // });
    // const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    // const salutation =
    //   salutations[Math.floor(Math.random() * salutations.length)];
    // const greeting =
    //   `${salutation}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${message}`;
    const history = await client.conversations.history({
      channel: channelId,
    });

    const suggestions = history.messages?.filter((message) => {
      return message?.bot_id === "B04L8JDM2RH";
    }).reduce((list, msg, index) => {
      return `${list}
${index + 1}. ${msg.text.split("\n&gt; ")[1]}`;
    }, "");

    // const replies = await client.conversations.replies({
    //   channel: channelId,
    //   ts: "1674651917.270719",
    // });
    // const messages2 = await client.conversations.list();
    console.dir({ suggestions }, { depth: 5 });
    const response = await client.chat.postMessage({
      channel: channelId,
      text: `
      Topics for Tuesday
      ${suggestions}
      `,
    });

    //     const message = `
    // 1. Your fav option 1
    // 2. Your fav option 2
    // 3. Your fav option 3
    //     `;

    const message = response;

    return { outputs: { message } };
  },
);
