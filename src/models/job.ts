/**
 * Represents a job with its details.
 */
export class Job {
  /** The process ID of the job. */
  pid!: string;

  /** A description of the job. */
  jobDescription!: string;

  /** The start time of the job in HH:MM:SS format. */
  startTime!: string;

  /** The end time of the job in HH:MM:SS format. */
  endTime?: string

  /** The duration of the job in seconds. */  
  duration?: number;
}