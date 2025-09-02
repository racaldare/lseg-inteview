import fs from "fs";
import path from "path";
import { JobAction } from "./enums";
import { Job } from "./models";

const inputFile = path.join(__dirname, "files/input.txt");
const logFile = path.join(__dirname, "files/output.txt");

/** Converts a time string in "HH:MM:SS" format to total seconds.
 * @param time - The time string to convert.
 * @returns The total number of seconds.
 */
export function timeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Parses log data to extract job information and store it in a map.
 * @param data - The raw log data as a string.
 * @returns A map of job PIDs to Job objects.
 */
export function parseJobs(data: string): Map<string, Job> {
        let jobs: Map<string, Job> = new Map();
        
        const lines = data.split("\n").map(s => s.trim());

        lines.forEach(line => {
            let sections = line.split(",").map(s => s.trim());

            if (sections.length !== 4) {
                console.error("Malformed log entry:", line);
                return;
            }

            let [ entryTime, jobDescription, action, pid ] = sections;
            
            if(action === JobAction.Start){
                let job = new Job();
                job.pid = pid;
                job.jobDescription = jobDescription;
                job.startTime = entryTime;
                jobs.set(pid, job);
            }

            else if(action === JobAction.End){
                let job = jobs.get(pid);

                if(!job){
                    console.error("End action without a start for PID:", pid);
                    return;
                }

                job.endTime = entryTime;
                job.duration = timeToSeconds(job.endTime) - timeToSeconds(job.startTime);
            } 
            
            console.error("Unknown action:", action);
            return;
            
        });

        return jobs;
}

/**
 * Generates a report of job executions based on their durations and completion status.
 */
export function GenerateReport(){
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading log file:", err);
            return;
        }

        let jobs = parseJobs(data);
        console.log("Job Report:");

        jobs.forEach((job, pid) => {
            if (job.duration !== undefined) {
                console.log(`Job PID: ${pid}, Description: ${job.jobDescription}, Duration: ${job.duration} seconds`);
            } else {
                console.log(`Job PID: ${pid}, Description: ${job.jobDescription}, Status: Incomplete`);
            }
        });
    });
}


GenerateReport();