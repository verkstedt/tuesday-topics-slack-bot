import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";

const trigger: Trigger<typeof ExampleWorkflow.definition> = {
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
        statement: "{{data.text}} != ''",
      },
    },
  },
  inputs: {
    suggestion: {
      value: "{{data.text}}",
    },
  },
};

export default trigger;
