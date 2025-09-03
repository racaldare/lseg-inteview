import fs from "fs";

// Mock all dependencies except GenerateReport
jest.mock("fs");
jest.mock("../enums", () => ({
    JobAction: { Start: "Start", End: "End" }
}));
jest.mock("../models", () => ({
    Job: jest.fn()
}));

// Import GenerateReport after mocks
import { GenerateReport } from "../index";

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("GenerateReport", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("writes correct report for jobs exceeding 10 minutes", () => {
        const logData = [
            "08:00:00,Job A,Start,123",
            "08:15:00,Job A,End,123"
        ].join("\n");

        mockedFs.readFile.mockImplementation((...args: any[]) => {
            const cb = args[args.length - 1];
            cb(null, logData);
        });

        mockedFs.writeFile.mockImplementation((_file, content, cb) => {
            expect(content).toContain('Job "Job A" with PID 123 took longer than 10 minutes.');
            cb(null);
        });

        GenerateReport();
    });

    it("writes correct report for jobs exceeding 5 minutes but less than 10", () => {
        const logData = [
            "09:00:00,Job B,Start,456",
            "09:06:00,Job B,End,456"
        ].join("\n");

        mockedFs.readFile.mockImplementation((...args: any[]) => {
            const cb = args[args.length - 1];
            cb(null, logData);
        });

        mockedFs.writeFile.mockImplementation((_file, content, cb) => {
            expect(content).toContain('Job "Job B" with PID 456 took longer than 5 minutes.');
            cb(null);
        });

        GenerateReport();
    });

    it("writes empty report for jobs within 5 minutes", () => {
        const logData = [
            "10:00:00,Job C,Start,789",
            "10:04:00,Job C,End,789"
        ].join("\n");

        mockedFs.readFile.mockImplementation((...args: any[]) => {
            const cb = args[args.length - 1];
            cb(null, logData);
        });

        mockedFs.writeFile.mockImplementation((_file, content, cb) => {
            expect(content).toBe("");
            cb(null);
        });

        GenerateReport();
    });

    it("handles readFile error gracefully", () => {
        const error = new Error("Read error");
        mockedFs.readFile.mockImplementation((...args: any[]) => {
            const cb = args[args.length - 1];
            cb(error as any, null);
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        GenerateReport();

        expect(consoleSpy).toHaveBeenCalledWith("Error reading log file:", error);

        consoleSpy.mockRestore();
    });

    it("handles writeFile error gracefully", (done) => {
        const logData = [
            "08:00:00,Job D,Start,321",
            "08:20:00,Job D,End,321"
        ].join("\n");

        mockedFs.readFile.mockImplementation((...args: any[]) => {
            const cb = args[args.length - 1];
            cb(null, logData);
        });

        const writeError = new Error("Disk full");
        mockedFs.writeFile.mockImplementation((_file, _content, cb) => {
            cb(writeError as any);
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        GenerateReport();

        setImmediate(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Error writing to log file:", writeError);
            consoleSpy.mockRestore();
            done();
        });
    });
});