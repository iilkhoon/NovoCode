import type { Metadata } from "next";
import { AuthScreen } from "@/components/app/AuthScreen";

export const metadata: Metadata = { title: "Daxil ol", description: "NovoCode hesabınıza daxil olun və ya pulsuz qeydiyyatdan keçin." };

export default function LoginPage() {
  return <AuthScreen />;
}
