import { api } from "@/api/request";

export const search = (params) => api.get(`/api/v1/search/?${params}`, {})
