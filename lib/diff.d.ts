import { DiffOptions, DiffResults, SourceList } from "..";

function createDiff<T>(baseList: SourceList<T> | T[], subjectList: SourceList<T> | T[], options?: DiffOptions): DiffResults;
export = createDiff;