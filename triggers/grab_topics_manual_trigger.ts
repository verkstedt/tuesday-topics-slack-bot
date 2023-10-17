import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const grabTopicsSelectionManualTrigger: Trigger = {
  name: "Grab Topics manual trigger",
  type: TriggerTypes.Shortcut,
  workflow: "#/workflows/grab_topics_workflow",
};

export default grabTopicsSelectionManualTrigger;
