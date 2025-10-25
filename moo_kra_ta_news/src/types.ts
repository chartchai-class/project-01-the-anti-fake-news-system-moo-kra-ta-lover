export interface News{
    id: number
    topic: string
    shortDetail: string
    fullDetail: string
    reporter: string
    reportDate: string
    imageUrl: string | undefined
    comments: Comment[]
}

export interface Comment {
    id: number
    user: string
    vote: "Fake" | "Real"
    comment: string
    imageUrls?: string[]
}

export interface NewsState {
    news: News | null
}
