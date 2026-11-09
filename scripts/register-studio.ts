import { getCliClient } from "sanity/cli";

// Run with: sanity exec scripts/register-studio.ts --with-user-token
const client = getCliClient({ apiVersion: "2025-01-01" }).withConfig({
  useProjectHostname: false,
});
const applicationId = "l8os65g0ogh0odjy71ti2d6y";
const url = "https://nyxelion.dev/studio";
const endpoint = `/user-applications/${applicationId}`;
const application = await client.request<{
  projectId: string;
  type: string;
  urlType: string;
  appHost: string;
}>({ url: endpoint });

if (
  application.projectId !== "z9idlfz2" ||
  application.type !== "studio" ||
  application.urlType !== "external"
) {
  throw new Error("The registered application is not the expected Nyxel Studio.");
}

if (application.appHost !== url) {
  await client.request({
    url: endpoint,
    method: "PATCH",
    body: { appHost: url, urlType: "external" },
  });
}
console.log(`Studio registered at ${url}`);
