import { Trigger } from "deno-slack-api/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import AddSuggestionWorkflow from "../workflows/add_suggestion_workflow.ts";

const trigger: Trigger<typeof AddSuggestionWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Trigger suggest topic",
  description: "Suggest a topic for Tuesday background day",
  workflow: "#/workflows/add_suggestion_workflow",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
