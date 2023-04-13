import {sql} from "./db/postgresDb";
import {readSqlFiles} from "./input/fileReader";


const main = async () => {
    console.log("Migraattori starting...")
    await readSqlFiles("sql")
}

(async function() {
    await main();
}());