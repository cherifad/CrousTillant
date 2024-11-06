import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crous'tillant - Votre menu du RU",
  description: "Cette page n'existe pas, oubliez-la.",
};

export default function RestaurantPage() {
  return redirect("/"); // Redirect to the home page
}
