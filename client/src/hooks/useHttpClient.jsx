import { useCallback, useMemo } from 'react'

import axiosInstance from '@/config/axios'

const normalizeRequestConfig = (pathOrConfig = {}, config = {}) => {
  if (typeof pathOrConfig === 'string') {
    return {
      url: pathOrConfig,
      method: config?.method ?? 'GET',
      ...config,
    }
  }

  return {
    method: pathOrConfig.method ?? 'GET',
    ...pathOrConfig,
  }
}

const requestWithAxios = async (pathOrConfig, config) => {
  const requestConfig = normalizeRequestConfig(pathOrConfig, config)
  const response = await axiosInstance.request(requestConfig)
  return response.data
}

const buildHttpHelpers = (requestFn) => ({
  request: requestFn,
  get: (url, config) => requestFn(url, { ...config, method: 'GET' }),
  post: (url, data, config) => requestFn(url, { data, ...config, method: 'POST' }),
  put: (url, data, config) => requestFn(url, { data, ...config, method: 'PUT' }),
  patch: (url, data, config) => requestFn(url, { data, ...config, method: 'PATCH' }),
  delete: (url, config) => requestFn(url, { ...config, method: 'DELETE' }),
})

export const httpClient = (pathOrConfig, config) => requestWithAxios(pathOrConfig, config)

export const http = buildHttpHelpers(httpClient)

export const useHttpClient = () => {
  const request = useCallback((pathOrConfig, config) => {
    return requestWithAxios(pathOrConfig, config)
  }, [])

  return useMemo(() => buildHttpHelpers(request), [request])
}

export default useHttpClient