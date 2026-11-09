import "server-only";

type Repository = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  private: boolean;
  owner: { login: string };
};

const owner = "Nyxeli0n";

export async function readProjects() {
  const repositories: Repository[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/users/${owner}/repos?type=owner&sort=created&direction=desc&per_page=100&page=${page}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok)
      throw new Error(`GitHub projects request failed (${response.status})`);
    const batch: Repository[] = await response.json();
    repositories.push(...batch);
    if (batch.length < 100) break;
  }

  const projects = repositories
    .filter(
      (repository) =>
        !repository.private &&
        repository.owner.login.toLowerCase() === owner.toLowerCase(),
    )
    .sort(
      (a, b) =>
        Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id,
    );

  const publicProjects = projects.map((repository, index) => ({
    name: repository.name,
    description:
      repository.name.toLowerCase() === "nyxel-site"
        ? "本サイト"
        : repository.description ?? "",
    href: `https://github.com/${owner}/${encodeURIComponent(repository.name)}`,
    number: String(projects.length - index).padStart(2, "0"),
  }));
  return [
    {
      name: "VEIN",
      description: "WebGPUによる液体金属のインタラクティブアート",
      href: "https://vein.nyxelion.dev",
      number: String(publicProjects.length + 1).padStart(2, "0"),
    },
    ...publicProjects,
  ];
}
