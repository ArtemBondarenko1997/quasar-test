import { api } from 'boot/axios'

import { Response } from '../models/Response'
import { Request } from '../models/Request'

const getHistorical = async (params?:Request):Promise<Response> => {
    const response = await api.get<Response>('/historical', {
        params
    })
    return response.data
}

export const getCurremcyList = async ():Promise<Array<string>> => {
    const LSlist:string | null = localStorage.getItem('list')
    if(LSlist) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return JSON.parse(LSlist)
    }
    const historicalNow:Response = await getHistorical()
    const list:Array<string> = Object.keys(Object.values(historicalNow.data)[0])
    localStorage.setItem('list', JSON.stringify(list))
    return list
}

export const getData = async (params:Request) => {
    const historicalByDates:Response = await getHistorical(params)
    const entries = Object.entries(historicalByDates.data)
    const formatedAray:Array<{ date: string, value: number }> = entries.map(([date, resultObj]):{ date: string, value: number } => ({
        value: resultObj.USD, date
    }))
    const datesObject = formatedAray.reduce((result, { date, value }) => ({ ...result, [date]: value }), {})
    return { name: params.base_currency, ...datesObject }
}
