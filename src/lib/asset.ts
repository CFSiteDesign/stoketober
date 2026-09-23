/**
 * Resolve a file in /public against Vite's base path, so the page works both at
 * the domain root and when deployed under a sub-path such as
 * minis.madmonkeyhostels.com/partnership/stoketoberfest/2026/.
 */
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
