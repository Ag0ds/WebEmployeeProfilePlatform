import { z, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const { fieldErrors, formErrors } = err.flatten();
        return res.status(400).json({
          message: "Validation error",
          formErrors,
          fieldErrors,
          issues: err.issues,
        });
      }
      next(err);
    }
  };
}
