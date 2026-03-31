// utils/api.js
// This file centralizes API calls and handles dynamic base URL selection for development and production environments.
import axios from "axios";
import Constants from "expo-constants";

const REMOTE_URL = process.env.EXPO_PUBLIC_API_URL;
const LOCAL_PORT = 3000;

// expo-constants gives us the dev server host IP (works on any teammate's machine)
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const LOCAL_URL = debuggerHost ? `http://${debuggerHost}:${LOCAL_PORT}` : null;

const api = axios.create({ timeout: 5000 });

let baseURL = null;

async function getBaseURL() {
  if (baseURL) return baseURL;

  if (LOCAL_URL) {
    try {
      await axios.get(`${LOCAL_URL}/`, { timeout: 2000 });
      baseURL = LOCAL_URL;
    } catch {
      baseURL = REMOTE_URL;
    }
  } else {
    baseURL = REMOTE_URL;
  }

  api.defaults.baseURL = baseURL;
  console.log("API using:", baseURL);
  return baseURL;
}

getBaseURL();

export default api;
