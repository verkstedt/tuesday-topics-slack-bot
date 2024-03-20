import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import ReminderWorkflow from "../workflows/reminder_workflow.ts";

const trigger: Trigger<typeof ReminderWorkflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Remind everyone to vote",
  description: "Remind everyone to vote",
  workflow: "#/workflows/reminder_workflow",
  schedule: {
    start_time: "2024-03-24T10:00:00Z",
    timezone: "Europe/Amsterdam",
    frequency: {
      type: "weekly",
      on_days: ["Monday"],
      repeats_every: 1,
    },
  },
};

export default trigger;
