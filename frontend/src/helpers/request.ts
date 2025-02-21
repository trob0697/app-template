export async function request(args: {
  url: string;
  method: "GET" | "POST";
  body?: object;
  query?: URLSearchParams;
}): Promise<unknown> {
  const headers = {
    "Content-Type": "application/json",
  };
  const query = args.query ? `?${args.query.toString()}` : "";
  const body = args.body ? JSON.stringify(args.body) : undefined;
  const response = await fetch(`${args.url}${query}`, {
    method: args.method,
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

export async function logOut(): Promise<void> {
  try {
    await request({
      url: "/api/auth/logout",
      method: "POST",
    });
  } finally {
    window.location.assign("/");
  }
}
