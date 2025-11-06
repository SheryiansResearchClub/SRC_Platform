import { FilterQuery, ProjectionType } from "mongoose";
import { Application, type ApplicationDoc } from "../models/application.model";


//notes, status, score, 
export interface GetOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  projection?: ProjectionType<ApplicationDoc>;
}

class ApplicationRepository {
  async create(applicationData: Partial<ApplicationDoc>): Promise<ApplicationDoc> {
    const application = await Application.create(applicationData);
    return application.toObject();
  }

  async get(
    filter: FilterQuery<ApplicationDoc>,
    options: GetOptions = {}
  ): Promise<{ items: ApplicationDoc[]; total: number; pages: number }> {
    const { page = 1, limit = 20, sort = { createdAt: -1 }, projection = {} } = options;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Application.find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<ApplicationDoc[]>(),
      Application.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);
    return { items, total, pages };
  }

  async update(id: string, updateData: Partial<ApplicationDoc>): Promise<ApplicationDoc | null> {
    return Application.findByIdAndUpdate(id, updateData, { new: true }).lean<ApplicationDoc>();
  }

  async findDuplicate(email?: string, phone?: string): Promise<ApplicationDoc | null> {
    const filter: FilterQuery<ApplicationDoc> = {
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    };
    if (filter.$or.length === 0) return null;
    return Application.findOne(filter).lean<ApplicationDoc>();
  }
}

export const applicationRepo = new ApplicationRepository();
