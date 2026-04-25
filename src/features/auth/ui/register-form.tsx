"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/shared/lib/i18n/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiClientError } from "@/shared/api";
import type { RegisterBody } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRegisterMutation } from "../api/use-register-mutation";
import { mapApiClientErrorToRhfServerErrors } from "../lib/map-api-validation-issues";
import { registerFormSchema, type RegisterFormValues } from "../model/schemas";
import styles from "./form-fields.module.css";

function toRegisterBody(values: RegisterFormValues): RegisterBody {
  return {
    email: values.email,
    password: values.password,
    displayName: values.displayName,
  };
}

export function RegisterForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setApiError(null);
    try {
      await registerMutation.mutateAsync(toRegisterBody(values));
      router.replace("/");
    } catch (err) {
      const mapped = mapApiClientErrorToRhfServerErrors(err);
      if (mapped) {
        if (mapped.root) {
          setApiError(mapped.root);
        }
        for (const [key, spec] of Object.entries(mapped.field)) {
          setError(key as keyof RegisterFormValues, spec);
        }
        return;
      }
      if (err instanceof ApiClientError && err.code === "HTTP_409") {
        setError("email", { type: "server", message: t("emailTaken") });
        return;
      }
      if (err instanceof ApiClientError) {
        setApiError(err.message);
      }
    }
  });

  const confirmMsg =
    errors.confirmPassword?.message === "mismatch"
      ? t("passwordMismatch")
      : errors.confirmPassword?.message;

  return (
    <Card maxWidth="sm" padding="comfortable" accentTop>
      <CardHeader>
        <CardTitle>{t("titleRegister")}</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardBody gap="lg">
          {apiError ? <p className={styles["root-error"]}>{apiError}</p> : null}
          <div className={styles.field}>
            <Label htmlFor="auth-register-displayName">{t("displayName")}</Label>
            <Input
              id="auth-register-displayName"
              type="text"
              autoComplete="name"
              aria-invalid={errors.displayName ? true : undefined}
              {...register("displayName")}
            />
            <div className={styles["error-slot"]}>
              {errors.displayName ? (
                <p className={styles.error}>{errors.displayName.message}</p>
              ) : null}
            </div>
          </div>
          <div className={styles.field}>
            <Label htmlFor="auth-register-email">{t("email")}</Label>
            <Input
              id="auth-register-email"
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
            <Label htmlFor="auth-register-password">{t("password")}</Label>
            <Input
              id="auth-register-password"
              type="password"
              autoComplete="new-password"
              aria-invalid={errors.password ? true : undefined}
              {...register("password")}
            />
            <div className={styles["error-slot"]}>
              {errors.password ? <p className={styles.error}>{errors.password.message}</p> : null}
            </div>
          </div>
          <div className={styles.field}>
            <Label htmlFor="auth-register-confirm">{t("confirmPassword")}</Label>
            <Input
              id="auth-register-confirm"
              type="password"
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? true : undefined}
              {...register("confirmPassword")}
            />
            <div className={styles["error-slot"]}>
              {errors.confirmPassword && confirmMsg ? (
                <p className={styles.error}>{confirmMsg}</p>
              ) : null}
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className={styles["footer-stack"]}>
            <Button type="submit" fullWidth disabled={registerMutation.isPending}>
              {t("submitRegister")}
            </Button>
            <p className={styles["link-row"]}>
              {t("hasAccount")}{" "}
              <Link href="/login" className={styles.link}>
                {t("goLogin")}
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
