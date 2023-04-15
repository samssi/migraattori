import postgres from "postgres";
import {SQLFile} from "../../input/fileReader";
import {DatabaseDriver, defaultMigrationSchemaName, migrationHistoryTableName} from "../driver";
import * as log from "../../output/log"

const username = "migraattori"

export const sql = postgres({
    host: "192.168.1.100",
    port: 5432,
    database: "test",
    username,
    password: "migraattori"
})

const migrationTablesPresent = async (schemaName: string, tableName: string) => {
    interface Result {
        exists: boolean
    }

    const [result] = await sql<[Result?]>`SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = ${ schemaName }
        AND table_name   = ${ tableName }
    )`
    if (!result) {
        throw new Error("Couldn't access migraattori schema/tables...")
    }

    return result.exists
}

const insertHistory = async (schemaName: string, sqlFile: SQLFile) => {
    await sql`INSERT INTO migraattori.migration_history 
              (migration_user, migration_file, migration_status, version)
              VALUES (${username}, ${sqlFile.file}, 'done', ${sqlFile.version})
    `
}

const executeMigrationSqlFiles = async (sql: postgres.TransactionSql<Record<string, postgres.PostgresType>>, sqlFiles: SQLFile[]) => {
    for (const sqlFile of sqlFiles) {
        await sql.unsafe(sqlFile.content)
    }
}

const executeSqlFiles = async (sql: postgres.TransactionSql<Record<string, postgres.PostgresType>>, migrationSchemaName: string, sqlFiles: SQLFile[]) => {
    for (const sqlFile of sqlFiles) {
        await insertHistory(migrationSchemaName, sqlFile)
        await sql.unsafe(sqlFile.content)
    }
}

export const postgresJs: DatabaseDriver = {
    async establishMigrationDatabase(sqlFiles: SQLFile[]): Promise<void> {
        const continueMigrations = await migrationTablesPresent(defaultMigrationSchemaName, migrationHistoryTableName)

        if (continueMigrations) {
            log.debug("Migration tables present. Continuing on with the migrations")
        } else {
            await sql.begin(async sql => {
                log.info("First run of migraattori detected. Establishing migraattori schema and system tables...")
                await executeMigrationSqlFiles(sql, sqlFiles);
            })
        }
    },

    async migrationTransaction(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => {
            log.info("Running migrations")
            await executeSqlFiles(sql, defaultMigrationSchemaName, sqlFiles);
        })
    },
    async closeConnection(): Promise<void> {
        await sql.end()
    }
}