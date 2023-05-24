import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import AddSuggestionWorkflow from "../workflows/add_suggestion_workflow.ts";

const trigger: Trigger<typeof AddSuggestionWorkflow.definition> = {
  type: TriggerTypes.Event,
  name: "Reactji response",
  description: "responds to a specific reactji",
  workflow: "#/workflows/add_suggestion_workflow",
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["C0516JP35SM"],
    filter: {
      version: 1,
      root: {
        statement: "{{data.user_id}} === 'U04KU61458X'",
      },
    },
  },
  inputs: {
    suggestion: {
      value: JSON.stringify("{{data}}"),
    },
  },
};

export default trigger;
