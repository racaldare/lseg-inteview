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
export function TimeToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

/** Parses log data to extract job information and store it in a map.
 * @param data - The raw log data as a string.
 * @returns A map of job PIDs to Job objects.
 */
export function ParseJobs(data: string): Map<string, Job> {
        let jobs: Map<string, Job> = new Map();
        
        const lines = data.split("\n").map(s => s.trim());

        lines.forEach(line => {
            if(line === "") return; // Skip empty lines

            let sections = line.split(",").map(s => s.trim());

            if (sections.length !== 4) {
                console.error("Malformed log entry:", line);
                return;
            }

            let [ entryTime, jobDescription, action, pid ] = sections;
            
            // Create Job when action is Start
            if(action === JobAction.Start){
                let job = new Job();
                job.pid = pid;
                job.jobDescription = jobDescription;
                job.startTime = entryTime;
                jobs.set(pid, job);
                return;
            }

            // Update Job when action is End
            else if(action === JobAction.End){
                let job = jobs.get(pid);

                if(!job){
                    console.error("End action without a start for PID:", pid);
                    return;
                }

                job.endTime = entryTime;
                job.duration = TimeToSeconds(job.endTime) - TimeToSeconds(job.startTime);
                return;
            } 
            
            // Handle unknown actions
            console.error("Unknown action:", action);
            return;
            
        });

        return jobs;
}

/** Validates job executions and generates messages based on their status and duration.
 * @param jobs - A map of job PIDs to Job objects.
 * @returns An array of messages regarding job execution status.
 */
export function ValidateJobExecutions(jobs: Map<string, Job>): string[] {
    return Array.from(jobs.values()).map((job: Job) => {
    if(!job.endTime || !job.duration ){
        // Unclear functional requirement - this scenario could either mean the job failed or is still running.
        // Assuming it means the job still running for this implementation.
        // Because current time is not provided (system time can be in the past or future from logs)
        // we cannot determine if job running over 5 or 10 minutes.
        // Usually, I would check with PO here.
    } else if (job.duration > 600){
        return `Job "${job.jobDescription}" with PID ${job.pid} took longer than 10 minutes.`;
    } else if (job.duration > 300){
        return `Job "${job.jobDescription}" with PID ${job.pid} took longer than 5 minutes.`;
    }

        return "";
    });
}

/** Writes the given content to the log file.
 * @param content - The content to write to the file.
 */
export function WriteToFile(content: string){
    fs.writeFile(logFile, content, (err) => {
        if (err) {
            console.error("Error writing to log file:", err);
            return;
        }
        console.log("Report written successfully");
    });
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

        let jobs = ParseJobs(data);
        let report = ValidateJobExecutions(jobs).filter(msg => msg !== "").join("\n");

        WriteToFile(report);
    });
}

GenerateReport();