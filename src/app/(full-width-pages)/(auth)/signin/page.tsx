import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Modrik Dashboard | AdminPanel",
  description: "SAAS Base Modrik Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
