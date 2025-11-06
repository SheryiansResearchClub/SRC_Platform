import { Schema, model, models, InferSchemaType, Require_id, type Model } from "mongoose";

const WorkLink = new Schema(
  { link: { type: String, trim: true, required: true }, work: { type: String, trim: true, required: true } },
  { _id: false }
);

const Years = new Schema(
  { text: { type: String, trim: true, required: true }, approxYears: { type: Number, min: 0, max: 80 } },
  { _id: false }
);

const MustSee = new Schema(
  { url: { type: String, trim: true, required: true }, isPublic: { type: Boolean, required: true } },
  { _id: false }
);

const ApplicationSchema = new Schema(
  {
    preflightConfirm: { type: Boolean, default: false },
    fullname: { type: String, trim: true, required: true, maxlength: 200, index: true },
    email: { type: String, trim: true, lowercase: true, required: true, unique: true, index: true },
    phone: { type: String, trim: true, required: true, index: true },

    // "City, Country" is what your form collects. We'll denormalize `country` for filtering.
    city: { type: String, trim: true, required: true, index: true },
    country: { type: String, trim: true, default: "", index: true },

    phase: { type: String, trim: true, index: true },
    howhear: { type: String, trim: true },
    worklinks: { type: [WorkLink], default: [] },

    // denormalized for speedy sort/filter
    worklinksCount: { type: Number, default: 0, index: true },

    primary: { type: String, trim: true, index: true },
    strongSuit: { type: String, trim: true },
    skilllevel: { type: Number, min: 0, max: 10, index: true },

    years: { type: Years },
    // denormalize numeric for filter/sort
    approxYears: { type: Number, min: 0, max: 80, index: true },

    artifact: {
      filename: String,
      mimetype: String,
      size: Number,
      url: String,
      path: String,
    },

    defineProject: { type: String, trim: true },
    complex: { type: String, trim: true },
    learn: { type: String, trim: true },
    research: { type: String, trim: true },
    drive: { type: String, trim: true },
    weakness: { type: String, trim: true },
    lifeStory: { type: String, trim: true },
    xFactor: { type: String, trim: true },
    dreamProject: { type: String, trim: true },
    otherRoles: { type: String, trim: true },

    videoLink: { type: String, trim: true },
    videoNote: { type: String, trim: true },

    privateTest: { type: String, trim: true },
    compete: { type: String, trim: true },
    hate: { type: String, trim: true },
    inspire: { type: String, trim: true },

    languages: { type: [String], default: [], index: true }, // multikey index
    tools: { type: [String], default: [], index: true },     // multikey index
    stack: { type: String, trim: true },
    concept: { type: String, trim: true },

    mustSee: { type: [MustSee], default: [] },

    role: { type: String, trim: true, default: "none", index: true },
  },
  { timestamps: true }
);

// Maintain denormalized fields
ApplicationSchema.pre("save", function (next) {
  this.worklinksCount = Array.isArray(this.worklinks) ? this.worklinks.length : 0;

  if (typeof this.city === "string" && !this.country) {
    const parts = this.city.split(",").map(s => s.trim());
    this.country = parts.length > 1 ? parts[parts.length - 1] : "";
  }

  if (this.years && typeof this.years.approxYears === "number") {
    this.approxYears = this.years.approxYears;
  }
  next();
});

// helpful compound indexes for common list views
ApplicationSchema.index({ createdAt: -1 });
ApplicationSchema.index({ phase: 1, primary: 1, skilllevel: -1 });
ApplicationSchema.index({ approxYears: -1, worklinksCount: -1 });

type ApplicationSchemaType = InferSchemaType<typeof ApplicationSchema>;
export type ApplicationDoc = Require_id<ApplicationSchemaType> & { __v?: number };

export const Application =
  (models.Application as Model<ApplicationSchemaType>) ||
  model<ApplicationSchemaType>("Application", ApplicationSchema);
