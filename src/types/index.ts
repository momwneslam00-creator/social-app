// NOTE: response shapes are not documented by the API (Postman examples are empty),
// so entity types are intentionally loose. Tighten them after inspecting real responses.

export interface ApiResponse<T = unknown, M = Record<string, unknown>> {
  success: boolean
  message: string
  data: T
  meta?: M
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: string | string[]
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
  // present in /users/profile-data (not in the signin/signup payload)
  dateOfBirth?: string
  gender?: Gender
  bookmarks?: string[]
  followers?: string[]
  following?: string[]
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  createdAt?: string
  id?: string
}

export interface AuthData {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}

export type Gender = 'male' | 'female'

export interface SignupPayload {
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: Gender
  password: string
  rePassword: string
}

export interface SigninPayload {
  email: string
  password: string
}

export interface ChangePasswordPayload {
  password: string
  newPassword: string
}

export interface PostUser {
  _id: string
  name: string
  username: string
  photo: string
}

export interface Post {
  _id: string
  id: string
  body?: string
  image?: string
  privacy: string
  user: PostUser
  sharedPost: Post | null
  likes: string[]
  likesCount: number
  commentsCount: number
  sharesCount: number
  isShare: boolean
  topComment: unknown | null
  bookmarked: boolean
  createdAt: string
}

export interface FeedData {
  posts: Post[]
}

export type FeedFilter = 'all' | 'following' | 'me'

export interface PostFormPayload {
  body: string
  image?: File | null
}

// NOTE: comment response shape is not confirmed yet (author may be `user` or `commentCreator`).
export interface Comment {
  _id: string
  content?: string
  image?: string
  user?: PostUser
  commentCreator?: PostUser
  likes?: string[]
  likesCount?: number
  repliesCount?: number
  createdAt: string
}

export interface CommentFormPayload {
  content: string
  image?: File | null
}
