import {postgresJs, sql} from "./db/driver/postgresJs";
import {readSqlFiles, SQLFile} from "./input/fileReader";
import {DatabaseDriver} from "./db/driver";

const runMigrations = async (driver: DatabaseDriver) => {
    const migrationFiles = await readSqlFiles("sql")
    const establishmentFiles = await readSqlFiles("base/sql/postgres")
    await driver.establishMigrationDatabase(establishmentFiles)
    await driver.migrationTransaction(migrationFiles)
    await driver.closeConnection()
}

const main = async () => {
    console.log("Migraattori starting...")
    await runMigrations(postgresJs)
    console.log("Migraattori executed successfully...")
}

(async function() {
    await main();
}());