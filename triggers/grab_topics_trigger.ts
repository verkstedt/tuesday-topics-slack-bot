import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const grabTopicsSelectionTrigger: Trigger = {
  name: "Grab Topics",
  type: TriggerTypes.Scheduled,
  workflow: "#/workflows/grab_topics_workflow",
  schedule: {
    start_time: "2023-10-18T07:00:00Z",
    timezone: "UTC",
    frequency: {
      type: "weekly",
      on_days: ["Wednesday"],
      repeats_every: 1,
    },
  },
};

export default grabTopicsSelectionTrigger;
