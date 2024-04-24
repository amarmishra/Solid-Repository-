export type IResponseAccumulator={
    primaryContatctId: number | null,
    emails: string[],
    phoneNumbers: string[],
    secondaryContactIds: number[]
}

export type IResponse={
    contact: IResponseAccumulator
}