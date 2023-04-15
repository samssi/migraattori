import {SQLFile} from "../input/fileReader";

export const defaultMigrationSchemaName = 'migraattori'
export const migrationHistoryTableName = 'migration_history'

export interface DatabaseDriver {
    establishMigrationDatabase(sqlFlies: SQLFile[]): Promise<void>
    migrationTransaction(sqlFiles: SQLFile[]): Promise<void>
    closeConnection(): Promise<void>
}