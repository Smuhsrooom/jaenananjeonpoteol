import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

export default function NotFound() {
  const t = useT();
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-gray-50 py-16">
      <Card className="mx-4 w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{t("notFound.title")}</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">{t("notFound.body")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
