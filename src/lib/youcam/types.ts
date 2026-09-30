export type YouCamFileUploadResponse = {
  status: number;
  data: {
    files: Array<{
      content_type: string;
      file_name: string;
      file_id: string;
      requests: Array<{
        method: string;
        url: string;
        headers: Record<string, string>;
      }>;
    }>;
  };
};

export type YouCamTaskCreateResponse = {
  status: number;
  data: {
    task_id: string;
  };
};

export type TaskStatus = "running" | "success" | "error";

export type SkinConcernResult = {
  type: string;
  ui_score: number;
  raw_score: number;
  mask_urls: string[];
};

export type SkinAnalysisPollResponse = {
  task_status: TaskStatus;
  results?: {
    output: SkinConcernResult[];
  };
  error?: string | null;
};

export type ClothTryOnPollResponse = {
  task_status: TaskStatus;
  results?: {
    url: string;
  };
  error?: string | null;
};
