import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const sourcePath = resolve("dist/index.html");
const rootHtml = await readFile(sourcePath, "utf8");

const targets = [
  {
    path: resolve("dist/play/index.html"),
    assetPrefix: "../assets/"
  },
  {
    path: resolve("dist/dev/singleplayer/index.html"),
    assetPrefix: "../../assets/"
  },
  {
    path: resolve("dist/dev/board-slots/index.html"),
    assetPrefix: "../../assets/"
  },
  {
    path: resolve("dist/dev/landing-status/index.html"),
    assetPrefix: "../../assets/"
  },
  {
    path: resolve("dist/dev/card-animations/index.html"),
    assetPrefix: "../../assets/"
  },
  {
    path: resolve("dist/404.html"),
    assetPrefix: "./assets/"
  }
];

for (const target of targets) {
  const html = rootHtml.replaceAll("./assets/", target.assetPrefix);
  await mkdir(dirname(target.path), { recursive: true });
  await writeFile(target.path, html);
  console.log(`Wrote ${target.path}`);
}
