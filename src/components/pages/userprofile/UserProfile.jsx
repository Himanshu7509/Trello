import { getUserApi } from "../../utils/Api";
let userProfileData = null;

export const fetchUserProfile = async () => {
  try {
    const response = await getUserApi();
    userProfileData = response.data;
    return userProfileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  if (userProfileData) {
    return userProfileData;
  }
  return await fetchUserProfile();
};