import { OfficeDto } from "./office-dtos";
import { PostDto } from "./post-dtos";

export interface WorkerDto {
    surname: string;
    firstname: string;
    patronymic: string;
}

export interface WorkerOfficeDto {
    workerId: string;
    officeId: string;
}

export interface WorkerPostDto {
    workerId: string;
    PostId: string;
}

export interface WorkerWithDetailsDto {
    id: string;
    name: string;
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