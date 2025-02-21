import { cookies } from "next/headers";
import React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;

export default async function Navbar() {
  const token =
    (await cookies()).get("accessToken") ||
    (await cookies()).get("refreshToken");

  return (
    <div className="flex justify-around p-8">
      <div>
        <h1 className="inline-block">Intake-</h1>
        <h1 className="inline-block text-[--primary]">ai</h1>
      </div>
      <nav className="max-md:hidden">
        <ul className="flex justify-around gap-16 py-4">
          <li>
            <a href="#client-reviews">Reviews</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#getting-started">Getting Started</a>
          </li>
        </ul>
      </nav>
      <button>
        {token ? (
          <a href="/dashboard">Dashboard</a>
        ) : (
          <a href={getGoogleOauthURL()}>Login</a>
        )}
      </button>
    </div>
  );
}

function getGoogleOauthURL(): string {
  const query = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: `${API_URL}/auth/google`,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`;
}
