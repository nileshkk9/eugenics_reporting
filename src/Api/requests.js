import axios from "axios";
import { LOCAL_AUTH_KEY, API_URL } from "../utils/constants";
const api = {};

const getAuthTokenFromLocal = () => {
  if (localStorage.getItem(LOCAL_AUTH_KEY)) {
    const authToken = JSON.parse(localStorage.getItem(LOCAL_AUTH_KEY));
    return authToken;
  }
};

const eugenics = () =>
  axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: { Authorization: getAuthTokenFromLocal() },
  });

api.inviteUser = async (data) => {
  try {
    const res = await eugenics().post("/user/invite", data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.registerViaToken = async (token, data) => {
  try {
    const res = await eugenics().post(`/user/register/${token}`, data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.loginUser = async (data) => {
  try {
    const res = await eugenics().post("/user/login", data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.sendRecoveryMail = async (data) => {
  try {
    const res = await eugenics().post("/user/password-reset", data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.verifyPasswordResetToken = async (data) => {
  try {
    const res = await eugenics().post(
      `/user/password-reset/${data.email}/${data.token}`,
      data
    );
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.setNewPassword = async (email, token, data) => {
  try {
    const res = await eugenics().post(
      `/user/password-reset/${email}/${token}`,
      data
    );
    return await res;
  } catch (error) {
    return error;
  }
};

api.publishReport = async (data) => {
  try {
    const res = await eugenics().post("/report", data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getReports = async (pageNumber) => {
  try {
    const res = await eugenics().get(`/reports/${pageNumber}`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getExcel = async (data) => {
  try {
    const res = await eugenics().post("/reports/create-excel", data, {
      responseType: "arraybuffer",
    });
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getDoctors = async () => {
  try {
    const res = await eugenics().post(`/reports/doctors`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getQualification = async () => {
  try {
    const res = await eugenics().post(`/reports/qualifications`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getDocLocation = async () => {
  try {
    const res = await eugenics().post(`/reports/locations`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getUser = async () => {
  try {
    const res = await eugenics().get(`/user/me`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getRegionalUsers = async () => {
  try {
    const res = await eugenics().get(`/user/all`);
    return await res.data;
  } catch (error) {
    return error.response;
  }
};

api.getUserById = async (id) => {
  try {
    const res = await eugenics().get(`/user/${id}`);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.updateUser = async (id, data) => {
  try {
    const res = await eugenics().patch(`/user/${id}`, data);
    return await res;
  } catch (error) {
    return error.response;
  }
};

api.getEntries = async (data) => {
  try {
    const res = await eugenics().post(`/regional-report`, data);
    return await res.data;
  } catch (error) {
    return error.response;
  }
};

api.getGeoLocation = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  const res = await axios.get(url, { timeout: 10000 });
  return res;
};

export { api };
