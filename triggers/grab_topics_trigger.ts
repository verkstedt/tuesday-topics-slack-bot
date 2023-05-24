import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const grabTopicsSelectionTrigger: Trigger = {
  name: "Grab Topics",
  type: TriggerTypes.Scheduled,
  workflow: "#/workflows/grab_topics_workflow", // Replace with custom function
  inputs: {},
  schedule: {
    start_time: "2023-04-05T07:00:00.000Z",
    timezone: "UTC",
    frequency: {
      type: "weekly",
      on_days: ["Wednesday"],
      repeats_every: 1,
    },
  },
};

export default grabTopicsSelectionTrigger;
