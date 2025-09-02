import fs from "fs";
import path from "path";

const inputFile = path.join(__dirname, "files/input.txt");
const logFile = path.join(__dirname, "files/output.txt");

/**
 * Generates a report of job executions based on their durations and completion status.
 */
function GenerateReport(){
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading log file:", err);
            return;
        }

        console.log(data);
    });
}


GenerateReport();