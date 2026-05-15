# AI / ML Blog

A personal blog about Artificial Intelligence, Machine Learning, Deep Learning, and modern AI systems.

The goal of this project is to explain complex AI concepts in a simple and visual way using articles, diagrams, and interactive SVG illustrations.

## About the Project

This blog is designed as an educational platform for explaining AI topics step by step.

Instead of starting with formulas and technical terminology, each topic is introduced gradually:

1. start with intuition;
2. show a simple example;
3. explain the idea visually;
4. add technical details only after the main concept is clear.

This approach makes complex topics easier to understand for students, beginners, and anyone interested in AI.

## Topics

The blog covers topics such as:

- Artificial Intelligence;
- Machine Learning;
- Deep Learning;
- Large Language Models;
- Computer Vision;
- AI Agents;
- VLM / VLA / Physical AI;
- research paper reviews;
- research notes.

## Technologies

The project uses:

- HTML;
- CSS;
- JavaScript;
- Markdown;
- SVG;
- interactive SVG diagrams;
- GitHub Pages for publishing.

## Interactive SVG Diagrams

A key part of the project is the use of interactive SVG visualizations.

They are used to explain complex topics step by step. For example:

- what AI, ML, DL, and LLM are;
- the difference between explicit programming and machine learning;
- why machine learning is useful when there are many hidden rules;
- how a model learns from errors;
- how an LLM generates text token by token;
- how a computer “sees” an image using pixels and RGB channels.

Each interactive SVG has built-in navigation:

- Previous;
- Next.

This allows the reader to focus on one idea at a time.

## Project Structure

Example project structure:

```text
.
├── index.html
├── blog.html
├── article.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── articles/
│   ├── ai-ml-intro.md
│   ├── explicit-vs-ml.md
│   ├── llm-generation.md
│   └── computer-vision.md
│
├── svg/
│   ├── ai-hierarchy.svg
│   ├── explicit-vs-ml.svg
│   ├── ml-training-process.svg
│   ├── llm-generation.svg
│   └── computer-vision.svg
│
└── images/
    └── ...
```


# Adding a New Article

Create a new Markdown file inside the articles folder.

Example:

articles/how-llm-generates-text.md

A simple article structure:

# How LLMs Generate Text

This article explains how a large language model generates text token by token.

## Intuition

A simple explanation of the main idea.

## Visual Explanation

An interactive SVG diagram.

## Technical Details

A more precise explanation.

## Conclusion

The key takeaway.
Adding an Interactive SVG

Create a new SVG file inside the svg folder.

Example:

svg/llm-generation.svg

Then embed it inside an article:

<object
  type="image/svg+xml"
  data="/svg/llm-generation.svg"
  class="interactive-svg">
</object>

For interactive SVGs, it is better to use object instead of img, because JavaScript inside the SVG may not work when embedded as a regular image.


Publishing

The site can be published using GitHub Pages.

Basic steps:

create a GitHub repository;
upload the project files;
open repository settings;
enable GitHub Pages;
choose the branch and folder for deployment;
open the published site.

The site URL will look like this:

https://username.github.io/repository-name/