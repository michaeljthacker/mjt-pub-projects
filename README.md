# mjt Projects Gallery

A simple, lightweight gallery showcasing sites and apps built by **Mike Thacker**. Projects range from early experiments and random prototypes to simple production webapps and full-stack applications.

* **Default view:** Project cards with screenshots, title, tags, and an “Est.” date.
* **Hover / tap:** Show description and quick links (site, GitHub).
* **Tabs:**

  * **Projects** – all projects, with tag filters and search.
  * **About** – a short bio and profile links (GitHub, LinkedIn, Buy Me a Coffee).

The production site will live at:

* **Primary gallery:** `https://projects.mjt.pub`
* **Redirects:** `https://www.mjt.pub` and `https://mjt.pub` → `https://projects.mjt.pub`

A simple footer at the bottom of every page:

> This is an mjt.pub site. Contact: [hi@mjt.pub](mailto:hi@mjt.pub)

---

## Branching & Deployment Strategy

This repo uses a simple, long-lived branch model:

* **`prod`**

  * **Production branch.**
  * GitHub Pages serves from the **root of this branch** (no `/docs` folder).
  * Anything in `prod` is considered live/production.

* **`main`**

  * **Default development branch.**
  * Feature and bugfix branches are merged into `main` first.

* **Feature / bugfix branches**

  * Examples: `feat/add-filters`, `feat/about-tab`, `bug/fix-mobile-overlay`.
  * Merged into `main` via PR (or straightforward merges).

**Deployment flow:**

1. Develop on `feat/...` or `bug/...` branches.
2. Merge into `main`.
3. When ready to deploy, merge `main` → `prod`.
4. GitHub Pages is configured to use:

   * **Branch:** `prod`
   * **Folder:** `/` (root)
   * **Custom domain:** `projects.mjt.pub`

> **Do I need a `/docs` folder?**
> No — the site files live at the root of the `prod` branch.

---

## Content: Current Projects

Initial projects to feature:

* **athousandquestions.com**
  A simple and interactive web application designed to provide icebreaker-style questions for fun conversations, team-building exercises, or social gatherings. The site is visually clean, lightweight, and user-friendly, with category filtering, social sharing, and minimal ads.

* **storytime.mjt.pub**
  A fully automated, month-long bedtime story generator and publisher. Each day, a new ~20-minute chapter is generated using the OpenAI API, posted to a static site hosted via GitHub Pages, and archived. Every 30 days, a brand-new concept, characters, and plot are created.

* **soccer.mjt.pub**
  A simple 2D soccer positioning game where players can select a role, position themselves on the field, and receive a score based on their positioning. (Built by someone who is a relative novice at soccer.)

* **garden.mjt.pub**
  A cozy, browser-based, 2D farming tycoon game with 8-bit pixel art, grid-based gameplay, and idle mechanics. You play as Theo, a gardener growing and selling crops to grocery stores in a city—starting small with carrots and working up to rare crops and larger farms.

* **snake.mjt.pub**
  A classic Snake game implementation built from scratch using vanilla JavaScript, HTML, and CSS. Demonstrates fundamental web development and game programming concepts.

* **homecare.mjt.pub**
  A focused, lightweight webapp for generating and tracking a personalized home maintenance schedule.

* **api.mjt.pub**
  A modular Django + DRF backend used by multiple personal projects. Think of it as a shared tool-belt that can power many apps without data collisions.

* **colors.mjt.pub**
  A responsive generative art web application that creates color-themed designs using extracted color palettes.

* **thelastpupper.com**
  A simple site hosting a “Last Supper” parody image with dogs. Not my artwork, just a domain I couldn’t resist buying.

* **PlayfulButton.com**
  A simple web-based game where users click a playful, moving button to increase their score. Includes difficulty levels, lives, and a playful UI. Originally built with Flask, now served as static files on GitHub Pages.

* **Chrome Bible Speak**
  A Chrome extension that scans webpages for BibleSpeak.org pronunciation links and injects phonetic pronunciation guides directly into the page.

