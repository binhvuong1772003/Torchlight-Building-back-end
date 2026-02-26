import { Request, Response, NextFunction } from 'express';
import {
  createStatService,
  getStatService,
  getStatById,
  getStatByKey,
  statUpdateService,
  deleteStatService,
  bulkCreateStatsService,
} from '@/Services/Affix/stat.service';
import { GetStatsQueryInput } from '@/validates/stat.validate';
import { success } from 'zod';
export const createStatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createStatService(req.body);
    res.status(201).json({
      success: true,
      message: 'Stat Create Success',
    });
  } catch (err: any) {
    next(err);
  }
};
export const getStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = req.query as GetStatsQueryInput;
    const stats = await getStatService(filters);
    res.status(201).json({
      success: true,
      data: stats,
    });
  } catch (err: any) {
    next(err);
  }
};
export const getStatbyIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stat = await getStatById(req.body);
    res.status(201).json({
      success: true,
      data: stat,
    });
  } catch (err: any) {
    next(err);
  }
};
export const getStatbyKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stat = await getStatByKey(req.body);
    res.status(201).json({
      success: true,
      data: stat,
    });
  } catch (err: any) {
    next(err);
  }
};
export const statUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };
    await statUpdateService(id, req.body);
    res.status(201).json({
      success: true,
      message: 'Stat Update Success',
    });
  } catch (err: any) {
    next(err);
  }
};
export const deleteStatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as { id: string };
    await deleteStatService(id);
    res.status(201).json({
      success: true,
      message: 'Stat Update Success',
    });
  } catch (err: any) {
    next(err);
  }
};
export const bulkCreateStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats)) {
      return res.status(400).json({
        success: false,
        error: 'Stats must be an array',
      });
    }
    await bulkCreateStatsService(stats);
    res.status(201).json({
      success: true,
      message: 'Stat Create Success',
    });
  } catch (err: any) {
    next(err);
  }
};
