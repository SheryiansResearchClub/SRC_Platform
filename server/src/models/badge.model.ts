import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose'

const BadgeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png' // fallback icon
    },
    pointsRequired: {
      type: Number,
      default: 0,
      min: 0
    },
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze'
    }
  },
  {
    timestamps: true
  }
)

BadgeSchema.index({ name: 1, level: 1 })

type BadgeType = InferSchemaType<typeof BadgeSchema>
type BadgeDocument = HydratedDocument<BadgeType>

export { BadgeDocument, BadgeType }
export const Badge = model<BadgeType>('Badge', BadgeSchema)