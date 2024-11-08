const express = require("express");
const router = express.Router();
const Idea = require("../models/idea.js");

// Get ALl Ideas
router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Somthing went wrong" });
  }
});

// Get Single Idea
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Somthing went wrong" });
  }
});

router.post("/", async (req, res) => {
  const idea = new Idea({
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  });
  try {
    const savedIdea = await idea.save();
    res.send({
      success: true,
      data: savedIdea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Somthing went wrong" });
  }
});

//

router.put("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (idea.username === req.body.username) {
      const updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.json({
        success: true,
        data: updatedIdea,
      });
    }
    //
    res.status(403).json({
      success: false,
      error: "you are not allowed to delete",
    });
  } catch (error) {
    console.error("Error updating idea:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating the idea",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    //
    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        data: {},
      });
    }
    res.status(403).json({
      success: false,
      error: "you are not autharized to update the idea",
    });
  } catch (error) {
    console.error("Error updating idea:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while updating the idea",
    });
  }
});

module.exports = router;
