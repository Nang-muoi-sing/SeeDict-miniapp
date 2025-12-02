import request from "@/api/request";

export const search = (params) => request.get('/api/v1/search/', { params })
