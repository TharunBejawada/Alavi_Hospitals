import { redirect } from "next/navigation";

export default function NotFound() {
  // Instantly redirects any unhandled route to the home page
  redirect("/");
}