import { z } from "zod";

export const apiErrorBodySchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  code: z.string(),
  requestId: z.string(),
  timestamp: z.string(),
  details: z.unknown().optional(),
});

export class ApiClientError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly requestId: string;
  readonly timestamp: string;
  readonly details: unknown;

  constructor(body: z.output<typeof apiErrorBodySchema>) {
    super(body.message);
    this.name = "ApiClientError";
    this.statusCode = body.statusCode;
    this.code = body.code;
    this.requestId = body.requestId;
    this.timestamp = body.timestamp;
    this.details = body.details;
  }
}
