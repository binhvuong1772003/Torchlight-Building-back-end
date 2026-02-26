import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import type {
  CreateStatInput,
  UpdateStatInput,
  GetStatsQueryInput,
} from '@/validates/stat.validate';

export const createStatService = async (data: CreateStatInput) => {
  const existing = await db.StatDefinition.findUnique({
    where: { key: data.key },
  });
  if (existing) {
    throw new ApiError(409, 'Existing');
  }
  return db.StatDefinition.create({ data });
};
export const getStatService = async (filters: GetStatsQueryInput) => {
  const where: any = {};
  if (filters?.category) {
    where.category = filters.category;
  }
  if (filters?.valueType) {
    where.valueType = filters.valueType;
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { key: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }
  return await db.StatDefinition.findMany({
    where,
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
};
export const getStatById = async (id: string) => {
  const stat = db.StatDefinition.findMany({ where: { id } });
  if (!stat) {
    throw new ApiError(404, 'Stat not Found');
  }
  return stat;
};
export const getStatByKey = async (Key: string) => {
  const stat = db.StatDefinition.findMany({ where: { Key } });
  if (!stat) {
    throw new ApiError(404, 'Stat not Found');
  }
  return stat;
};
export const statUpdateService = async (id: string, data: UpdateStatInput) => {
  await getStatById(id);
  return await db.StatDefinition.update({ where: { id }, data });
};
export const deleteStatService = async (id: string) => {
  await getStatById(id);

  // Check if stat is being used
  const affixStats = await db.affixStat.count({
    where: { statDefId: id },
  });

  const baseAffixStats = await db.baseAffixStat.count({
    where: { statDefId: id },
  });

  if (affixStats > 0 || baseAffixStats > 0) {
    throw new Error(
      'Cannot delete stat that is being used in affixes or base affixes'
    );
  }

  await db.statDefinition.delete({
    where: { id },
  });

  return { message: 'Stat deleted successfully' };
};
export const bulkCreateStatsService = async (stats: CreateStatInput[]) => {
  const results = [];
  const errors = [];

  for (const statData of stats) {
    try {
      const stat = await createStatService(statData);
      results.push(stat);
    } catch (error: any) {
      errors.push({
        key: statData.key,
        error: error.message,
      });
    }
  }

  return {
    success: results.length,
    failed: errors.length,
    results,
    errors,
  };
};
