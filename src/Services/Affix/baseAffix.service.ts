import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import type {
  CreateBaseAffixInput,
  GetBaseAffixQueryInput,
} from '@/validates/baseAffix.validate';
export const createBaseAffixService = async (input: CreateBaseAffixInput) => {
  const existing = await db.baseAffix.findUnique({ where: { key: input.key } });
  if (existing) {
    throw new ApiError(409, 'Existing');
  }
  const statKeys = input.stats.map((s) => s.statKey);
  const statDefs = await db.statDefinition.findMany({
    where: { key: { in: statKeys } },
  });
  if (statDefs.length !== statKeys.length) {
    const foundKey = statDefs.map((s) => s.key);
    const missingKey = statKeys.filter((k) => !foundKey.includes(k));
    throw new ApiError(404, `missingKey: ${missingKey}`);
  }
  const baseAffix = await db.baseAffix.create({
    data: {
      key: input.key,
      name: input.name,
      description: input.description,
      minItemLevel: input.minItemLevel,
      isPriceless: input.isPriceless,
      stats: {
        create: input.stats.map((statData) => {
          const statDef = statDefs.find((s) => s.key === statData.statKey)!;
          return {
            statDefId: statDef.id,
            value: statData.value,
          };
        }),
      },
    },
  });
  return baseAffix;
};
export const getBaseAffixService = async (filters: GetBaseAffixQueryInput) => {
  const where: any = {};
  if (filters?.minItemLevel) {
    where.valueType = filters.minItemLevel;
  }
  if (filters?.isPriceless) {
    where.isPriceless = filters.isPriceless;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { key: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  return await db.baseAffix.findMany({
    where,
    orderBy: [{ name: 'asc' }],
  });
};
