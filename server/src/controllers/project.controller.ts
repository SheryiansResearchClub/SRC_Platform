import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { projectService } from '@/services/project.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user!._id,
    };

    const project = await projectService.createProject(projectData, projectData.createdBy.toString());

    return sendSuccess(res, {
      project,
      message: 'Project created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_CREATE_FAILED', error.message || 'Unable to create project');
  }
};

const getProjects = async (req: Request, res: Response) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      search: req.query.search as string | undefined,
      type: req.query.type as string | undefined,
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      startDate: req.query.startDate as string | undefined,
      expectedEndDate: req.query.expectedEndDate as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await projectService.getProjects(query);

    return sendSuccess(res, {
      projects: result.projects,
      pagination: result.pagination,
      message: 'Projects retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECTS_FETCH_FAILED', error.message || 'Unable to fetch projects');
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);

    if (!project) {
      return sendError(res, 'PROJECT_NOT_FOUND', 'Project not found', 404);
    }

    return sendSuccess(res, {
      project,
      message: 'Project retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_FETCH_FAILED', error.message || 'Unable to fetch project');
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await projectService.updateProject(id, updateData, req.user!._id.toString());

    if (!project) {
      return sendError(res, 'PROJECT_NOT_FOUND', 'Project not found', 404);
    }

    return sendSuccess(res, {
      project,
      message: 'Project updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_UPDATE_FAILED', error.message || 'Unable to update project');
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await projectService.deleteProject(id, req.user!._id.toString());

    return sendSuccess(res, {
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECT_DELETE_FAILED', error.message || 'Unable to delete project');
  }
};

const assignMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    const project = await projectService.assignMembers(id, members);

    return sendSuccess(res, {
      project,
      message: 'Members assigned successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MEMBER_ASSIGN_FAILED', error.message || 'Unable to assign members');
  }
};

const removeMember = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const project = await projectService.removeMember(id, userId);

    return sendSuccess(res, {
      project,
      message: 'Member removed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MEMBER_REMOVE_FAILED', error.message || 'Unable to remove member');
  }
};

const getProjectProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const progress = await projectService.getProjectProgress(id);

    return sendSuccess(res, {
      progress,
      message: 'Project progress retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROGRESS_FETCH_FAILED', error.message || 'Unable to fetch project progress');
  }
};

const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const project = await projectService.updateProjectStatus(id, status, req.user!._id.toString());

    return sendSuccess(res, {
      project,
      message: 'Project status updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'STATUS_UPDATE_FAILED', error.message || 'Unable to update project status');
  }
};

const getProjectMilestones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const milestones = await projectService.getProjectMilestones(id);

    return sendSuccess(res, {
      milestones,
      message: 'Project milestones retrieved successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MILESTONES_FETCH_FAILED', error.message || 'Unable to fetch milestones');
  }
};

const createMilestone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const milestoneData = req.body;

    const milestone = await projectService.createMilestone(id, milestoneData, req.user!._id.toString());

    return sendSuccess(res, {
      milestone,
      message: 'Milestone created successfully',
    }, 201);
  } catch (error: any) {
    return handleError(res, error, 'MILESTONE_CREATE_FAILED', error.message || 'Unable to create milestone');
  }
};

const updateMilestone = async (req: Request, res: Response) => {
  try {
    const { id, milestoneId } = req.params;
    const updateData = req.body;

    const milestone = await projectService.updateMilestone(id, milestoneId, updateData, req.user!._id.toString());

    return sendSuccess(res, {
      milestone,
      message: 'Milestone updated successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MILESTONE_UPDATE_FAILED', error.message || 'Unable to update milestone');
  }
};

const deleteMilestone = async (req: Request, res: Response) => {
  try {
    const { id, milestoneId } = req.params;

    await projectService.deleteMilestone(id, milestoneId, req.user!._id.toString());

    return sendSuccess(res, {
      message: 'Milestone deleted successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MILESTONE_DELETE_FAILED', error.message || 'Unable to delete milestone');
  }
};

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignMembers,
  removeMember,
  getProjectProgress,
  updateProjectStatus,
  getProjectMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
