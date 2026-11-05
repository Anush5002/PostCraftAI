import { useMutation } from "@tanstack/react-query";
import { api, type GenerateInput, type RefineInput, type EditInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGeneratePost() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateInput) => {
      const validated = api.posts.generate.input.parse(data);
      const res = await fetch(api.posts.generate.path, {
        method: api.posts.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate post");
      }

      const parsed = await res.json();

      // FIRE AND FORGET HISTORY SAVE
      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/history/save", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            type: "generate",
            inputText: data.topic,
            outputs: parsed.variations.map((v: any) => typeof v === 'string' ? { text: v } : { content: v.content, text: v.content, imageUrl: v.imageUrl })
          })
        }).catch(err => console.error("History save error:", err));
      }

      return parsed as {
        variations: any[];
        tone: string;
        originalPrompt: string;
        images?: string[];
      };
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRefinePost() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: RefineInput) => {
      const validated = api.posts.refine.input.parse(data);
      const res = await fetch(api.posts.refine.path, {
        method: api.posts.refine.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to refine post");
      }
      const parsed = await res.json();

      const token = localStorage.getItem("token");
      if (token && parsed.variations) {
        fetch("/api/history/save", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            type: "improve",
            inputText: data.draft,
            outputs: parsed.variations.map((v: any) => typeof v === 'string' ? { text: v } : { content: v.content, text: v.content, imageUrl: v.imageUrl })
          })
        }).catch(err => console.error("History save error:", err));
      }

      return parsed as {
        content: string;
        suggestions?: string;
        variations?: any[];
        images?: string[];
      };
    },
    onError: (error: Error) => {
      toast({
        title: "Refinement Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useEditPost() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: EditInput) => {
      const validated = api.posts.edit.input.parse(data);
      const res = await fetch(api.posts.edit.path, {
        method: api.posts.edit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to edit post");
      }
      return res.json() as Promise<{
        content: string;
      }>;
    },
    onError: (error: Error) => {
      toast({
        title: "Edit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGenerateImages() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { topic: string; isImprovement?: boolean }) => {
      const validated = api.posts.images.input.parse(data);
      const res = await fetch(api.posts.images.path, {
        method: api.posts.images.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to generate images");
      }
      return res.json() as Promise<{
        images: string[];
      }>;
    },
    onError: (error: Error) => {
      toast({
        title: "Image Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
