export interface Office {
    id: string;
    name: string;
    address: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OfficeDto {
    id: string;
    name: string;
    address: string;
}

export interface OfficeHistoryDto {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
