export type ApiResponse = {
    url: string
    date: Date
    plugged: boolean
    statusCode: number
    fstrzFlags: string[]
    cloudfrontStatus: string
    cloudfrontPOP: string
}

export type ResultData = {
    apiResponse: ApiResponse
    date: Date
    url: string
}

