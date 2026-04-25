"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
import type { input, output, $ZodType } from "zod/v4/core";

export function useZodForm<TSchema extends $ZodType<FieldValues, FieldValues>>(
  schema: TSchema,
  props?: Omit<UseFormProps<input<TSchema>, unknown, output<TSchema>>, "resolver">,
) {
  return useForm<input<TSchema>, unknown, output<TSchema>>({
    ...props,
    resolver: zodResolver(schema),
  });
}
