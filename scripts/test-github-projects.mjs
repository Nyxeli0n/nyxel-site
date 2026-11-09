import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(
  new URL("../app/(site)/lib/github-projects.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(
  source.replace('import "server-only";', ""),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
let batches = [];
let calls = [];
let status = 200;
const context = vm.createContext({
  exports: {},
  AbortSignal,
  fetch: async (url, options) => {
    calls.push({ url, options });
    return { ok: status === 200, status, json: async () => batches.shift() };
  },
});
vm.runInContext(compiled, context);
const readProjects = async () => {
  const entries = JSON.parse(JSON.stringify(await context.exports.readProjects()));
  const artwork = entries.shift();
  assert.equal(artwork.name, "VEIN");
  assert.equal(artwork.href, "https://vein.nyxelion.dev");
  assert.equal(artwork.number, String(entries.length + 1).padStart(2, "0"));
  assert.equal(entries.some((entry) => entry.href.includes("/vein")), false);
  return entries;
};
const repo = (id, created_at, extra = {}) => ({
  id,
  name: `repo-${id}`,
  description: null,
  created_at,
  private: false,
  owner: { login: "Nyxeli0n" },
  ...extra,
});
const old = repo(1, "2025-01-01T00:00:00Z");
const recent = repo(2, "2026-01-01T00:00:00Z");
const newest = repo(3, "2026-02-01T00:00:00Z");
const plain = (value) => JSON.parse(JSON.stringify(value));
batches = [
  [
    old,
    newest,
    recent,
    repo(4, newest.created_at, { private: true }),
    repo(5, newest.created_at, { owner: { login: "someone-else" } }),
  ],
];
assert.deepEqual(
  plain(await readProjects()).map(({ name, number }) => [name, number]),
  [
    ["repo-3", "03"],
    ["repo-2", "02"],
    ["repo-1", "01"],
  ],
);
assert.equal(calls[0].options.next.revalidate, 300);
assert.equal(calls[0].options.headers.Authorization, undefined);
batches = [[
  repo(1, old.created_at, { name: "nyxel-site", description: "Old description" }),
  repo(2, newest.created_at, { description: "Another project" }),
]];
assert.deepEqual(
  plain(await readProjects()).map(({ description, href }) => [description, href]),
  [
    ["Another project", "https://github.com/Nyxeli0n/repo-2"],
    ["本サイト", "https://nyxelion.dev"],
  ],
);
batches = [[old, newest]];
assert.deepEqual(
  plain(await readProjects()).map((p) => p.number),
  ["02", "01"],
);
batches = [[]];
assert.deepEqual(plain(await readProjects()), []);
calls = [];
batches = [
  Array.from({ length: 100 }, (_, i) => repo(i + 1, old.created_at)),
  [repo(101, newest.created_at)],
];
assert.equal((await readProjects()).length, 101);
assert.match(calls[1].url, /page=2$/);
status = 403;
await assert.rejects(readProjects, /GitHub projects request failed \(403\)/);
console.log(
  "Passed: ordering, bottom-up renumbering, deletion, empty list, privacy, pagination, cache configuration, API failure.",
);
