import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import { CreateBaseAffixStatInput } from '@/validates/baseAffixStat.validate';
export const createBaseAffixStatService = async (
  data: CreateBaseAffixStatInput
) => {
  //   const existing = await db.baseAffixStat.findFirst({
  //     where: { baseAffixId: data.baseAffixId, statDefId: data.statDefId },
  //   });
  //   if (existing) throw new ApiError(409, 'Base Affix Stat Already Exist');
  const statKeys = data.stats.map((s) => s.statKey);
  const statDefs = await db.statDefinition.findMany({
    where: { key: { in: statKeys } },
  });
  if (statKeys.length !== statDefs.length) {
    const foundKey = statDefs.map((s) => s.key);
    const missingKey = statKeys.filter((k) => {
      !foundKey.includes(k);
    });
    throw new ApiError(404, 'Missing Key');
  }
  return await db.baseAffixStat.create({
    baseAffixId,
  });
};
