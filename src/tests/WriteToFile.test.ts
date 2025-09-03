import { WriteToFile } from "../index";
import fs from "fs";

import { jest } from '@jest/globals';

jest.mock("fs");

describe("WriteToFile", () => {
    let mockWriteFile: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockWriteFile = fs.writeFile as unknown as jest.Mock;
    });

    it("should call fs.writeFile with correct arguments", () => {
        const content = "Test content";
        mockWriteFile.mockImplementation((...args: any[]) => {
            const cb = args[2] as (err: Error | null) => void;
            cb(null);
        });
        WriteToFile(content);

        expect(mockWriteFile).toHaveBeenCalled();
        const [filePath, fileContent] = mockWriteFile.mock.calls[0];
        expect(fileContent).toBe(content);
        expect(typeof filePath).toBe("string");
    });



    it("should log error if write fails", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        mockWriteFile.mockImplementation((...args: any[]) => {
            const cb = args[2] as (err: Error | null) => void;
            cb(new Error("fail"));
        });

        WriteToFile("content");
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error writing to log file:",
            expect.any(Error)
        );
        mockWriteFile.mockImplementation((...args: any[]) => {
            const cb = args[2] as (err: Error | null) => void;
            cb(null);
        });
        consoleErrorSpy.mockRestore();
    });

    it("should log success message if write succeeds", () => {
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
        mockWriteFile.mockImplementation((_file, _content, cb) => {
            if (typeof cb === "function") {
                cb(null);
            }
        });

        WriteToFile("content");
        expect(consoleLogSpy).toHaveBeenCalledWith("Report written successfully");
        consoleLogSpy.mockRestore();
    });
});