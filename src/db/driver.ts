import {SQLFile} from "../input/fileReader";

export interface DatabaseDriver {
    establishMigrationDatabase(sqlFlies: SQLFile[]): Promise<void>
    migrationTransaction(sqlFiles: SQLFile[]): Promise<void>
    closeConnection(): Promise<void>
}