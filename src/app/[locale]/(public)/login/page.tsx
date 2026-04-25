import { setRequestLocale } from "next-intl/server";
import { LoginPage } from "@/screens/auth-login";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginPage />;
}
