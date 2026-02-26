import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate;

      switch (req.method) {
        case 'GET':
          dataToValidate = req.query;
          break;
        case 'POST':
        case 'PUT':
        case 'PATCH':
          dataToValidate = req.body;
          break;
        default:
          dataToValidate = req.body;
      }

      console.log('VALIDATING DATA:', dataToValidate);

      const parsed = schema.parse(dataToValidate);

      if (req.method === 'GET') {
        req.query = parsed;
      } else {
        req.body = parsed;
      }

      next();
    } catch (err) {
      console.error('ZOD ERROR:', err);
      return res.status(400).json({
        message: 'Validation failed',
        error: err,
      });
    }
  };
