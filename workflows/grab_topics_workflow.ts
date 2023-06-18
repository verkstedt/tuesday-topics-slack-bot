import { Schema } from "deno-slack-sdk/mod.ts";
import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { CHANNEL_ID } from "../consts.ts";
import { GrabTopicsFunctionDefinition } from "../functions/grab_topics_function.ts";

const GrabTopicsWorkflow = DefineWorkflow({
  callback_id: "grab_topics_workflow",
  title: "Grab the topics",
  description: "Collate all the suggestions into a list",
});

const topicsMessage = GrabTopicsWorkflow.addStep(
  GrabTopicsFunctionDefinition,
  {},
);

GrabTopicsWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: CHANNEL_ID,
  message: topicsMessage.outputs.message,
});

export default GrabTopicsWorkflow;
