// datastores/good_tunes_datastore.ts
import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const PollmessageDatastore = DefineDatastore({
  name: "pollmessage",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    active: { type: Schema.types.boolean },
  },
});
