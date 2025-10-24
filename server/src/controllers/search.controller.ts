import type { Request, Response } from '@/types';
import { ErrorLog } from '@/utils/logger';
import { sendError, sendSuccess } from '@/utils/response';
import { searchService } from '@/services/search.service';
import { AppError } from '@/utils/errors';

const handleError = (res: Response, error: unknown, code: string, message: string) => {
  ErrorLog(error as Error);
  if (error instanceof AppError) {
    return sendError(res, error.code, error.message, error.statusCode, error.details);
  }
  return sendError(res, code, message);
};

// GET /search/projects - Search projects
const searchProjects = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.searchProjects(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.projects,
      pagination: result.pagination,
      message: 'Projects search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'PROJECTS_SEARCH_FAILED', error.message || 'Unable to search projects');
  }
};

// GET /search/members - Search members
const searchMembers = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.searchMembers(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.users,
      pagination: result.pagination,
      message: 'Members search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'MEMBERS_SEARCH_FAILED', error.message || 'Unable to search members');
  }
};

// GET /search/files - Search files
const searchFiles = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.searchFiles(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.files,
      pagination: result.pagination,
      message: 'Files search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'FILES_SEARCH_FAILED', error.message || 'Unable to search files');
  }
};

// GET /search/comments - Search comments
const searchComments = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.searchComments(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.comments,
      pagination: result.pagination,
      message: 'Comments search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'COMMENTS_SEARCH_FAILED', error.message || 'Unable to search comments');
  }
};

// GET /search/resources - Search resources
const searchResources = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.searchResources(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.resources,
      pagination: result.pagination,
      message: 'Resources search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'RESOURCES_SEARCH_FAILED', error.message || 'Unable to search resources');
  }
};

// GET /search/global - Global search across all entities
const globalSearch = async (req: Request, res: Response) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query) {
      return sendError(res, 'SEARCH_QUERY_REQUIRED', 'Search query is required', 400);
    }

    const result = await searchService.globalSearch(
      query as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, {
      results: result.results,
      pagination: result.pagination,
      message: 'Global search completed successfully',
    });
  } catch (error: any) {
    return handleError(res, error, 'GLOBAL_SEARCH_FAILED', error.message || 'Unable to perform global search');
  }
};

export default {
  searchProjects,
  searchMembers,
  searchFiles,
  searchComments,
  searchResources,
  globalSearch,
};
