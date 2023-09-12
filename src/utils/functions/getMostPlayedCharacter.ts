import axios from "axios";
import { URL_BASE_INFO, URL_BASE_CONTENT } from "../constants";

interface MostPlayedCharacterResult {
  name: string;
  image: string;
  portrait: string;
  background: string;
  role: string;
}

/**
 * Fetches and returns data about the most frequently played character in Valorant matches.
 *
 * @param {string} region - The region where the player is located.
 * @param {string} name - The player's name.
 * @param {string} tag - The player's tag.
 * @param {number} size - The size parameter for the request.
 * @returns {Promise<MostPlayedCharacterResult|null>} An object containing information about the most played character, or null if an error occurs.
 */
export default async function getMostPlayedCharacter(
  region: string,
  name: string,
  tag: string,
  size: number
): Promise<MostPlayedCharacterResult | null> {
  try {
    // Make a request to retrieve lifetime match data
    const response = await axios.get(
      `${URL_BASE_INFO}/valorant/v1/lifetime/matches/${region}/${name}/${tag}`,
      {
        params: {
          size: size,
        },
      }
    );

    if (response.status === 200) {
      const jsonData = response.data;

      // Filter data only for "Competitive" and "Unrated" game modes
      const filteredData = jsonData.data.filter((item: any) => {
        return item.meta.mode === "Competitive" || item.meta.mode === "Unrated";
      });

      // Create an object to count the frequency of each character
      const characterCounts: Record<string, number> = {};

      // Iterate through the filtered data and count characters
      filteredData.forEach((item: any) => {
        const characterId = item.stats.character.id;
        if (characterCounts[characterId]) {
          characterCounts[characterId]++;
        } else {
          characterCounts[characterId] = 1;
        }
      });

      // Find the most frequent character
      let mostFrequentCharacter: string | null = null;
      let maxCount = 0;

      for (const character in characterCounts) {
        if (characterCounts[character] > maxCount) {
          mostFrequentCharacter = character;
          maxCount = characterCounts[character];
        }
      }

      if (mostFrequentCharacter) {
        // Fetch data for the most frequent character
        const agentResponse = await axios.get(
          `${URL_BASE_CONTENT}/v1/agents/${mostFrequentCharacter}`
        );
        const agent = agentResponse.data;

        // Create a result object with relevant information
        const result: MostPlayedCharacterResult = {
          name: agent.data.displayName,
          image: agent.data.displayIcon,
          portrait: agent.data.bustPortrait,
          background: agent.data.background,
          role: agent.data.role.displayIcon,
        };

        // Return the result
        return result;
      } else {
        throw new Error("Unable to fetch data");
      }
    } else {
      throw new Error("Unable to fetch data");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
