import postgres from "postgres";
import {SQLFile} from "../../input/fileReader";
import {DatabaseDriver} from "../driver";

export const sql = postgres({
    host: "192.168.1.100",
    port: 5432,
    database: "test",
    username: "migraattori",
    password: "migraattori"
})

export const postgresJs: DatabaseDriver = {
    async migrationTransaction(sqlFiles: SQLFile[]): Promise<void> {
        await sql.begin(async sql => {
            for (const sqlFile of sqlFiles) {
                await sql.unsafe(sqlFile.content)
            }
        })
        await sql.end()
    },
    async closeConnection(): Promise<void> {
        await sql.end()
    }
}