const API_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  REGISTER_USER: `${API_BASE_URL}/users/register`,
  SIGN_IN_USER: `${API_BASE_URL}/users/signin`,
  CREATE_NEW_REQUEST: `${API_BASE_URL}/requests/new`,
  GET_ALL_REQUESTS: `${API_BASE_URL}/requests/all`,
  GET_REQUESTS_BY_CATEGORY: `${API_BASE_URL}/requests/category`,
  GET_REQUESTS_NEAR_ME: `${API_BASE_URL}/requests/nearme`,
};
