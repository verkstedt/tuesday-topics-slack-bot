import { Trigger } from "deno-slack-api/types.ts";

const grabTopicsSelectionTrigger: Trigger = {
  name: "Grab Topics",
  type: "scheduled",
  workflow: "#/workflows/grab_topics_workflow", // Replace with custom function
  schedule: {
    start_time: "2023-01-25T13:16:30Z",
    timezone: "CET",
    frequency: {
      type: "weekly",
      on_days: ["Tuesday"],
      repeats_every: 1,
    },
  },
};

export default grabTopicsSelectionTrigger;
