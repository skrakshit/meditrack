"use server";

import {
  generateLabReport,
  type GenerateLabReportInput,
  type GenerateLabReportOutput,
} from "@/ai/flows/generate-lab-report";

export async function runGenerateLabReport(
  input: GenerateLabReportInput
): Promise<GenerateLabReportOutput> {
  try {
    const output = await generateLabReport(input);
    return output;
  } catch (error) {
    console.error("Error in Generate Lab Report Flow:", error);
    throw new Error("Failed to generate lab report.");
  }
}
