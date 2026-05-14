import { loadManifest, renderProfileSidebar, initTheme } from "./shared.js";

initTheme();

loadManifest().then((manifest) => {
  const { site } = manifest;
  document.title = `About — ${site.author}`;
  renderProfileSidebar(document.getElementById("sidebar-slot"), site, "about");
}).catch((err) => {
  console.error(err);
  document.getElementById("about-error").textContent =
    "Could not load site data. Make sure content/manifest.json is reachable.";
});
