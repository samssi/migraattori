import {SQLFile} from "../input/fileReader";

export interface DatabaseDriver {
    migrationTransaction(sqlFiles: SQLFile[]): Promise<void>
    closeConnection(): Promise<void>
}