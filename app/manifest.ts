import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NAVRobotec",
    short_name: "NAVRobotec",
    description: "Sovereign software for autonomous flight.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b0d10",
    icons: [{ src: "/mark.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
