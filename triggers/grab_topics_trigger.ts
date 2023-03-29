import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const increaseTime = (secondsOffset = 20, hoursOffset = -2) => {
  const currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + secondsOffset);
  currentTime.setHours(currentTime.getHours() + hoursOffset);

  return d.toISOString();
};

const grabTopicsSelectionTrigger: Trigger = {
  name: "Grab Topics",
  type: TriggerTypes.Scheduled,
  workflow: "#/workflows/grab_topics_workflow", // Replace with custom function
  inputs: {},
  schedule: {
    start_time: increaseTime(),
    timezone: "UTC",
    // frequency: {
    //   type: "weekly",
    //   on_days: ["Wednesday"],
    //   repeats_every: 1,
    // },
  },
};

export default grabTopicsSelectionTrigger;
