export interface Post {
    id: string;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PostDto {
    id: string;
    name: string;
}

export interface PostHistoryDto {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}