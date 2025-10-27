import swaggerJSDoc from 'swagger-jsdoc';
import { appConfig } from '@/config/app.config';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'SRC Platform API',
    version: '1.0.0',
    description: 'API documentation for the SRC Platform backend service.',
    contact: {
      name: 'SRC Platform Team'
    }
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port}/api/${appConfig.apiVersion}`,
      description: 'Local server'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints'
    },
    {
      name: 'Users',
      description: 'User management endpoints'
    },
    {
      name: 'Projects',
      description: 'Project lifecycle and collaboration endpoints'
    },
    {
      name: 'Tasks',
      description: 'Task management endpoints'
    },
    {
      name: 'Tags',
      description: 'Tag catalog and taxonomy endpoints'
    },
    {
      name: 'Notifications',
      description: 'User notifications and alerts endpoints'
    },
    {
      name: 'Messages',
      description: 'Direct messaging endpoints'
    },
    {
      name: 'Gamification',
      description: 'Points, badges, and leaderboard endpoints'
    },
    {
      name: 'Comments',
      description: 'Content comment moderation endpoints'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide the JWT access token obtained after login.'
      }
    },
    schemas: {
      ApiMessageResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'object',
            additionalProperties: true
          },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'ERROR_CODE' },
              message: { type: 'string', example: 'Something went wrong' },
              details: { type: 'object', additionalProperties: true }
            }
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 20 },
              total: { type: 'integer', example: 100 },
              hasMore: { type: 'boolean', example: false }
            }
          }
        }
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT access token',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          },
          refreshToken: {
            type: 'string',
            description: 'Refresh token',
            example: 'def502009a4c0f...'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '64f1c2b7e2a4f4f5c9a12345'
          },
          name: {
            type: 'string',
            example: 'Jane Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com'
          },
          role: {
            type: 'string',
            enum: ['member', 'moderator', 'admin'],
            example: 'member'
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://cdn.example.com/avatars/jane.png'
          },
          bio: {
            type: 'string',
            nullable: true,
            example: 'Software engineer passionate about open source.'
          },
          skills: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['Node.js', 'React']
          },
          isEmailVerified: {
            type: 'boolean',
            example: true
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-02-01T12:00:00.000Z'
          }
        }
      },
      PaginatedUsers: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  users: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 47 },
                      totalPages: { type: 'integer', example: 5 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      UserResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' },
                  message: {
                    type: 'string',
                    example: 'Operation completed successfully'
                  }
                }
              }
            }
          }
        ]
      },
      AuthLoginResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/User' },
                  tokens: { $ref: '#/components/schemas/AuthTokens' },
                  message: {
                    type: 'string',
                    example: 'Login successful'
                  }
                }
              }
            }
          }
        ]
      },
      AuthRegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Jane Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com'
          },
          password: {
            type: 'string',
            minLength: 8,
            example: 'Str0ngPass!'
          }
        }
      },
      AuthLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com'
          },
          password: {
            type: 'string',
            example: 'Str0ngPass!'
          }
        }
      },
      AuthForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com'
          }
        }
      },
      AuthResetPasswordRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: {
            type: 'string',
            example: 'reset-token-value'
          },
          password: {
            type: 'string',
            example: 'NewStr0ngPass!'
          }
        }
      },
      AuthVerifyEmailRequest: {
        type: 'object',
        required: ['token'],
        properties: {
          token: {
            type: 'string',
            example: 'email-verify-token'
          }
        }
      },
      AuthRefreshTokenRequest: {
        type: 'object',
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Optional refresh token if not stored in cookies.',
            example: 'def502009a4c0f...'
          }
        }
      },
      UserCreateRequest: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            example: 'Jane Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'Secure123'
          },
          role: {
            type: 'string',
            enum: ['member', 'moderator', 'admin'],
            example: 'member'
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://cdn.example.com/avatar.png'
          },
          bio: {
            type: 'string',
            nullable: true,
            example: 'Community moderator'
          },
          skills: {
            type: 'array',
            items: { type: 'string' },
            example: ['JavaScript', 'UI/UX']
          }
        }
      },
      UserUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['member', 'moderator', 'admin'] },
          status: { type: 'string', example: 'active' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
          bio: { type: 'string', nullable: true },
          skills: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      UserProfileUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
          bio: { type: 'string', nullable: true },
          skills: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      UserPasswordUpdateRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: {
            type: 'string',
            example: 'CurrentPass1'
          },
          newPassword: {
            type: 'string',
            example: 'NewPass2!'
          }
        }
      },
      UserRoleUpdateRequest: {
        type: 'object',
        required: ['role'],
        properties: {
          role: {
            type: 'string',
            enum: ['member', 'moderator', 'admin'],
            example: 'moderator'
          }
        }
      },
      Project: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          title: { type: 'string', example: 'Next Gen Platform' },
          description: { type: 'string', example: 'A collaborative platform for SRC' },
          type: { type: 'string', enum: ['Web', 'AI', 'Electronics', 'Other'], example: 'Web' },
          status: { type: 'string', enum: ['ongoing', 'completed', 'paused', 'archived'], example: 'ongoing' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high' },
          createdBy: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          members: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: { type: 'string', example: '64f1c2b7e2a4f4f5c9a67890' },
                role: { type: 'string', enum: ['member', 'maintainer', 'owner'], example: 'maintainer' },
                joinedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          milestones: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a55555' },
                title: { type: 'string', example: 'MVP Release' },
                description: { type: 'string', example: 'Ship the first MVP' },
                dueDate: { type: 'string', format: 'date-time' },
                completed: { type: 'boolean', example: false },
                completedAt: { type: 'string', format: 'date-time', nullable: true },
                completedBy: { type: 'string', nullable: true }
              }
            }
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['collaboration', 'education']
          },
          technologies: {
            type: 'array',
            items: { type: 'string' },
            example: ['Node.js', 'React']
          },
          stats: {
            type: 'object',
            properties: {
              progress: { type: 'number', example: 45 },
              taskCount: { type: 'integer', example: 20 },
              completedTaskCount: { type: 'integer', example: 9 },
              overdueTaskCount: { type: 'integer', example: 1 },
              memberCount: { type: 'integer', example: 5 },
              lastActivityAt: { type: 'string', format: 'date-time' }
            }
          },
          startDate: { type: 'string', format: 'date-time', nullable: true },
          expectedEndDate: { type: 'string', format: 'date-time', nullable: true },
          actualEndDate: { type: 'string', format: 'date-time', nullable: true },
          featured: { type: 'boolean', example: false },
          archived: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ProjectCreateRequest: {
        type: 'object',
        required: ['title', 'type'],
        properties: {
          title: { type: 'string', example: 'Next Gen Platform' },
          description: { type: 'string', example: 'A collaborative platform for SRC' },
          type: { type: 'string', enum: ['Web', 'AI', 'Electronics', 'Other'], example: 'Web' },
          status: { type: 'string', enum: ['ongoing', 'completed', 'paused', 'archived'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          startDate: { type: 'string', format: 'date' },
          expectedEndDate: { type: 'string', format: 'date' },
          tags: { type: 'array', items: { type: 'string' } },
          technologies: { type: 'array', items: { type: 'string' } }
        }
      },
      ProjectUpdateRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['Web', 'AI', 'Electronics', 'Other'] },
          status: { type: 'string', enum: ['ongoing', 'completed', 'paused', 'archived'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          startDate: { type: 'string', format: 'date', nullable: true },
          expectedEndDate: { type: 'string', format: 'date', nullable: true },
          actualEndDate: { type: 'string', format: 'date', nullable: true },
          tags: { type: 'array', items: { type: 'string' } },
          technologies: { type: 'array', items: { type: 'string' } }
        }
      },
      ProjectAssignMembersRequest: {
        type: 'object',
        required: ['memberIds'],
        properties: {
          memberIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['64f1c2b7e2a4f4f5c9a12345', '64f1c2b7e2a4f4f5c9a67890']
          }
        }
      },
      ProjectStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['ongoing', 'completed', 'paused', 'archived'],
            example: 'completed'
          }
        }
      },
      ProjectMilestoneCreateRequest: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Design Handoff' },
          description: { type: 'string', example: 'Share designs with engineering' },
          dueDate: { type: 'string', format: 'date' }
        }
      },
      ProjectMilestoneUpdateRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', format: 'date' },
          completed: { type: 'boolean' }
        }
      },
      ProjectResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  project: { $ref: '#/components/schemas/Project' },
                  message: {
                    type: 'string',
                    example: 'Project operation successful'
                  }
                }
              }
            }
          }
        ]
      },
      ProjectListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  projects: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Project' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 30 },
                      totalPages: { type: 'integer', example: 3 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a24680' },
          title: { type: 'string', example: 'Implement authentication' },
          description: { type: 'string', example: 'Add JWT login flow' },
          project: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          assignee: { type: 'string', nullable: true, example: '64f1c2b7e2a4f4f5c9a12345' },
          reporter: { type: 'string', example: '64f1c2b7e2a4f4f5c9a54321' },
          status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'], example: 'in_progress' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high' },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          tags: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TaskCreateRequest: {
        type: 'object',
        required: ['title', 'project'],
        properties: {
          title: { type: 'string', example: 'Implement authentication' },
          description: { type: 'string', example: 'Add JWT login flow' },
          project: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          assignee: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          reporter: { type: 'string', example: '64f1c2b7e2a4f4f5c9a54321' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'medium' },
          status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'], example: 'todo' },
          dueDate: { type: 'string', format: 'date' }
        }
      },
      TaskUpdateRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          assignee: { type: 'string', nullable: true },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'] },
          dueDate: { type: 'string', format: 'date', nullable: true },
          tags: { type: 'array', items: { type: 'string' } }
        }
      },
      TaskAssignRequest: {
        type: 'object',
        required: ['assigneeId'],
        properties: {
          assigneeId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' }
        }
      },
      TaskStatusUpdateRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'], example: 'review' }
        }
      },
      TaskPriorityUpdateRequest: {
        type: 'object',
        required: ['priority'],
        properties: {
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'critical' }
        }
      },
      TaskResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  task: { $ref: '#/components/schemas/Task' },
                  message: {
                    type: 'string',
                    example: 'Task operation successful'
                  }
                }
              }
            }
          }
        ]
      },
      TaskListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  tasks: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Task' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 58 },
                      totalPages: { type: 'integer', example: 3 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      Tag: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9aabcde' },
          name: { type: 'string', example: 'Open Source' },
          slug: { type: 'string', example: 'open-source' },
          description: { type: 'string', example: 'Resources related to open source contributions' },
          type: { type: 'string', enum: ['project', 'task', 'resource', 'general'], example: 'project' },
          color: { type: 'string', example: '#6B7280' },
          usageCount: { type: 'integer', example: 12 },
          createdBy: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      TagCreateRequest: {
        type: 'object',
        required: ['name', 'slug', 'color'],
        properties: {
          name: { type: 'string', example: 'Open Source' },
          slug: { type: 'string', example: 'open-source' },
          description: { type: 'string', example: 'Resources related to open source contributions' },
          type: { type: 'string', enum: ['project', 'task', 'resource', 'general'] },
          color: { type: 'string', example: '#6B7280' }
        }
      },
      TagUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['project', 'task', 'resource', 'general'] },
          color: { type: 'string' }
        }
      },
      TagResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  tag: { $ref: '#/components/schemas/Tag' },
                  message: { type: 'string', example: 'Tag operation successful' }
                }
              }
            }
          }
        ]
      },
      TagListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  tags: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Tag' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 45 },
                      totalPages: { type: 'integer', example: 5 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      TagProjectTypeResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  tags: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Tag' }
                  },
                  message: { type: 'string', example: 'Project type tags retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          user: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          type: {
            type: 'string',
            enum: ['task', 'comment', 'project', 'system', 'event', 'mention', 'deadline'],
            example: 'task'
          },
          title: { type: 'string', example: 'Task assigned to you' },
          message: { type: 'string', example: 'You have been assigned to task ABC-123' },
          payload: { type: 'object', additionalProperties: true },
          read: { type: 'boolean', example: false },
          readAt: { type: 'string', format: 'date-time', nullable: true },
          deliveredAt: { type: 'string', format: 'date-time', nullable: true },
          channel: { type: 'string', enum: ['in-app', 'email', 'push'], example: 'in-app' },
          actionUrl: { type: 'string', nullable: true },
          actionText: { type: 'string', nullable: true },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      NotificationCreateRequest: {
        type: 'object',
        required: ['user', 'type', 'title', 'message'],
        properties: {
          user: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          type: {
            type: 'string',
            enum: ['task', 'comment', 'project', 'system', 'event', 'mention', 'deadline']
          },
          title: { type: 'string', example: 'Task assigned to you' },
          message: { type: 'string', example: 'You have been assigned to task ABC-123' },
          payload: { type: 'object', additionalProperties: true },
          channel: { type: 'string', enum: ['in-app', 'email', 'push'] },
          actionUrl: { type: 'string' },
          actionText: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          expiresAt: { type: 'string', format: 'date-time' }
        }
      },
      NotificationResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  notification: { $ref: '#/components/schemas/Notification' },
                  message: { type: 'string', example: 'Notification operation successful' }
                }
              }
            }
          }
        ]
      },
      NotificationListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  notifications: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 100 },
                      totalPages: { type: 'integer', example: 5 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      NotificationUnreadCountResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  count: { type: 'integer', example: 3 },
                  message: { type: 'string', example: 'Unread notification count retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      Message: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a90123' },
          sender: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          recipient: { type: 'string', nullable: true, example: '64f1c2b7e2a4f4f5c9a67890' },
          project: { type: 'string', nullable: true, example: '64f1c2b7e2a4f4f5c9a98765' },
          conversationId: { type: 'string', example: 'conv-123' },
          content: { type: 'string', example: 'Hey, can we review the PR?' },
          type: { type: 'string', enum: ['text', 'system', 'file'], example: 'text' },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string', example: 'https://cdn.example.com/files/design.pdf' },
                storageKey: { type: 'string', example: 'files/design.pdf' },
                mimeType: { type: 'string', example: 'application/pdf' },
                filename: { type: 'string', example: 'design.pdf' },
                size: { type: 'integer', example: 234567 }
              }
            }
          },
          readBy: {
            type: 'array',
            items: { type: 'string' }
          },
          deletedFor: {
            type: 'array',
            items: { type: 'string' }
          },
          replyTo: { type: 'string', nullable: true },
          edited: { type: 'boolean', example: false },
          editedAt: { type: 'string', format: 'date-time', nullable: true },
          isRead: { type: 'boolean', example: false },
          readAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      MessageCreateRequest: {
        type: 'object',
        required: ['sender', 'content'],
        properties: {
          sender: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          recipient: { type: 'string', example: '64f1c2b7e2a4f4f5c9a67890' },
          project: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          conversationId: { type: 'string', example: 'conv-123' },
          content: { type: 'string', example: 'Hey, can we review the PR?' },
          type: { type: 'string', enum: ['text', 'system', 'file'] },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                storageKey: { type: 'string' },
                mimeType: { type: 'string' },
                filename: { type: 'string' },
                size: { type: 'integer' }
              }
            }
          }
        }
      },
      MessageUpdateRequest: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          attachments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                storageKey: { type: 'string' },
                mimeType: { type: 'string' },
                filename: { type: 'string' },
                size: { type: 'integer' }
              }
            }
          }
        }
      },
      MessageResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  message: { $ref: '#/components/schemas/Message' },
                  info: { type: 'string', example: 'Message operation successful' }
                }
              }
            }
          }
        ]
      },
      MessageListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  messages: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Message' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 50 },
                      total: { type: 'integer', example: 200 },
                      totalPages: { type: 'integer', example: 4 }
                    }
                  }
                }
              }
            }
          }
        ]
      },
      GamificationPointsResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
                  totalPoints: { type: 'integer', example: 1250 },
                  breakdown: {
                    type: 'object',
                    additionalProperties: { type: 'integer' }
                  },
                  message: { type: 'string', example: 'Points retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      GamificationLeaderboardEntry: {
        type: 'object',
        properties: {
          userId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a67890' },
          name: { type: 'string', example: 'Jane Doe' },
          avatarUrl: { type: 'string', nullable: true },
          totalPoints: { type: 'integer', example: 980 },
          rank: { type: 'integer', example: 3 }
        }
      },
      GamificationLeaderboardResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  leaderboard: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/GamificationLeaderboardEntry' }
                  },
                  message: { type: 'string', example: 'Leaderboard retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      GamificationBadge: {
        type: 'object',
        properties: {
          badgeId: { type: 'string', example: 'mentor-badge' },
          name: { type: 'string', example: 'Mentor' },
          description: { type: 'string', example: 'Awarded for guiding 5 new members' },
          iconUrl: { type: 'string', nullable: true },
          awardedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      },
      GamificationBadgeListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  badges: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/GamificationBadge' }
                  },
                  message: { type: 'string', example: 'Badges retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      GamificationAwardPointsRequest: {
        type: 'object',
        required: ['userId', 'points', 'reason'],
        properties: {
          userId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          points: { type: 'integer', example: 50 },
          reason: { type: 'string', example: 'Completed onboarding tasks' },
          metadata: { type: 'object', additionalProperties: true }
        }
      },
      GamificationAwardBadgeRequest: {
        type: 'object',
        required: ['badgeId'],
        properties: {
          badgeId: { type: 'string', example: 'mentor-badge' },
          reason: { type: 'string', example: 'Recognized for mentorship contribution' },
          metadata: { type: 'object', additionalProperties: true }
        }
      },
      GamificationAchievementsResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
                  achievements: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'first-project' },
                        name: { type: 'string', example: 'First Project' },
                        description: { type: 'string', example: 'Completed your first project' },
                        unlockedAt: { type: 'string', format: 'date-time' }
                      }
                    }
                  },
                  message: { type: 'string', example: 'Achievements retrieved successfully' }
                }
              }
            }
          }
        ]
      },
      Comment: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1c2b7e2a4f4f5c9a55555' },
          content: { type: 'string', example: 'Great work on this feature!' },
          author: { type: 'string', example: '64f1c2b7e2a4f4f5c9a12345' },
          entityType: { type: 'string', example: 'project' },
          entityId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending' },
          rejectionReason: { type: 'string', nullable: true },
          likes: { type: 'integer', example: 4 },
          repliesCount: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CommentCreateRequest: {
        type: 'object',
        required: ['content', 'entityType', 'entityId'],
        properties: {
          content: { type: 'string', example: 'Great work on this feature!' },
          entityType: { type: 'string', enum: ['project', 'task', 'resource'], example: 'project' },
          entityId: { type: 'string', example: '64f1c2b7e2a4f4f5c9a98765' },
          parentId: { type: 'string', nullable: true },
          metadata: { type: 'object', additionalProperties: true }
        }
      },
      CommentUpdateRequest: {
        type: 'object',
        properties: {
          content: { type: 'string' }
        }
      },
      CommentModerationRequest: {
        type: 'object',
        properties: {
          reason: { type: 'string', example: 'Inappropriate language' }
        }
      },
      CommentResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  comment: { $ref: '#/components/schemas/Comment' },
                  message: { type: 'string', example: 'Comment operation successful' }
                }
              }
            }
          }
        ]
      },
      CommentListResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiMessageResponse' },
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  comments: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Comment' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 20 },
                      total: { type: 'integer', example: 120 },
                      totalPages: { type: 'integer', example: 6 }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    'src/routes/**/*.ts',
    'src/controllers/**/*.ts',
    'src/models/**/*.ts',
    'src/docs/**/*.yaml'
  ]
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
};
