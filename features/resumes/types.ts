export type ResumeListItem = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  attachedApplications: Array<{
    id: string;
    company: string;
    role: string;
  }>;
};

export type ResumeApplicationOption = {
  id: string;
  label: string;
};

export type ResumePageData = {
  resumeCount: number;
  resumes: ResumeListItem[];
  applicationOptions: ResumeApplicationOption[];
};
