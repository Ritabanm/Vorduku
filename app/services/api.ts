import axios from 'axios';

const API_URL = 'https://words.bighugelabs.com/api/2';
const API_KEY = '0db6ff48309bc8b878616e469a2f11da'; // Replace with your Big Huge Thesaurus API key

/**
 * Fetch synonyms for a given word using the Big Huge Thesaurus API.
 * @param word - The word for which synonyms need to be fetched.
 * @returns An array of synonyms.
 */
export const fetchSynonyms = async (word: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_URL}/${API_KEY}/${word}/json`);
    const synonyms =
      response.data?.noun?.syn || response.data?.verb?.syn || [];
    return Array.isArray(synonyms) ? synonyms : [];
  } catch (error) {
    // Safely access `error.message` using a type guard
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching synonyms for word: ${word}`, error.message);
    } else {
      console.error(`Error fetching synonyms for word: ${word}`, error);
    }
    return [];
  }
};
