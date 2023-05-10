import axios from "axios";

const API_URL = "https://api2.ghin.com/api/v1";

interface HandicapResponse {
  golfers: { handicap_index: number }[];
}

export const getHandicapIndex = async (
  ghinNum: string,
  password: string
): Promise<number | null> => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    Authorization: "",
  };

  const data = {
    user: {
      email_or_ghin: ghinNum,
      password,
      remember_me: "true",
    },
    token: "nonblank",
  };

  try {
    const response = await axios.post(`${API_URL}/golfer_login.json`, data, {
      headers,
    });

    const token: string = response.data.golfer_user.golfer_user_token;
    headers.Authorization = `Bearer ${token}`;

    const url = `${API_URL}/golfers/search.json?per_page=1&page=1&golfer_id=${ghinNum}`;
    const { data: handicapResponse } = await axios.get<HandicapResponse>(url, {
      headers,
    });

    return handicapResponse.golfers[0]?.handicap_index ?? null;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
};
