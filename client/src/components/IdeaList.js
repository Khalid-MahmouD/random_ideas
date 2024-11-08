import IdeasApi from "../services/ideasApi";

class IdeaList {
  constructor() {
    this._ideaListEl = document.querySelector("#idea-list");
    this._ideas = [];
    this.getIdeas();
    this._validTags = new Set([
      "technology",
      "software",
      "business",
      "education",
      "health",
      "inventions",
    ]);
  }

  addEventListeners() {
    this._ideaListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-times")) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.parentElement.dataset.id;
        this.deleteIdea(ideaId);
      }
    });
  }
  async getIdeas() {
    try {
      const res = await IdeasApi.getIdeas();
      this._ideas = res.data.data;
      this.render();

      // console.log(this._ideas);
    } catch (error) {
      console.log(error.message);
    }
  }
  async deleteIdea(ideaId) {
    try {
      const res = await IdeasApi.deleteIdea(ideaId);
      console.log(res.data);
      this._idea = this._ideas.filter((idea) => idea._id !== ideaId);
      this.getIdeas();
    } catch (error) {
      console.log(error.message);
      alert("YOU CAN NOT DELETE");
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }
  formatDate(date) {
    if (date instanceof Date) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date;
  }

  getTagClass(tag) {
    return this._validTags.has(tag.toLowerCase())
      ? `tag-${tag.toLowerCase()}`
      : "tag-default";
  }

  render() {
    this._ideaListEl.innerHTML = this._ideas
      .map((idea) => {
        const formattedDate = this.formatDate(idea.createdAt);

        // If `idea.tag` is an array, map each tag to a styled HTML string
        const tagsHtml = Array.isArray(idea.tag)
          ? idea.tag
              .map(
                (tag) =>
                  `<span class="tag ${this.getTagClass(
                    tag
                  )}">${tag.toUpperCase()}</span>`
              )
              .join(" ")
          : `<span class="tag ${this.getTagClass(
              idea.tag
            )}">${idea.tag.toUpperCase()}</span>`;

        return `
            <div class="card" data-id=${idea._id}>
              <button class="delete"><i class="fas fa-times"></i></button>
              <h3>${idea.text}</h3>
              <p class="tags">${tagsHtml}</p>
              <p>
                Posted on <span class="date">${formattedDate}</span> by
                <span class="author">${idea.username}</span>
              </p>
            </div>
          `;
      })
      .join(""); // Join the array to form a single HTML string
    this.addEventListeners();
  }
}

export default IdeaList;
