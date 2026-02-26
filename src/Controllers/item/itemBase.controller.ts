import { Request, Response, NextFunction } from 'express';
import { createItemBaseService } from '@/Services/Item/itemBase.service';
export const createItemBaseController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createItemBaseService(req.body, req.file);
    res.status(201).json({
      success: true,
      message: 'Item Base Create Success',
    });
  } catch (err: any) {
    next(err);
  }
};
