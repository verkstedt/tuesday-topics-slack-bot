import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { GetLatestPollFunctionDefinition } from "../functions/send_reminder_function.ts";

const ReminderWorkflow = DefineWorkflow({
  callback_id: "reminder_workflow",
  title: "Remind everyone to vote",
  description: "Post a reminder telling everyone to vote",
});

ReminderWorkflow.addStep(
  GetLatestPollFunctionDefinition,
  {},
);

export default ReminderWorkflow;
