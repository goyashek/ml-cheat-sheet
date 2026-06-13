# CampusX 100 Days of ML Companion & Decision Guide

This folder contains a local developer toolkit designed to help you quickly select and implement machine learning preprocessing techniques, scaling methods, and models. It directly references the materials from your **CampusX 100 Days of Machine Learning** course.

---

## 📂 Contents
*   **`index.html`**: The interactive web application. It includes a search bar, category filters, a detail drawer, and the decision wizard.
*   **`style.css`**: Styling file for the dark-mode glassmorphic user interface.
*   **`app.js`**: Core Javascript application logic, wizard state machine, and dynamic diagnostic checker.
*   **`techniques.js`**: The dataset of 52 techniques, advantages/disadvantages, math logic, and scikit-learn code.
*   **`frames_mapping.js`**: Auto-generated index of the video frames screenshots directory.
*   **`static_cheat_sheet.md`**: A static, single-file Markdown cheat sheet which you can read directly in your text editor, terminal, or Jupyter notebook environment.
*   **`assets/frames/`**: Folder containing high-density extracted video frames (taken every 2 minutes from each video) to display visual references from the lectures.

---

## 🚀 How to Run the Web Application

### Option 1: Double-Click (Local File)
Simply double-click the **`index.html`** file in Finder. It will open in your default browser. Since it runs as a local file (`file:///...`), you will be able to click the resource links to directly open local video files and notebooks on your Mac.

### Option 2: Local HTTP Server (Recommended)
If your browser restricts certain local files via Option 1, you can launch a simple Python server:
1. Open your terminal.
2. Navigate to this folder:
   ```bash
   cd "/Users/abhigoyal/Documents/Acadss/Data Science/CampusX/ml-cheat-sheet"
   ```
3. Run the Python HTTP server command:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your web browser and go to:
   ```text
   http://localhost:8000
   ```

---

## 💡 How to use the Decision Wizard & Pipeline Integrity Check
Struggling with what to do when you have a specific problem (like class imbalance or outliers)?
1. Open the web app.
2. Click **Decision Wizard** in the sidebar.
3. Answer the step-by-step questions about your data characteristics.
4. The wizard will recommend the exact technique (e.g. **SMOTE** or **RobustScaler**) and present you with a **🧠 Pipeline Integrity Check**.
5. Answer the dynamic validation questions to test your pipeline against common ML traps (e.g. data leakage, model mismatch).
6. View your real-time **Pipeline Integrity Score** (Secure, Vulnerable, or Compromised) along with color-coded feedback and explanations, then click to view detail screenshots and copy code!
