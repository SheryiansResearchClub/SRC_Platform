// import { User, Project, Task, Comment, File, Resource } from '@/models';
// import { AppError } from '@/utils/errors';

// interface SearchResult {
//   _id: string;
//   title: string;
//   description?: string;
//   type: string;
//   url: string;
//   relevance: number;
// }

// interface SearchResults {
//   results: SearchResult[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalCount: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   };
// }

// class SearchService {
//   async searchProjects(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       const [projects, totalCount] = await Promise.all([
//         Project.find({
//           $or: [
//             { title: searchRegex },
//             { description: searchRegex },
//             { technologies: searchRegex },
//             { tags: searchRegex }
//           ]
//         })
//           .populate('createdBy', 'name email')
//           .select('title description status priority technologies tags createdBy')
//           .sort({ createdAt: -1 })
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .exec(),
//         Project.countDocuments({
//           $or: [
//             { title: searchRegex },
//             { description: searchRegex },
//             { technologies: searchRegex },
//             { tags: searchRegex }
//           ]
//         })
//       ]);

//       const results: SearchResult[] = projects.map(project => ({
//         _id: project._id,
//         title: project.title,
//         description: project.description,
//         type: 'project',
//         url: `/projects/${project._id}`,
//         relevance: this.calculateRelevance(query, project.title, project.description)
//       }));

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         results,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('PROJECTS_SEARCH_FAILED', 'Failed to search projects', 500);
//     }
//   }

//   async searchMembers(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       const [users, totalCount] = await Promise.all([
//         User.find({
//           $or: [
//             { name: searchRegex },
//             { email: searchRegex },
//             { bio: searchRegex },
//             { skills: searchRegex }
//           ]
//         })
//           .select('name email avatarUrl bio skills')
//           .sort({ name: 1 })
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .exec(),
//         User.countDocuments({
//           $or: [
//             { name: searchRegex },
//             { email: searchRegex },
//             { bio: searchRegex },
//             { skills: searchRegex }
//           ]
//         })
//       ]);

//       const results: SearchResult[] = users.map(user => ({
//         _id: user._id,
//         title: user.name,
//         description: user.bio || user.email,
//         type: 'member',
//         url: `/users/${user._id}`,
//         relevance: this.calculateRelevance(query, user.name, user.bio)
//       }));

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         results,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('MEMBERS_SEARCH_FAILED', 'Failed to search members', 500);
//     }
//   }

//   async searchFiles(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       const [files, totalCount] = await Promise.all([
//         File.find({
//           $or: [
//             { filename: searchRegex },
//             { originalName: searchRegex }
//           ]
//         })
//           .populate('uploadedBy', 'name email')
//           .populate('project', 'title')
//           .select('filename originalName mimeType size uploadedBy project')
//           .sort({ createdAt: -1 })
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .exec(),
//         File.countDocuments({
//           $or: [
//             { filename: searchRegex },
//             { originalName: searchRegex }
//           ]
//         })
//       ]);

//       const results: SearchResult[] = files.map(file => ({
//         _id: file._id,
//         title: file.originalName,
//         description: `${file.mimeType} • ${(file.size / 1024).toFixed(1)} KB`,
//         type: 'file',
//         url: `/files/${file._id}`,
//         relevance: this.calculateRelevance(query, file.originalName, file.filename)
//       }));

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         results,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('FILES_SEARCH_FAILED', 'Failed to search files', 500);
//     }
//   }

//   async searchComments(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       const [comments, totalCount] = await Promise.all([
//         Comment.find({
//           content: searchRegex,
//           status: { $ne: 'rejected' }
//         })
//           .populate('author', 'name email')
//           .populate('project', 'title')
//           .populate('task', 'title')
//           .select('content author project task createdAt')
//           .sort({ createdAt: -1 })
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .exec(),
//         Comment.countDocuments({
//           content: searchRegex,
//           status: { $ne: 'rejected' }
//         })
//       ]);

