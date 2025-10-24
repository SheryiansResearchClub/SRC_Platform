import type { ProjectDocument, ProjectType } from '@/types';
import { projectRepo } from '@/repositories/project.repository';
import { taskRepo } from '@/repositories/task.repository';
import { activityLogRepo } from '@/repositories/activity-log.repository';
import { InternalServerError, NotFoundError } from '@/utils/errors';

interface ProjectQuery {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

class ProjectService {
  async createProject(projectData: Partial<ProjectType>, userId: string): Promise<ProjectDocument> {
    try {
      const project = await projectRepo.create(projectData);

      if (projectData.createdBy) {
        await this.assignMembers(project._id.toString(), [{ user: projectData.createdBy.toString(), role: 'owner' }], false);
      }

      await activityLogRepo.create({
        user: userId,
        action: 'project_created',
        entityType: 'Project',
        entityId: project._id.toString(),
        metadata: { projectTitle: project.title, assignedTo: "owner" }
      });

      return project;
    } catch (error) {
      throw new InternalServerError('PROJECT_CREATE_FAILED');
    }
  }

  async getProjects(query: ProjectQuery) {
    try {
      const { projects, totalCount } = await projectRepo.findAll({
        page: query.page || 1,
        limit: query.limit || 20,
        status: query.status,
        type: query.type,
        search: query.search,
        sortBy: query.sortBy || 'createdAt',
        sortOrder: query.sortOrder || 'desc'
      });

      const totalPages = Math.ceil(totalCount / (query.limit || 20));
      const currentPage = query.page || 1;
      const pagination: PaginationResult = {
        currentPage,
        totalPages,
        totalCount,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      };

      return {
        projects,
        pagination
      };
    } catch (error) {
      throw new InternalServerError('PROJECTS_FETCH_FAILED');
    }
  }

  async getProjectById(projectId: string): Promise<ProjectDocument | null> {
    try {
      return await projectRepo.findById(projectId);
    } catch (error) {
      throw new InternalServerError('PROJECT_FETCH_FAILED');
    }
  }

  async updateProject(projectId: string, updateData: Partial<ProjectType>, userId: string): Promise<ProjectDocument | null> {
    try {
      const project = await projectRepo.update(projectId, updateData);

      if (updateData.status && project) {
        await activityLogRepo.create({
          user: userId,
          action: 'project_updated',
          entityType: 'Project',
          entityId: projectId,
          metadata: { status: updateData.status }
        });
      }

      return project;
    } catch (error) {
      throw new InternalServerError('PROJECT_UPDATE_FAILED');
    }
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    try {
      await projectRepo.delete(projectId);

      await activityLogRepo.create({
        user: userId,
        action: 'project_deleted',
        entityType: 'Project',
        entityId: projectId,
        metadata: { projectId }
      })

    } catch (error) {
      throw new InternalServerError('PROJECT_DELETE_FAILED');
    }
  }

  async assignMembers(
    projectId: string,
    members: { user: string; role?: string }[],
    flag: boolean = true
  ): Promise<ProjectDocument | null> {
    try {
      const project = await projectRepo.assignMembers(projectId, members);

      if (flag) {
        for (const m of members) {
          await activityLogRepo.create({
            user: m.user,
            action: "member_assigned",
            entityType: "Project",
            entityId: projectId,
            metadata: { role: m.role || "member" },
          });
        }
      }

      return project;
    } catch (error) {
      console.error("MEMBER_ASSIGN_FAILED:", error);
      throw new InternalServerError("MEMBER_ASSIGN_FAILED");
    }
  }

  async removeMember(projectId: string, userId: string): Promise<ProjectDocument | null> {
    try {
      const project = await projectRepo.removeMember(projectId, userId);

      await activityLogRepo.create({
        user: userId,
        action: 'member_removed',
        entityType: 'Project',
        entityId: projectId,
        metadata: { projectId }
      });

      return project;
    } catch (error) {
      throw new InternalServerError('MEMBER_REMOVE_FAILED');
    }
  }

  async getProjectProgress(projectId: string) {
    try {
      const [project, tasks] = await Promise.all([
        projectRepo.findById(projectId),
        taskRepo.findByProject(projectId)
      ]);

      if (!project) {
        throw new NotFoundError('PROJECT_NOT_FOUND');
      }

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
      const inProgressTasks = tasks.filter((task: any) => task.status === 'in-progress').length;
      const todoTasks = tasks.filter((task: any) => task.status === 'todo').length;

      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progressPercentage,
        projectStats: project.stats
      };
    } catch (error) {
      throw new InternalServerError('PROGRESS_FETCH_FAILED');
    }
  }

  async updateProjectStatus(projectId: string, status: string, userId: string): Promise<ProjectDocument | null> {
    try {
      const updateData: Partial<ProjectType> = {
        status: status as any,
        actualEndDate: status === 'completed' ? new Date() : undefined
      };

      return await this.updateProject(projectId, updateData, userId);
    } catch (error) {
      throw new InternalServerError('STATUS_UPDATE_FAILED');
    }
  }

  async getProjectMilestones(projectId: string) {
    try {
      const project = await projectRepo.findById(projectId);

      if (!project) {
        throw new NotFoundError('PROJECT_NOT_FOUND');
      }

      return project.milestones || [];
    } catch (error) {
      throw new InternalServerError('MILESTONES_FETCH_FAILED');
    }
  }

  async createMilestone(projectId: string, milestoneData: any, userId: string) {
    try {
      const project = await projectRepo.addMilestone(projectId, milestoneData);

      await activityLogRepo.create({
        user: userId,
        action: 'milestone_created',
        entityType: 'Project',
        entityId: projectId,
        metadata: { milestoneTitle: milestoneData.title }
      });

      if (project) {
        return project.milestones?.[project.milestones.length - 1];
      }

      return {};
    } catch (error) {
      throw new InternalServerError('MILESTONE_CREATE_FAILED');
    }
  }

  async updateMilestone(projectId: string, milestoneId: string, updateData: any, userId: string) {
    try {
      const project = await projectRepo.updateMilestone(projectId, milestoneId, updateData);

      await activityLogRepo.create({
        user: userId,
        action: 'milestone_updated',
        entityType: 'Project',
        entityId: projectId,
        metadata: { milestoneId }
      });

      if (project) {
        return project.milestones?.find((m: any) => m._id?.toString() === milestoneId);
      }

      return {};
    } catch (error) {
      throw new InternalServerError('MILESTONE_UPDATE_FAILED');
    }
  }

  async deleteMilestone(projectId: string, milestoneId: string, userId: string): Promise<void> {
    try {
      await projectRepo.deleteMilestone(projectId, milestoneId);

      await activityLogRepo.create({
        user: userId,
        action: 'milestone_deleted',
        entityType: 'Project',
        entityId: projectId,
        metadata: { milestoneId }
      });
    } catch (error) {
      throw new InternalServerError('MILESTONE_DELETE_FAILED');
    }
  }
}

export const projectService = new ProjectService();
