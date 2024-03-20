import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import ReminderWorkflow from "../workflows/reminder_workflow.ts";

const trigger: Trigger<typeof ReminderWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Remind everyone to vote",
  description: "Remind everyone to vote",
  workflow: "#/workflows/reminder_workflow",
};

export default trigger;
