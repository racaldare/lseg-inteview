import { ParseJobs, TimeToSeconds } from "../index";

// Mock dependencies except ParseJobs
jest.mock("fs");
jest.mock("../enums", () => ({
    JobAction: { Start: "Start", End: "End" }
}));
jest.mock("../models", () => ({
    Job: jest.fn()
}));

jest.mock("../index", () => {
    const originalModule = jest.requireActual("../index");
    return {
        ...originalModule,
        ValidateJobExecutions: jest.fn(),
        WriteToFile: jest.fn(),
        GenerateReport: jest.fn()
    };
});

describe("ParseJobs", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("parses valid start and end job entries correctly", () => {
        const logData = [
            "08:00:00,Job A,Start,123",
            "08:15:00,Job A,End,123"
        ].join("\n");

        const jobs = ParseJobs(logData);

        expect(jobs.size).toBe(1);
        const job = jobs.get("123");
        expect(job).toBeDefined();
        expect(job?.jobDescription).toBe("Job A");
        expect(job?.startTime).toBe("08:00:00");
        expect(job?.endTime).toBe("08:15:00");
        expect(job?.duration).toBe(TimeToSeconds("08:15:00") - TimeToSeconds("08:00:00"));
    });

    it("skips malformed log entries and logs an error", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const logData = [
            "08:00:00,Job A,Start",        // missing PID
            "08:05:00,Job B,End,456"       // end without start
        ].join("\n");

        const jobs = ParseJobs(logData);

        expect(jobs.size).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith("Malformed log entry:", "08:00:00,Job A,Start");
        expect(consoleSpy).toHaveBeenCalledWith("End action without a start for PID:", "456");

        consoleSpy.mockRestore();
    });

    it("logs unknown actions", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const logData = [
            "08:00:00,Job X,PAUSE,999"
        ].join("\n");

        const jobs = ParseJobs(logData);

        expect(jobs.size).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith("Unknown action:", "PAUSE");

        consoleSpy.mockRestore();
    });

    it("skips empty lines", () => {
        const logData = [
            "08:00:00,Job A,Start,123",
            "",
            "08:05:00,Job A,End,123"
        ].join("\n");

        const jobs = ParseJobs(logData);

        expect(jobs.size).toBe(1);
        const job = jobs.get("123");
        expect(job?.startTime).toBe("08:00:00");
        expect(job?.endTime).toBe("08:05:00");
    });
});