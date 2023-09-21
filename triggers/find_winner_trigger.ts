import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const findWinnerTrigger: Trigger = {
  name: "Find Winner",
  // type: TriggerTypes.Scheduled,
  type: TriggerTypes.Shortcut,
  workflow: "#/workflows/find_winner_workflow",
  // schedule: {
  //   start_time: "2023-07-03T18:00:00Z",
  //   timezone: "UTC",
  //   frequency: {
  //     type: "weekly",
  //     on_days: ["Monday"],
  //     repeats_every: 1,
  //   },
  // },
};

export default findWinnerTrigger;
