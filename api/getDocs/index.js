import fetch from "node-fetch";

export default async function getDocs(request, response) {
  if (request.method !== "GET") {
    return response.status(400).json("method Error");
  }

  try {
    const fetchResponse = await fetch(process.env.API_ENDPOINT, {
      headers: {
        [process.env.API_KEY]: process.env.API_KEY_VALUE,
        "Content-Type": "application/json",
      },
    });

    if (fetchResponse.ok) {
      const result = await fetchResponse.json();
      return response.status(200).json(result);
    }
    return response.status(400).json("API ERROR");
  } catch (error) {
    return response.status(400).json(error.message);
  }
}
