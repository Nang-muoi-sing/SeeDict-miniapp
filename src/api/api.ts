import { api } from "@/api/request";

export const search = (params) => api.get(`/api/v1/search/?${params}`, {})

export const searchWord = (params) => api.get(`/api/v1/word/?${params}`, {})

export const searchAudio = (params) => api.get(`/api/v1/audio/?${params}`, {})
