// Dynamically determine the backend URL based on current window location
const BASE_URL = (() => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  // 始终使用3000端口
  return `${protocol}//${hostname}:3000/`;
})();
const GET_USER = "user/";

export async function getUserList(uid) {
  if (!uid || isNaN(uid)) {
    console.error("Invalid uid:", uid);
    return { data: [] }; // 返回空数组而不是null
  }
  let url = BASE_URL + GET_USER + uid;
  try {
    console.log("Fetching users from:", url);
    let response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log("getUserList response:", data);
      return { data: data }; // 确保返回正确的数据结构
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("Request Failed:", error);
    return { data: [] }; // 错误时返回空数组而不是null
  }
}

/* export async function postUser(user) {
  let url = BASE_URL + GET_USER;
  let option = {
    method: "GET",
    body: JSON.stringify(user),
  };
  try {
    let response = await fetch(url);
    if (response.ok) {
      return await { data: response.json() };
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.log("Request Failed", error);
  }
} */
