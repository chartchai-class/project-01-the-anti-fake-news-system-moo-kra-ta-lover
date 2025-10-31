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
    user: CommentUser
    vote: "Fake" | "Real"
    comment: string
    imageUrls?: string[]
}

export interface NewsState {
    news: News | null
}

export interface User {
    id: number
    firstname: string
    lastname: string
    email: string
    image: string
    roles: string[]
}

export interface MessageState {
    message: string
}

export interface CommentUser {
    id: number
    firstname: string
    lastname: string
}
