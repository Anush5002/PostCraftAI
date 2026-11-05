import { z } from 'zod';
import { posts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts' as const,
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect>()),
      },
    },
    generate: {
      method: 'POST' as const,
      path: '/api/posts/generate' as const,
      input: z.object({
        topic: z.string(),
        tone: z.string(),
      }),
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    refine: {
      method: 'POST' as const,
      path: '/api/posts/refine' as const,
      input: z.object({
        draft: z.string(),
      }),
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    edit: {
      method: 'POST' as const,
      path: '/api/posts/edit' as const,
      input: z.object({
        originalContent: z.string(),
        instructions: z.string(),
        provider: z.string(), // Added provider flag
      }),
      responses: {
        201: z.object({
          content: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    images: {
      method: 'POST' as const,
      path: '/api/posts/images/retry' as const,
      input: z.object({
        topic: z.string(),
        isImprovement: z.boolean().optional(),
      }),
      responses: {
        201: z.object({
          images: z.array(z.string()),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  auth: {
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup' as const,
      input: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
      responses: {
        201: z.object({ token: z.string(), user: z.any() }),
        400: errorSchemas.validation,
      }
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ token: z.string(), user: z.any() }),
        400: errorSchemas.validation,
        401: errorSchemas.validation,
      }
    }
  },
  history: {
    save: {
      method: 'POST' as const,
      path: '/api/history/save' as const,
      input: z.object({
        type: z.string(),
        inputText: z.string(),
        outputs: z.array(z.object({ content: z.string().optional(), text: z.string().optional(), image: z.string().optional(), imageUrl: z.string().optional() })),
      }),
      responses: { 201: z.any(), 401: errorSchemas.validation }
    },
    list: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: { 200: z.array(z.any()), 401: errorSchemas.validation }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PostResponse = z.infer<typeof api.posts.list.responses[200]>[0];
export type GenerateInput = z.infer<typeof api.posts.generate.input>;
export type RefineInput = z.infer<typeof api.posts.refine.input>;
export type EditInput = z.infer<typeof api.posts.edit.input>;
export type GenerateImagesInput = z.infer<typeof api.posts.images.input>;
export type SignupInput = z.infer<typeof api.auth.signup.input>;
export type LoginInput = z.infer<typeof api.auth.login.input>;
export type SaveHistoryInput = z.infer<typeof api.history.save.input>;
