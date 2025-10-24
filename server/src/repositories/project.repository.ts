import type { ProjectDocument } from '@/types';
import { Project } from '@/models/project.model';

interface ProjectQuery {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ProjectRepository {
  async create(projectData: Partial<ProjectDocument>): Promise<ProjectDocument> {
    const project = new Project(projectData);
    return await project.save();
  }

  // have to improve thie one search is not working by technologies and tags
  async findAll(query: ProjectQuery): Promise<{ projects: ProjectDocument[]; totalCount: number }> {
    const { page = 1, limit = 20, status, type, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    let filter: any = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$text = { $search: search };
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [projects, totalCount] = await Promise.all([
      Project.find(filter)
        .populate('createdBy', 'name email avatarUrl')
        .populate('members.user', 'name email avatarUrl')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      Project.countDocuments(filter)
    ]);

    return { projects, totalCount };
  }

  async findById(projectId: string): Promise<ProjectDocument | null> {
    return await Project.findById(projectId)
      .populate('createdBy', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl')
      .exec();
  }

  async update(projectId: string, updateData: any): Promise<ProjectDocument | null> {
    return await Project.findByIdAndUpdate(projectId, updateData, { new: true })
      .populate('createdBy', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl')
      .exec();
  }

  async delete(projectId: string): Promise<ProjectDocument | null> {
    return await Project.findByIdAndDelete(projectId);
  }

  async assignMembers(
    projectId: string,
    members: { user: string; role?: string }[]
  ): Promise<ProjectDocument | null> {
    const membersToAdd = members.map(m => ({
      user: m.user,
      role: m.role || "member",
      joinedAt: new Date(),
    }));

    return await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { members: { $each: membersToAdd } },
        $inc: { "stats.memberCount": membersToAdd.length },
      },
      { new: true }
    )
      .populate("createdBy", "name email avatarUrl")
      .populate("members.user", "name email avatarUrl")
      .exec();
  }

  async removeMember(projectId: string, userId: string): Promise<ProjectDocument | null> {
    return await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { members: { user: userId } },
        $inc: { 'stats.memberCount': -1 }
      },
      { new: true }
    )
      .populate('createdBy', 'name email avatarUrl')
      .populate('members.user', 'name email avatarUrl')
      .exec();
  }

  async addMilestone(projectId: string, milestoneData: any): Promise<ProjectDocument | null> {
    return await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { milestones: milestoneData }
      },
      { new: true }
    ).exec();
  }

  async updateMilestone(projectId: string, milestoneId: string, updateData: any): Promise<ProjectDocument | null> {
    return await Project.findOneAndUpdate(
      { _id: projectId, 'milestones._id': milestoneId },
      {
        $set: {
          'milestones.$.title': updateData.title,
          'milestones.$.description': updateData.description,
          'milestones.$.dueDate': updateData.dueDate,
          'milestones.$.completed': updateData.completed,
          'milestones.$.completedAt': updateData.completed ? new Date() : undefined,
          'milestones.$.completedBy': updateData.completedBy
        }
      },
      { new: true }
    ).exec();
  }

  async deleteMilestone(projectId: string, milestoneId: string): Promise<void> {
    await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: { milestones: { _id: milestoneId } }
      }
    );
  }

  async findByUserId(userId: string): Promise<ProjectDocument[]> {
    return await Project.find({
      'members.user': userId
    })
      .populate('members.user', 'name email avatarUrl')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async countByUserId(userId: string): Promise<number> {
    return await Project.countDocuments({
      'members.user': userId
    });
  }
}

export const projectRepo = new ProjectRepository();