import { Op } from 'sequelize'

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const generateUniqueSlug = async (
  baseSlug: string,
  model: any,
  existingId?: number
): Promise<string> => {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const where: any = { slug }
    if (existingId) where.id = { [Op.ne]: existingId }

    const existing = await model.findOne({ where })
    if (!existing) return slug

    slug = `${baseSlug}-${counter}`
    counter++
  }
}
