export interface News{
    id: number
    topic: string
    shortDetail: string
    fullDetail: string
    reporter: string
    reportDate: string
    imageUrl: []
    comments: Comment[]
}

export interface Comment {
    id: number
    user: string
    vote: "Fake" | "Real"
    comment: string
    imageUrl: string[]
}