* **NotableJoy.com**
  A site for a prototyped idea: fun, uplifting notes printed on business cards, meant to be handed to others as a touch of joy in their day.

* **PDF Merger GUI**
  A simple drag-and-click desktop app for merging PDF files, built with Python and Tkinter.

Each project will also show an **“Est. Month Year”** line (manually specified), e.g., “Est. January 2024”.

---

## About Tab

The UI includes an **About** view that acts like a tab next to Projects.

* **Projects tab (default):**

  * Title (e.g., `projects.mjt.pub`).
  * Short intro sentence, e.g.:

    > Welcome! These projects are built by Mike Thacker, ranging from early learning experiments and random prototypes to simple production webapps and full-stack applications.
  * Divider line.
  * Tag filters, search bar, and project cards.

* **About tab:**

  * A short “about” paragraph, e.g.:

    > I create simple solutions to real problems—or sometimes just for fun—while exploring new tools and ideas along the way. For me, it's all about learning, experimenting, and enjoying the process of turning ideas into reality. I have a data science background, with my greatest expertise in causal inference and people analytics. Econ PhD.

  * A small grid of **profile cards** for:

    * **GitHub:** `https://github.com/michaeljthacker`
    * **LinkedIn:** `https://michaeljthacker.com` (redirects to LinkedIn)
    * **Buy Me a Coffee:** `https://www.buymeacoffee.com/michaeljthacker`

These tabs are implemented via simple JS: when you click “Projects” or “About”, the layout “slides” or swaps between views (no separate pages required).

---

## Tech Stack & Layout

* **HTML + CSS + JavaScript** (no framework required).
* A `projects.json` file for project data.
* A `screenshots/` folder for thumbnails.
* Light, clean, simple styling:

  * Title + one-line intro at the top.
  * Thin divider line.
  * Tag filters + search.
  * Project grid cards.
  * Footer with mjt.pub + email.

---

## Project Structure

Minimal structure:

```text
.
├── index.html
├── styles.css
├── main.js
├── projects.json
├── about.json           # optional, for profile card config
└── screenshots/
    ├── default-project.png
    ├── a-thousand-questions.png
    ├── storytime.png
    ├── soccer-positioning.png
    ├── garden-tycoon.png
    ├── snake.png
    ├── homecare.png
    ├── api-backend.png
    ├── colors.png
    ├── the-last-pupper.png
    ├── playful-button.png
    ├── chrome-bible-speak.png
    ├── notable-joy.png
    └── pdf-merger-gui.png
```

### Screenshot Naming Convention

To keep filenames consistent and not tied to GitHub repos:

* Use **lowercase, kebab-case**, based roughly on the project’s “name”, not the repo, e.g.:

  * `a-thousand-questions.png`
  * `storytime.png`
  * `soccer-positioning.png`
  * `garden-tycoon.png`
  * `playful-button.png`
  * `pdf-merger-gui.png`
* The **`screenshot`** field in `projects.json` will always be `<id>.png` by default (you can override if needed).

If a file is missing or not provided, the UI falls back to `default-project.png`.

---

## `projects.json` Schema

Each project is a JSON object. Example:

```json
[
  {
    "id": "a-thousand-questions",
    "name": "A Thousand Questions",
    "slug": "athousandquestions.com",
    "description": "A simple and interactive web application designed to provide icebreaker-style questions for fun conversations, team-building exercises, or social gatherings.",
    "siteUrl": "https://athousandquestions.com",
    "screenshot": "a-thousand-questions.png",
    "githubUrl": "https://github.com/michaeljthacker/athousandquestions",
    "established": "January 2024",
    "tags": ["webapp", "static-site", "questions"]
  }
]
```

### Fields

* **`id`**

  * Short, kebab-case identifier, e.g. `"a-thousand-questions"`, `"pdf-merger-gui"`.
  * Used in DOM attributes and as the default basis for `screenshot`.

