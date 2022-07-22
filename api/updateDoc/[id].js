import fetch from "node-fetch";

export default async function updateDoc(request, response) {
  if (request.method !== "PUT") {
    return response.status(400).json("method Error");
  }

  const { id } = request.query;
  const { body } = request;
  try {
    const fetchResponse = await fetch(`${process.env.API_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        [process.env.API_KEY]: process.env.API_KEY_VALUE,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
