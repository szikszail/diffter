export * as diff from "./lib/diff";
export * as const from "./lib/const";

export { saveReport, saveResults } from "./lib/save";

export type Comparator = <T>(base: T, subject: T) => boolean;
export type Filter = <T>(item: T) => boolean;
export type Transform = <T>(item: T) => DiffListItem;
export type DiffIndexes = number[];

export interface DiffListItem {
    title: string;
    metadata?: any;
}

export interface DiffOptions {
    comparator?: Comparator;
    filter?: Filter;
    transform?: Transform;
}

export interface SourceList<T> {
    items: T[];
    title: string;
}

export interface DiffList {
    items: DiffListItem[];
    title: string;
}

export interface DiffResults {
    baseList: DiffList;
    subjectList: DiffList;
    indexes: DiffIndexes[];
}