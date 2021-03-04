import { DiffResults } from "..";

export function saveReport(filePath: string, title: string, results: DiffResults): void;
export function saveResults(filePath: string, results: DiffResults, type = "json" | "js", jsPrefix?: string): void;