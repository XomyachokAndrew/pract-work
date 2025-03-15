import { OfficeDto } from "./office-dtos";
import { PostDto } from "./post-dtos";

export interface WorkerDto {
    id?: string;
    surname: string;
    firstName: string;
    patronymic: string;
}

export interface WorkerOfficeDto {
    workerId: string;
    officeId: string;
}

export interface WorkerPostDto {
    workerId: string;
    postId: string;
}

export interface WorkerWithDetailsDto {
    id: string;
    name: WorkerDto;
    post?: PostDto;
    office?: OfficeDto;
}

export interface WorkerWithOfficeDto {
    id: string;
    name: string;
    office?: OfficeDto;
}

export interface WorkerWithPostDto {
    id: string;
    name: string;
    post?: PostDto;
}