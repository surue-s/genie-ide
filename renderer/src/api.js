import axios from "axios";
import { LANGUAGE_VERSIONS, MONACO_TO_PISTON } from "./core/constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode) => {
  // Map Monaco language ID to Piston API language name
  const pistonLanguage = MONACO_TO_PISTON[language] || language;
  
  const response = await API.post("/execute", {
    language: pistonLanguage,
    version: LANGUAGE_VERSIONS[pistonLanguage],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};