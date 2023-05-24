import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const findWinnerTrigger: Trigger = {
  name: "Grab Topics",
  type: TriggerTypes.Scheduled,
  workflow: "#/workflows/find_winner_workflow", // Replace with custom function
  inputs: {},
  schedule: {
    start_time: "2023-04-10T18:00:00",
    timezone: "UTC",
    frequency: {
      type: "weekly",
      on_days: ["Monday"],
      repeats_every: 1,
    },
  },
};

export default findWinnerTrigger;