//       const results: SearchResult[] = comments.map(comment => ({
//         _id: comment._id,
//         title: `Comment by ${(comment as any).author?.name || 'Unknown'}`,
//         description: comment.content.substring(0, 150) + (comment.content.length > 150 ? '...' : ''),
//         type: 'comment',
//         url: `/${(comment as any).project ? 'projects' : 'tasks'}/${(comment as any).project?._id || (comment as any).task?._id}#comment-${comment._id}`,
//         relevance: this.calculateRelevance(query, comment.content)
//       }));

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         results,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('COMMENTS_SEARCH_FAILED', 'Failed to search comments', 500);
//     }
//   }

//   async searchResources(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       const [resources, totalCount] = await Promise.all([
//         Resource.find({
//           $or: [
//             { title: searchRegex },
//             { description: searchRegex },
//             { content: searchRegex },
//             { tags: searchRegex }
//           ]
//         })
//           .populate('uploadedBy', 'name email')
//           .select('title description type category tags uploadedBy')
//           .sort({ createdAt: -1 })
//           .skip((page - 1) * limit)
//           .limit(limit)
//           .exec(),
//         Resource.countDocuments({
//           $or: [
//             { title: searchRegex },
//             { description: searchRegex },
//             { content: searchRegex },
//             { tags: searchRegex }
//           ]
//         })
//       ]);

//       const results: SearchResult[] = resources.map(resource => ({
//         _id: resource._id,
//         title: resource.title,
//         description: resource.description,
//         type: 'resource',
//         url: `/resources/${resource._id}`,
//         relevance: this.calculateRelevance(query, resource.title, resource.description)
//       }));

//       const totalPages = Math.ceil(totalCount / limit);
//       const pagination = {
//         currentPage: page,
//         totalPages,
//         totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       };

//       return {
//         results,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('RESOURCES_SEARCH_FAILED', 'Failed to search resources', 500);
//     }
//   }

//   async globalSearch(query: string, page: number, limit: number): Promise<SearchResults> {
//     try {
//       const searchRegex = new RegExp(query, 'i');

//       // Search across all collections concurrently
//       const [projectResults, userResults, fileResults, commentResults, resourceResults] = await Promise.all([
//         this.searchProjects(query, 1, 5),
//         this.searchMembers(query, 1, 5),
//         this.searchFiles(query, 1, 5),
//         this.searchComments(query, 1, 5),
//         this.searchResources(query, 1, 5)
//       ]);

//       // Combine and sort by relevance
//       const allResults = [
//         ...projectResults.results,
//         ...userResults.results,
//         ...fileResults.results,
//         ...commentResults.results,
//         ...resourceResults.results
//       ].sort((a, b) => b.relevance - a.relevance);

//       // Apply pagination
//       const startIndex = (page - 1) * limit;
//       const endIndex = startIndex + limit;
//       const paginatedResults = allResults.slice(startIndex, endIndex);

//       const pagination = {
//         currentPage: page,
//         totalPages: Math.ceil(allResults.length / limit),
//         totalCount: allResults.length,
//         hasNext: endIndex < allResults.length,
//         hasPrev: page > 1
//       };

//       return {
//         results: paginatedResults,
//         pagination
//       };
//     } catch (error) {
//       throw new AppError('GLOBAL_SEARCH_FAILED', 'Failed to perform global search', 500);
//     }
//   }

//   private calculateRelevance(query: string, title?: string, description?: string): number {
//     let relevance = 0;
//     const queryLower = query.toLowerCase();
//     const titleLower = title?.toLowerCase() || '';
//     const descLower = description?.toLowerCase() || '';

//     // Exact match in title gets highest score
//     if (titleLower.includes(queryLower)) {
//       relevance += 10;
//       if (titleLower.startsWith(queryLower)) {
//         relevance += 5;
//       }
//     }

//     // Match in description gets medium score
//     if (descLower.includes(queryLower)) {
//       relevance += 5;
//     }

//     // Word matches get lower score
//     const queryWords = queryLower.split(' ');
//     queryWords.forEach(word => {
//       if (titleLower.includes(word)) relevance += 2;
//       if (descLower.includes(word)) relevance += 1;
//     });

//     return relevance;
//   }
// }

// export const searchService = new SearchService();
