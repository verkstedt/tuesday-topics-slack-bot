import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const grabTopicsSelectionTrigger: Trigger = {
  name: "Grab Topics",
  // type: TriggerTypes.Scheduled,
  type: TriggerTypes.Shortcut,
  workflow: "#/workflows/grab_topics_workflow", // Replace with custom function
  inputs: {
    channelId: {
      value: "C0516JP35SM",
    },
  },
  // schedule: {
  //   start_time: "2023-05-24T14:02:40Z",
  //   timezone: "UTC",
  //   frequency: {
  //     type: "once",
  //   },
  //   // frequency: {
  //   //   type: "weekly",
  //   //   on_days: ["Wednesday"],
  //   //   repeats_every: 1,
  //   // },
  // },
};

export default grabTopicsSelectionTrigger;