* **`name`**

  * Display name on the card.

* **`slug`** (optional)

  * Short string like `"athousandquestions.com"` or `"soccer.mjt.pub"`.
  * Can be used in data attributes, analytics, or as a secondary label.

* **`description`**

  * Shown in the overlay when hovering or tapping the card.

* **`siteUrl`**

  * URL the card navigates to when you click the card background.

* **`screenshot`** (optional)

  * Filename under `screenshots/`.
  * If omitted, code assumes `<id>.png`; if that’s missing too, falls back to `default-project.png`.

* **`githubUrl`** (optional)

  * For public projects, use the actual repo URL.
  * For private or miscellaneous things, you can just use `https://github.com/michaeljthacker`.
  * If omitted, the GitHub button is hidden for that card.

* **`established`**

  * A plain string like `"January 2024"`, `"2023"`, or `"Summer 2022"`.
  * Rendered as `Est. January 2024` on the card.

* **`tags`** (optional; array of strings)

  * Used for tag-based filtering and visual chips on the card.

### Global Buy Me a Coffee Link

All support/donation links use the same URL:

* `https://www.buymeacoffee.com/michaeljthacker`

This is handled **globally in JavaScript**, not per project field. The About page and possibly a small “Support” link can reuse this.

---

## Tag System & Search

The **Projects** view supports:

* **Tag filters:**

  * A set of tag “chips” (e.g., “All”, “Games”, “Webapps”, “Tools”).
  * Clicking a tag filters cards to those containing that tag.

* **Search:**

  * A simple search input that filters projects by `name` and `description` (case-insensitive substring match).

### Suggested Tag Vocabulary

Use these (or a subset) for consistency:

**By type:**

* `game`
* `webapp`
* `tool`
* `chrome-extension`
* `desktop-app`
* `content-generator`

**By tech:**

* `html-css-js`
* `python`
* `django`
* `drf`
* `tkinter`
* `chrome-api`

**By deployment / architecture:**

* `static-site`
* `api-backed`
* `full-stack`

**By maturity:**

* `prototype`
* `production`
* `playground`

Example tag sets:

* `["game", "html-css-js", "static-site"]`
* `["webapp", "api-backed", "production"]`
* `["desktop-app", "python", "tool"]`

---

## UI Behavior

**Projects tab (default)**

* Header:

  * Title (e.g., `projects.mjt.pub` or “Projects by Mike Thacker”).
  * One-sentence intro about the collection.
  * Horizontal divider.
* Controls:

  * Tag filter row.
  * Search input.
* Cards:

  * Default state: screenshot + project name + tags + “Est. Month Year”.
  * Hover / tap: show overlay with description and buttons:

    * “View Site”
    * “GitHub” (if `githubUrl` present)
  * Clicking the **card background** navigates to `siteUrl`.

**About tab**

* Bio paragraph.
* Small grid of profile cards:

  * GitHub, LinkedIn, Buy Me a Coffee.
* Uses a simple tab/slide effect controlled by JS (no separate route).

---

## Adding a New Project

1. **Screenshot (optional)**

   * Save a screenshot as `<id>.png` in `screenshots/`, e.g. `my-new-project.png`.

2. **Append to `projects.json`**

   ```json
   {
     "id": "my-new-project",
     "name": "My New Project",
     "slug": "mynewproject.example.com",
     "description": "Short description of what this project does and why it exists.",
     "siteUrl": "https://mynewproject.example.com",
     "screenshot": "my-new-project.png",
     "githubUrl": "https://github.com/michaeljthacker",
     "established": "March 2025",
     "tags": ["webapp", "prototype"]
   }
   ```

3. **Commit & deploy**

   ```bash
   git add projects.json screenshots/my-new-project.png
   git commit -m "Add My New Project to gallery"
   git push origin main

   git checkout prod
   git merge main
   git push origin prod
   git checkout main
   ```

The new project will appear automatically with filters and search support.