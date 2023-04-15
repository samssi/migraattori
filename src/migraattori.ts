import {sql} from "./db/postgresDb";
import {readSqlFiles, SQLFile} from "./input/fileReader";

const migrationTransaction = async (sqlFiles: SQLFile[]) => {
    await sql.begin(async sql => {
        for (const sqlFile of sqlFiles) {
            await sql.unsafe(sqlFile.content)
        }
    })
}



const main = async () => {
    console.log("Migraattori starting...")
    const sqlFiles = await readSqlFiles("sql")
    await migrationTransaction(sqlFiles)
    await sql.end()
    console.log("Migraattori executed successfully...")
}

(async function() {
    await main();
}());