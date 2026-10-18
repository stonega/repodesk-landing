import { index, type RouteConfig, route } from "@react-router/dev/routes";
import snapshot from "./content/repodesk/manifest.json" with { type: "json" };

export default [
  index("routes/home.tsx"),
  ...snapshot.documents.map((document) =>
    route(document.route.slice(1), "routes/docs.tsx", {
      id: document.route.slice(1),
    }),
  ),
] satisfies RouteConfig;
