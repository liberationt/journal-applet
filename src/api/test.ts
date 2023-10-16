import request from '@/utils/request'

interface IPerson {
  name: string
  age: number
  avatar: string
}
export const getTest = async () => {
  return await request<IPerson[]>({ url: `/saleMarketing/getCommon`, method: 'POST' })
}

export const getError = async () => {
  return await request<IPerson[]>({ url: `/success-message` })
}

export const getFail = async () => {
  return await request<IPerson[]>({ url: `/error` })
}

export const getEmpty = async () => {
  return await request<IPerson[]>({ url: `http://localhost1` })
}
