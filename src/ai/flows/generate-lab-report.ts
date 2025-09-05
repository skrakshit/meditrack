
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a lab report for a patient's lab test.
 *
 * - `generateLabReport` - A function that takes a test name and returns a structured lab report.
 * - `GenerateLabReportInput` - The input type for the `generateLabReport` function.
 * - `GenerateLabReportOutput` - The return type for the `generateLabReport` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLabReportInputSchema = z.object({
  testName: z.string().describe('The name of the lab test to generate a report for.'),
});
export type GenerateLabReportInput = z.infer<typeof GenerateLabReportInputSchema>;


const AnalyteSchema = z.object({
    analyte: z.string().describe('The name of the analyte being measured.'),
    result: z.string().describe('The measured value of the analyte.'),
    referenceRange: z.string().describe('The normal reference range for the analyte.'),
});

const GenerateLabReportOutputSchema = z.object({
    results: z.array(AnalyteSchema).describe('The list of test results.'),
    interpretation: z.string().describe('A summary or interpretation of the results.'),
});
export type GenerateLabReportOutput = z.infer<typeof GenerateLabReportOutputSchema>;

export async function generateLabReport(input: GenerateLabReportInput): Promise<GenerateLabReportOutput> {
  return generateLabReportFlow(input);
}

const generateLabReportPrompt = ai.definePrompt({
  name: 'generateLabReportPrompt',
  input: {schema: GenerateLabReportInputSchema},
  output: {schema: GenerateLabReportOutputSchema},
  prompt: `You are a medical laboratory AI. Your task is to generate a plausible, but fictional, lab report for a given test name.

  Generate a set of typical results for the following test: {{{testName}}}
  
  Include a list of analytes, their results, and their normal reference ranges.
  Also provide a brief interpretation of the results. The results should appear normal and not indicate any disease or abnormality.`,
});

const generateLabReportFlow = ai.defineFlow(
  {
    name: 'generateLabReportFlow',
    inputSchema: GenerateLabReportInputSchema,
    outputSchema: GenerateLabReportOutputSchema,
  },
  async input => {
    const {output} = await generateLabReportPrompt(input);
    return output!;
  }
);
