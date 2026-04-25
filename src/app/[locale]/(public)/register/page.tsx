import { setRequestLocale } from "next-intl/server";
import { RegisterPage } from "@/screens/auth-register";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegisterPage />;
}
