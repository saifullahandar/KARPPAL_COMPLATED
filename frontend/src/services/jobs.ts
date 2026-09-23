import apiClient from "./apiClient";
import type { JobApplicationPayload, JobPosting, PaginatedResponse } from "./types";

export const getJobPostings = () =>
    apiClient.get<PaginatedResponse<JobPosting>>("/jobs/postings/", { params: { page_size: 20 } }).then((r) => r.data.results);

export const submitJobApplication = (payload: JobApplicationPayload) =>
    apiClient.post("/jobs/applications/", payload).then((r) => r.data);
