import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  },
  deployment: {
    appId: "l8os65g0ogh0odjy71ti2d6y",
  },
});
