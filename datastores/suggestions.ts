// datastores/good_tunes_datastore.ts 
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const SuggestionsDatastore = DefineDatastore({
  name: "suggestions",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    suggestion: { type: Schema.types.string },
    suggester: { type: Schema.types.string },
    createdAt: { type: Schema.types.string },
    currentEmote: { type: Schema.types.string },
    currentVoteCount: { type: Schema.types.number },
    wasWinner: { type: Schema.types.number },
  },
});