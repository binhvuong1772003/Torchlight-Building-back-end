import { Request, Response, NextFunction } from 'express';
import {
  createAffixService,
  getAffixByKey,
  getAffixesService,
} from '@/Services/Affix/affix.service';
import { CreateAffixInput } from '@/validates/affix.validate';
import { success } from 'zod';
export const createAffixController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = req.body as CreateAffixInput;
    await createAffixService(input);
    res.status(201).json({
      success: true,
      message: 'Create Affix Success',
    });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Affix key already exists',
      });
    } else {
      next(err);
    }
  }
};
export const getAffixes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getAffixesService(req.body);
    res.status(201).json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    next(err);
  }
};
export const getAffixesbyKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stat = await getAffixByKey(req.body);
    res.status(201).json({
      success: true,
      data: stat,
    });
  } catch (err: any) {
    next(err);
  }
};
