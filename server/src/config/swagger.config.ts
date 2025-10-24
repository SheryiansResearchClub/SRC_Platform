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
