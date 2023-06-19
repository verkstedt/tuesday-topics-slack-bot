import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const findWinnerTrigger: Trigger = {
  name: "Find Winner",
  type: TriggerTypes.Shortcut,
  workflow: "#/workflows/find_winner_workflow", // Replace with custom function
  // inputs: {},
  // schedule: {
  //   start_time: "2023-01-25T14:59:30Z",
  //   timezone: "UTC",
  //   // frequency: {
  //   //   type: "weekly",
  //   //   on_days: ["Wednesday"],
  //   //   repeats_every: 1,
  //   // },
  // },
};

export default findWinnerTrigger;
