import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Invoice Reader Dashboard | AdminPanel",
  description: "SAAS Base Invoice Reader Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
