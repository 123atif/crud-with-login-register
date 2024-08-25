import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
});
// let currentRequestController; // Variable to store the current AbortController instance

instance.interceptors.request.use(
  function (config) {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // if (currentRequestController) {
    //   currentRequestController.abort();
    // }

    // // Create a new AbortController instance for the current request
    // currentRequestController = new AbortController();
    // config.signal = currentRequestController.signal;

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export default instance;
