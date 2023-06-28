import { Manifest } from "deno-slack-sdk/mod.ts";
import GrabTopicsWorkflow from "./workflows/grab_topics_workflow.ts";
import FindWinnerWorkflow from "./workflows/find_winner_workflow.ts";
import { SuggestionsDatastore } from "./datastores/suggestions.ts";
import AddSuggestionWorkflow from "./workflows/add_suggestion_workflow.ts";
/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "tuesday-topics-poll-bot",
  description:
    "A sample that demonstrates using a function, workflow and trigger to send a greeting",
  icon: "assets/default_new_app_icon.png",
  workflows: [
    AddSuggestionWorkflow,
    GrabTopicsWorkflow,
    FindWinnerWorkflow,
  ],
  outgoingDomains: [],
  datastores: [SuggestionsDatastore], // Add the database to this list
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
    "datastore:read",
    "datastore:write",
    "emoji:read",
    "users.profile:read",
  ],
});
