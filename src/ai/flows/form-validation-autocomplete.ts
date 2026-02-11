'use server';

/**
 * @fileOverview Form field validation and autocompletion flow for lab inventory management.
 *
 * - validateAndAutocomplete - Function to validate and provide autocompletion suggestions for form fields.
 * - ValidationInput - Input type for the validateAndAutocomplete function.
 * - ValidationOutput - Return type for the validateAndAutocomplete function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidationInputSchema = z.object({
  fieldName: z.string().describe('The name of the form field to validate and autocomplete.'),
  inputValue: z.string().describe('The current value entered by the user in the form field.'),
});
export type ValidationInput = z.infer<typeof ValidationInputSchema>;

const ValidationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the input value is valid for the given field.'),
  suggestions: z.array(z.string()).describe('Autocompletion suggestions for the input value.'),
  errorMessage: z.string().optional().describe('Error message if the input is invalid.'),
});
export type ValidationOutput = z.infer<typeof ValidationOutputSchema>;

export async function validateAndAutocomplete(input: ValidationInput): Promise<ValidationOutput> {
  return validateAndAutocompleteFlow(input);
}

const validateAndAutocompletePrompt = ai.definePrompt({
  name: 'validateAndAutocompletePrompt',
  input: {schema: ValidationInputSchema},
  output: {schema: ValidationOutputSchema},
  prompt: `You are a helpful assistant that validates and provides autocompletion suggestions for form fields in a lab inventory management system.

  The user is currently entering data in the "{{fieldName}}" field and has typed "{{inputValue}}".

  Based on common scientific names and lab inventory practices, determine if the input is valid and provide relevant autocompletion suggestions.

  Return a JSON object with the following format:
  {
    "isValid": true/false, // Whether the input value is valid for the given field
    "suggestions": ["suggestion1", "suggestion2", ...], // Autocompletion suggestions for the input value
    "errorMessage": "error message" // Optional error message if the input is invalid
  }

  For example, if the fieldName is "Material Name" and the inputValue is "Sodi", a valid response would be:
  {
    "isValid": false,
    "suggestions": ["Sodium Chloride", "Sodium Hydroxide", "Sodium Bicarbonate"],
    "errorMessage": "Please enter a full material name."
  }

  Another example, if the fieldName is "Storage Location" and the inputValue is "Freezer -20", a valid response would be:
  {
    "isValid": true,
    "suggestions": [],
    "errorMessage": null
  }
  `,
});

const validateAndAutocompleteFlow = ai.defineFlow(
  {
    name: 'validateAndAutocompleteFlow',
    inputSchema: ValidationInputSchema,
    outputSchema: ValidationOutputSchema,
  },
  async input => {
    const {output} = await validateAndAutocompletePrompt(input);
    return output!;
  }
);
