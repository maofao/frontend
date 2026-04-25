"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/shared/lib/i18n/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiClientError } from "@/shared/api";
import { loginBodySchema, type LoginBody } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useLoginMutation } from "../api/use-login-mutation";
import { mapApiClientErrorToRhfServerErrors } from "../lib/map-api-validation-issues";
import styles from "./form-fields.module.css";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setApiError(null);
    try {
      await loginMutation.mutateAsync(data);
      router.replace("/");
    } catch (err) {
      const mapped = mapApiClientErrorToRhfServerErrors(err);
      if (mapped) {
        if (mapped.root) {
          setApiError(mapped.root);
        }
        for (const [key, spec] of Object.entries(mapped.field)) {
          setError(key as keyof LoginBody, spec);
        }
        return;
      }
      if (err instanceof ApiClientError) {
        setApiError(err.message);
      }
    }
  });

  return (
    <Card maxWidth="sm" padding="comfortable" accentTop>
      <CardHeader>
        <CardTitle>{t("titleLogin")}</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardBody gap="lg">
          {apiError ? <p className={styles["root-error"]}>{apiError}</p> : null}
          <div className={styles.field}>
            <Label htmlFor="auth-login-email">{t("email")}</Label>
            <Input
              id="auth-login-email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              {...register("email")}
            />
            <div className={styles["error-slot"]}>
              {errors.email ? <p className={styles.error}>{errors.email.message}</p> : null}
            </div>
          </div>
          <div className={styles.field}>
            <Label htmlFor="auth-login-password">{t("password")}</Label>
            <Input
              id="auth-login-password"
              type="password"
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              {...register("password")}
            />
            <div className={styles["error-slot"]}>
              {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className={styles["footer-stack"]}>
            <Button type="submit" fullWidth disabled={loginMutation.isPending}>
              {t("submitLogin")}
            </Button>
            <p className={styles["link-row"]}>
              {t("noAccount")}{" "}
              <Link href="/register" className={styles.link}>
                {t("goRegister")}
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
