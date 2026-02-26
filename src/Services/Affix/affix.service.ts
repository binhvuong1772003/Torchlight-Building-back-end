import { any, includes } from 'zod';

import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import type {
  CreateAffixInput,
  UpdateAffixInput,
  GetAffixesQueryInput,
} from '@/validates/affix.validate';
export const createAffixService = async (input: CreateAffixInput) => {
  const existing = await db.affix.findUnique({
    where: { key: input.key },
  });
  if (existing) {
    throw new ApiError(409, 'Existing');
  }
  const statKeys = input.stats.map((s) => s.statKey);
  const statDefs = await db.statDefinition.findMany({
    where: { key: { in: statKeys } },
  });
  if (statKeys.length !== statDefs.length) {
    const foundKey = statDefs.map((s: any) => s.key);
    const missingKey = statKeys.filter((k) => !foundKey.includes(k));
    throw new ApiError(404, 'missingKey');
  }
  const affix = await db.affix.create({
    data: {
      key: input.key,
      name: input.name,
      description: input.description,
      type: input.type,
      tier: input.tier,
      tierlevel: input.tierlevel,
      tags: input.tags,
      minItemLevel: input.minItemLevel,
      maxItemLevel: input.maxItemLevel,
      stats: {
        create: input.stats.map((statData: any) => {
          const statDef = statDefs.find(
            (sd: any) => sd.key === statData.statKey
          )!;
          return {
            statDefId: statDef.id,
            rollTables: { create: statData.rollTables },
          };
        }),
      },
    },
    include: {
      stats: {
        include: { statDef: true, rollTables: true },
      },
    },
  });
  return affix;
};
export const getAffixesService = async (filters?: GetAffixesQueryInput) => {
  const where: any = {};
  const orConditions: any[] = [];

  // Simple filters
  if (filters?.type) {
    where.type = filters.type;
  }

  if (filters?.tier) {
    where.tier = filters.tier;
  }

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.minItemLevel) {
    where.minItemLevel = { lte: filters.minItemLevel };
  }

  if (filters?.tags) {
    const tagArray = filters.tags.split(',').map((t) => t.trim());
    where.tags = { hasSome: tagArray };
  }

  // OR conditions: maxItemLevel
  if (filters?.maxItemLevel) {
    orConditions.push(
      { maxItemLevel: null },
      { maxItemLevel: { gte: filters.maxItemLevel } }
    );
  }

  // OR conditions: search
  if (filters?.search) {
    orConditions.push(
      { name: { contains: filters.search, mode: 'insensitive' } },
      { key: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    );
  }

  // Combine all OR conditions
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  return await db.affix.findMany({
    where,
    include: {
      stats: {
        include: {
          statDef: true,
          rollTables: true,
        },
      },
    },
    orderBy: [{ tier: 'asc' }, { tierlevel: 'asc' }, { name: 'asc' }],
  });
};
export const getAffixById = async (id: string) => {
  const affix = await db.affix.findUnique({
    where: { id },
    include: {
      stats: {
        include: { statDef: true, rollTables: true },
      },
    },
  });
  if (!affix) {
    throw new ApiError(404, 'Not Found');
  }
  return affix;
};
export const getAffixByKey = async (key: string) => {
  const affix = await db.affix.findUnique({
    where: { key },
    include: {
      stats: {
        include: { statDef: true, rollTables: true },
      },
    },
  });
  if (!affix) {
    throw new ApiError(404, 'Not Found');
  }
  return affix;
};
export const updateAffix = async (id: string, data: UpdateAffixInput) => {
  await getAffixById(id);
  const updated = await db.affix.update({
    where: { id },
    data,
  });
  return await getAffixById(updated.id);
};
export const deleteAffix = async (id: string) => {
  await getAffixById(id);

  // Check if being used
  const itemModsCount = await db.itemMod.count({
    where: { affixId: id },
  });

  if (itemModsCount > 0) {
    throw new Error(
      `Cannot delete affix that is being used by ${itemModsCount} items`
    );
  }

  const legendaryModsCount = await db.legendaryTemplateMod.count({
    where: { affixId: id },
  });

  if (legendaryModsCount > 0) {
    throw new Error(
      `Cannot delete affix that is being used by ${legendaryModsCount} legendary templates`
    );
  }

  await db.affix.delete({
    where: { id },
  });

  return { message: 'Affix deleted successfully' };
};
export const getAvailableAffixes = async (
  itemBaseKey: string,
  itemLevel: number,
  type: 'PREFIX' | 'SUFFIX'
) => {
  // Get item base
  const itemBase = await db.itemBase.findUnique({
    where: { key: itemBaseKey },
  });

  if (!itemBase) {
    throw new Error('Item base not found');
  }

  // Get affixes
  const affixes = await db.affix.findMany({
    where: {
      type,
      minItemLevel: { lte: itemLevel },
      OR: [{ maxItemLevel: null }, { maxItemLevel: { gte: itemLevel } }],
      stats: {
        some: {
          rollTables: {
            some: {
              category: itemBase.category,
            },
          },
        },
      },
    },
    include: {
      stats: {
        include: {
          statDef: true,
          rollTables: {
            where: {
              category: itemBase.category,
            },
          },
        },
      },
    },
    orderBy: [{ tier: 'desc' }, { tierlevel: 'asc' }, { name: 'asc' }],
  });

  return affixes;
};

export const bulkCreateAffixes = async (affixes: CreateAffixInput[]) => {
  const results = [];
  const errors = [];

  for (const affixData of affixes) {
    try {
      const affix = await createAffixService(affixData);
      results.push(affix);
    } catch (error: any) {
      errors.push({
        key: affixData.key,
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
