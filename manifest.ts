import { Manifest } from "deno-slack-sdk/mod.ts";
import GreetingWorkflow from "./workflows/greeting_workflow.ts";
import GrabTopicsWorkflow from "./workflows/grab_topics_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "tuesday-topics",
  description:
    "A sample that demonstrates using a function, workflow and trigger to send a greeting",
  icon: "assets/default_new_app_icon.png",
  workflows: [GreetingWorkflow, GrabTopicsWorkflow],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:read",
    "groups:read",
    "mpim:read",
    "im:read",
    "channels:history",
    "groups:history",
    "mpim:history",
    "im:history",
  ],
});
