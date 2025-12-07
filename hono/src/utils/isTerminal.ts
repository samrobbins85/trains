const terminals = [
  "curl",
  "httpie",
  "lwp-request",
  "wget",
  "python-requests",
  "openbsd ftp",
  "powershell",
  "fetch",
  "aiohttp",
];

export function isTerminal(agent?: string) {
  return terminals.some((element) => agent?.includes(element));
}
