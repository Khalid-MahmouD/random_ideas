import axios from "axios";
import IdeasApi from "../services/ideasApi";
import IdeaList from "./IdeaList";

class IdeaForm {
  constructor() {
    this._formModal = document.querySelector("#form-modal");
    this._IdeaList = new IdeaList();
    this._validTags = new Set([
      "technology",
      "software",
      "business",
      "education",
      "health",
      "inventions",
    ]);
    this._selectedTags = new Set(); // Track selected tags
  }

  addEventListeners() {
    this._form.addEventListener("submit", this.handleSubmit.bind(this));

    // Dropdown toggle for tag selection
    this._tagDropdownBtn.addEventListener("click", () => {
      this._tagDropdownMenu.classList.toggle("show");
    });

    // Click event on each tag option
    this._tagDropdownMenu.querySelectorAll(".tag-option").forEach((tagEl) => {
      tagEl.addEventListener("click", () => this.toggleTag(tagEl));
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!this._tagDropdown.contains(e.target)) {
        this._tagDropdownMenu.classList.remove("show");
      }
    });
  }

  toggleTag(tagEl) {
    const tag = tagEl.dataset.tag;
    if (this._selectedTags.has(tag)) {
      this._selectedTags.delete(tag);
      tagEl.classList.remove("selected");
    } else {
      this._selectedTags.add(tag);
      tagEl.classList.add("selected");
    }
    this.updateSelectedTagsDisplay();
  }

  updateSelectedTagsDisplay() {
    // Clear and update selected tags display
    this._selectedTagsDisplay.innerHTML = Array.from(this._selectedTags)
      .map((tag) => `<span class="selected-tag">${tag}</span>`)
      .join("");
  }
  resetSelectedTags() {
    this._tagDropdownMenu.querySelectorAll(".tag-option").forEach((tagEl) => {
      tagEl.classList.remove("selected");
    });
  }
  async handleSubmit(e) {
    e.preventDefault();
    console.log(Array.from(this._selectedTags).length > 0);
    // if (
    //   !this._form.elements.text.value ||
    //   !this._form.elements.username.value ||
    //   !this._form.elements.tag
    // ) {
    //   alert("Please enter all fields");
    //   return;
    // }
    // if (
    //   !this._form.elements.text.value ||
    //   !this._form.elements.tag.value ||
    //   !this._form.elements.username.value
    // ) {
    //   alert("Please fill out all fields");
    //   return; // Stop the form submission if any field is empty
    // }

    localStorage.setItem("username", this._form.elements.username.value);

    const data = {
      username: this._form.elements.username.value,
      text: this._form.elements.text.value,
      tag: Array.from(this._selectedTags),
    };
    // Server
    const newIdea = await IdeasApi.createIdea(data);
    // DOM
    this._IdeaList.addIdeaToList(newIdea.data.data);
    this._IdeaList.render();

    // console.log(newIdea.data.data);
    this._form.elements.username.value = "";
    this._form.elements.text.value = "";
    this.render();
    this._selectedTags.clear();
    this.updateSelectedTagsDisplay();

    this.resetSelectedTags();

    document.dispatchEvent(new Event("closeModal"));
  }

  render() {
    this._formModal.innerHTML = `
       <form id="idea-form">
          <div class="form-control">
            <label for="username">Enter a Username</label>
            <input type="text" name="username" id="username" 
            value="${
              localStorage.getItem("username")
                ? localStorage.getItem("username")
                : ""
            }"/>
          </div>
          <div class="form-control">
            <label for="idea-text">What's Your Idea?</label>
            <textarea name="text" id="idea-text"></textarea>
          </div>
          <div class="form-control">
            <label for="tags">Select Tags</label>
            <div id="tag-dropdown" class="tag-dropdown">
              <button type="button" class="dropdown-btn">Select Tags</button>
              <div class="dropdown-menu" id="tag-dropdown-menu">
                ${Array.from(this._validTags)
                  .map(
                    (tag) => `
                    <div class="tag-option" data-tag="${tag}">${tag}</div>
                  `
                  )
                  .join("")}
              </div>
              <div id="selected-tags-display" class="selected-tags-display"></div>
            </div>
          </div>
          <button class="btn" type="submit" id="submit">Submit</button>
        </form>
    `;

    this._form = document.querySelector("#idea-form");
    this._tagDropdown = document.getElementById("tag-dropdown");
    this._tagDropdownBtn = this._tagDropdown.querySelector(".dropdown-btn");
    this._tagDropdownMenu = document.getElementById("tag-dropdown-menu");
    this._selectedTagsDisplay = document.getElementById(
      "selected-tags-display"
    );

    this.addEventListeners();
  }
}

export default IdeaForm;
