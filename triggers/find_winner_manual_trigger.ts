import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/typed-method-types/workflows/triggers/mod.ts";

const findWinnerManualTrigger: Trigger = {
  name: "Find Winner manual trigger",
  type: TriggerTypes.Shortcut,
  workflow: "#/workflows/find_winner_workflow",
};

export default findWinnerManualTrigger;
