export const getDocs = async () => {
  const response = await fetch("/api/getDocs");
  const result = await response.json();
  return result;
};

export const getDoc = async (id) => {
  const response = await fetch(`/api/getDoc/${id}`);
  const result = await response.json();
  return result;
};

export const postDoc = async (title, parentId = null) => {
  const response = await fetch("/api/postDoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      parent: parentId,
    }),
  });
  const result = await response.json();
  return result;
};

export const updateDoc = async (id, title, content) => {
  const response = await fetch(`/api/updateDoc/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });
  const result = await response.json();
  return result;
};

export const deleteDoc = async (id) => {
  const response = await fetch(`/api/deleteDoc/${id}`, {
    method: "DELETE",
  });
  const result = await response.json();
  return result;
};
