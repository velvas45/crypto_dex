"use server";

const headers = new Headers();
headers.set("X-CMC_PRO_API_KEY", process.env.API_KEY_COINMARKETCAP as string);

const requestOptions: RequestInit = {
  headers: headers,
  // other options like method, body, etc.
};

export const fetchCoin = async () => {
  try {
    const result = await fetch(
      `${process.env.BASE_API_URL_COINMARKETCAP}/cryptocurrency/listings/latest?limit=500`,
      requestOptions
    );

    if (result) return result.json();
  } catch (error) {
    throw error;
  }
};
