import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import { CreateItemBaseInput } from '@/validates/item/itemBase.validate';
const createItemBaseService = async (input: CreateItemBaseInput) => {
  const existing = await db.affix.findUnique({
    where: { key: input.key },
  });
  if (existing) {
    throw new ApiError(409, 'Existing');
  }
  const baseAffixes = db.baseAffix.findMany({ where: { key } });
};
