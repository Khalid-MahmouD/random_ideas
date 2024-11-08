import axios from "axios";

class IdeasApi {
  constructor() {
    this._baseUrl = "/api/ideas";
  }
  getIdeas() {
    return axios.get(this._baseUrl);
  }
  createIdea(data) {
    return axios.post(this._baseUrl, data);
  }
  updateIdea(id, data) {
    return axios.put(`${this._baseUrl}/${id}`, data);
  }

  deleteIdea(id) {
    const username = localStorage.getItem("username")
      ? localStorage.getItem("username")
      : "";
    return axios.delete(`${this._baseUrl}/${id}`, {
      data: {
        username: username,
      },
    });
  }
}

export default new IdeasApi();
