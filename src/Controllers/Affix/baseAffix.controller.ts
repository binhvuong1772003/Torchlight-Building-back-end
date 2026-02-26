import { Request, Response, NextFunction } from 'express';
import {
  createBaseAffixService,
  getBaseAffixService,
} from '@/Services/Affix/baseAffix.service';
import {
  CreateBaseAffixInput,
  GetBaseAffixQueryInput,
} from '@/validates/baseAffix.validate';
export const createBaseAffixController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body as CreateBaseAffixInput;
    await createBaseAffixService(input);
    res.status(201).json({
      success: true,
      message: 'Create Base Affix Success',
    });
  } catch (err: any) {
    next(err);
  }
};
export const getBaseAffixController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query as GetBaseAffixQueryInput;
    const stats = await getBaseAffixService(filters);
    res.status(201).json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    next(err);
  }
};
