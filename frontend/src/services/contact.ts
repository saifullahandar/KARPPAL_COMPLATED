import apiClient from "./apiClient";
import type { ContactMessagePayload } from "./types";

export const submitContactMessage = (payload: ContactMessagePayload) =>
    apiClient.post("/contact/messages/", payload).then((r) => r.data);
