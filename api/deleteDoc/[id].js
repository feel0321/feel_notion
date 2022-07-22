import fetch from "node-fetch";

export default async function deleteDoc(request, response) {
  if (request.method !== "DELETE") {
    return response.status(400).json("method Error");
  }

  const { id } = request.query;
  try {
    const fetchResponse = await fetch(`${process.env.API_ENDPOINT}/${id}`, {
      method: "DELETE",
    });

    if (fetchResponse.ok) {
      const result = await response.json();
      return response.status(200).json(result);
    }
    return response.status(400).json("API ERROR");
  } catch (error) {
    return response.status(400).json(error.message);
  }
}
