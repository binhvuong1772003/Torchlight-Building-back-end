import { db } from '@/db/prisma';
import { ApiError } from '@/utils/ApiError';
import { CreateItemBaseInput } from '@/validates/item/itemBase.validate';
import { uploadToCloudinary, CLOUDINARY_FOLDERS } from '@/utils/cloudinary';
export const createItemBaseService = async (
  input: CreateItemBaseInput,
  file?: Express.Multer.File
) => {
  const existing = await db.itemBase.findUnique({ where: { key: input.key } });
  if (existing) throw new ApiError(409, 'ItemBase already exists');
  let ImageId = undefined;
  if (file) {
    const result = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.ITEM_BASE);
    const image = await db.image.create({
      data: {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        type: 'ITEM_BASE',
      },
    });
    ImageId = image.id;
  }
  const baseAffix = await db.baseAffix.findMany({
    where: { key: { in: input.baseAffixKeys } },
  });
  if (baseAffix.length !== input.baseAffixKeys.length) {
    throw new ApiError(404, 'Some Base Affix not found');
  }
  const baseAffixId = baseAffix.map((a) => a.id);
  return await db.itemBase.create({
    data: {
      key: input.key,
      name: input.name,
      description: input.description,
      category: input.category,
      imageId: ImageId,
      baseAffixes: {
        create: baseAffixId.map((baseAffixId) => ({ baseAffixId })),
      },
    },
    include: {
      baseAffixes: {
        include: { baseAffix: true },
      },
      image: true,
    },
  });
};
