# CampusX 100 Days of ML Companion & Decision Guide

An interactive, dark-mode glassmorphic web application and developer toolkit designed to help you select, visualize, and implement machine learning preprocessing techniques, scaling methods, and models. It directly references the curriculum and materials from the **CampusX 100 Days of Machine Learning** course.

🚀 **Access the live web app directly here:** [https://goyashek.github.io/ml-cheat-sheet/](https://goyashek.github.io/ml-cheat-sheet/)

---

## ✨ Features
*   **Interactive Directory:** Browse and search 50+ scaling, encoding, imputation, outlier handling, and modeling techniques.
*   **Mathematical Intuition:** Detailed mathematical formula and explanation for each technique.
*   **Scikit-Learn Integration:** Copy production-ready Python snippets for standard pipelines.
*   **Video Screenshot Gallery:** View whiteboard slides and annotations captured at high density from the lecture videos.
*   **Decision Wizard & Pipeline Check:** Answer dynamic questions about your dataset's traits to receive a recommended preprocessing pipeline, and score your setup against common ML traps (e.g., data leakage, model mismatch).

---

## 🌐 Dynamic Resource Links (Online vs Local)
This project is configured to run seamlessly both **on the web** and **locally as a desktop utility**:

*   **When Hosted Online:**
    *   **Videos:** Play buttons automatically link to the corresponding video on **YouTube** (e.g., `https://youtube.com/watch?v=...`) based on scraped video IDs.
    *   **Notebooks:** Notebook links open the respective Jupyter notebook directly from the official **CampusX GitHub repository**.
*   **When Opened Locally (`file:///` protocol):**
    *   The app displays additional links to **Play Local Video** and **Open Local Notebook** on your own computer for high-performance offline learning.

---

## 💻 How Other Users Can Run This Locally

If you want to use this cheat sheet locally and link it to your own downloaded course files:

1.  **Clone this repository:**
    ```bash
    git clone https://github.com/goyashek/ml-cheat-sheet.git
    cd ml-cheat-sheet
    ```
2.  **Configure Local Paths (Optional):**
    Open `app.js` and edit the local directory paths at the top of the file to point to your local course folder:
    ```javascript
    const LOCAL_VIDEO_BASE = 'file:///path/to/your/downloaded/videos/';
    const LOCAL_NOTEBOOK_BASE = 'file:///path/to/your/downloaded/notebooks/';
    ```
3.  **Run the application:**
    *   **Option A:** Simply double-click `index.html` to open it in your browser.
    *   **Option B (Recommended):** Serve it using Python to avoid browser file access restrictions:
        ```bash
        python3 -m http.server 8000
        ```
        Then open `http://localhost:8000` in your web browser.

---

## 📂 Project Structure
*   `index.html` — The main interactive dashboard interface.
*   `style.css` — High-performance dark-mode glassmorphism stylesheet.
*   `app.js` — Core application logic, wizard state machine, and browser environment routing.
*   `techniques.js` — The full database of 52 ML techniques, scikit-learn code, and metadata.
*   `frames_mapping.js` — File index mapping high-density video screenshot frames.
*   `assets/frames/` — High-density lecture video frame screenshot images.

---

*Made with ❤️ by [Abhishek Goyal](https://github.com/goyashek)*
