import { setRequestLocale } from "next-intl/server";
import { AppHomePage } from "@/screens/app-home";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AppHomePage />;
}
