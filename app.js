// CampusX ML Companion App Logic - Expanded Edition

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');
const techniquesGrid = document.getElementById('techniques-grid');

// Drawer Elements
const drawer = document.getElementById('detail-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerContent = document.getElementById('drawer-content');
const drawerCloseBtn = document.getElementById('drawer-close-btn');

// Wizard Elements
const questionBox = document.getElementById('question-box');
const wizardProgressFill = document.getElementById('wizard-progress-fill');
const wizardBackBtn = document.getElementById('wizard-back-btn');
const wizardRestartBtn = document.getElementById('wizard-restart-btn');

// App State
let activeTab = 'dashboard';
let activeCategory = 'all';
let searchQuery = '';
let wizardHistory = []; 
let currentWizardNode = 'start';

// Local Course Directory Configs
const LOCAL_VIDEO_BASE = 'file:///Users/abhigoyal/Documents/Acadss/Data Science/CampusX/100 Days of Machine Learning ｜ CampusX/';
const LOCAL_NOTEBOOK_BASE = 'file:///Users/abhigoyal/Documents/Acadss/Data Science/CampusX/';

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderTechniqueCards();
  initTabNavigation();
  initSearchAndFilter();
  initDrawer();
  initWizard();
  initThemeToggle();
  lucide.createIcons();
});

// 1. Tab Navigation
function initTabNavigation() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
          content.classList.add('active');
        }
      });
      
      activeTab = tabId;
      
      if (activeTab === 'wizard') {
        restartWizard();
      }
    });
  });
}

// 2. Search & Filtering
function initSearchAndFilter() {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTechniqueCards();
  });
  
  categoryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-tag')) {
      document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
      e.target.classList.add('active');
      
      activeCategory = e.target.getAttribute('data-category');
      renderTechniqueCards();
    }
  });
}

// 3. Render Cards
function renderTechniqueCards() {
  techniquesGrid.innerHTML = '';
  
  const filtered = TECHNIQUES_DB.filter(tech => {
    const matchesCategory = activeCategory === 'all' || tech.category === activeCategory;
    
    const matchesSearch = !searchQuery || 
      tech.name.toLowerCase().includes(searchQuery) ||
      tech.categoryName.toLowerCase().includes(searchQuery) ||
      tech.intuition.toLowerCase().includes(searchQuery) ||
      (tech.subtopics || []).some(sub => sub.toLowerCase().includes(searchQuery)) ||
      tech.advantages.some(adv => adv.toLowerCase().includes(searchQuery)) ||
      tech.disadvantages.some(dis => dis.toLowerCase().includes(searchQuery));
      
    return matchesCategory && matchesSearch;
  });
  
  if (filtered.length === 0) {
    techniquesGrid.innerHTML = `
      <div class="no-results-card" style="grid-column: 1/-1; text-align: center; padding: 60px; background-color: var(--bg-card); border-radius:16px; border: 1px solid var(--border-color);">
        <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--warning); margin-bottom: 16px;"></i>
        <h3 style="margin-bottom: 8px;">No techniques found</h3>
        <p style="color: var(--text-muted);">Try adjusting your search filters or typing another keyword.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  filtered.forEach(tech => {
    const card = document.createElement('div');
    card.className = 'technique-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="card-category badge-${tech.category}">${tech.categoryName}</span>
        <span class="video-badge">Day ${tech.videoNum}</span>
      </div>
      <h3>${tech.name}</h3>
      <p class="card-intuition">${tech.intuition.split('\n')[0]}</p>
      <div style="margin-top: 8px; display:flex; flex-wrap:wrap; gap:4px;">
        ${(tech.subtopics || []).slice(0, 3).map(sub => `<span style="font-size:0.68rem; background-color:rgba(255,255,255,0.03); padding:2px 8px; border-radius:4px; color:var(--text-muted);">${sub}</span>`).join('')}
      </div>
      <div class="card-footer" style="margin-top: 14px;">
        <span>View Details & Code</span>
        <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
      </div>
    `;
    
    card.addEventListener('click', () => openDrawer(tech.id));
    techniquesGrid.appendChild(card);
  });
  
  lucide.createIcons();
}

// 4. Detail Drawer Actions
function initDrawer() {
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });
}

function openDrawer(techId) {
  const tech = TECHNIQUES_DB.find(t => t.id === techId);
  if (!tech) return;
  
  // Extract YouTube ID if present in videoRef (e.g. "[1Yw9sC0PNwY]")
  const ytMatch = tech.videoRef ? tech.videoRef.match(/\[([a-zA-Z0-9_-]{11})\]/) : null;
  const ytId = ytMatch ? ytMatch[1] : null;
  const ytUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : null;

  // Clean notebook path for the official GitHub repository
  const cleanNotebookPath = tech.notebookPath 
    ? (tech.notebookPath.startsWith('Code/') ? tech.notebookPath.substring(5) : tech.notebookPath)
    : null;
  const githubNotebookUrl = cleanNotebookPath 
    ? `https://github.com/campusx-official/100-days-of-machine-learning/blob/main/${cleanNotebookPath}`
    : null;

  // Detect if app is running locally (so file:/// links can function)
  const isRunningAsLocalFile = window.location.protocol === 'file:';
  
  const videoUrl = LOCAL_VIDEO_BASE + encodeURIComponent(tech.videoRef);
  const notebookUrl = tech.notebookPath ? (LOCAL_NOTEBOOK_BASE + tech.notebookPath) : null;
  
  // High-Density Frame Gallery Logic
  let galleryHtml = '';
  const folderKey = tech.videoNum;
  const frames = FRAMES_MAPPING[folderKey] || [];
  
  if (frames.length > 0) {
    const itemsHtml = frames.map(f => {
      const src = `assets/frames/${folderKey}/${f}`;
      const ts = f.split('_')[1].split('.')[0];
      const mins = Math.floor(ts / 60);
      const secs = ts % 60;
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
      return `
        <div class="gallery-item" onclick="zoomImage('${src}')">
          <img src="${src}" alt="Video screenshot at ${timeStr}">
          <span>${timeStr}</span>
        </div>
      `;
    }).join('');
    
    galleryHtml = `
      <div class="drawer-section">
        <h3><i data-lucide="image"></i> Video Screenshots (High Density)</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">Screenshots taken every 2 minutes from the lecture showing whiteboard drawings and code details.</p>
        <div class="gallery-container">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  // Build links HTML based on whether we're online or local
  let linksHtml = '';
  
  if (ytUrl) {
    linksHtml += `
      <a href="${ytUrl}" class="link-btn youtube-btn" target="_blank">
        <i data-lucide="youtube"></i> Watch on YouTube
      </a>
    `;
  }
  
  if (githubNotebookUrl) {
    linksHtml += `
      <a href="${githubNotebookUrl}" class="link-btn github-btn" target="_blank">
        <i data-lucide="github"></i> View Notebook on GitHub
      </a>
    `;
  }

  if (isRunningAsLocalFile) {
    linksHtml += `
      <a href="${videoUrl}" class="link-btn" target="_blank">
        <i data-lucide="play-circle"></i> Play Local Video
      </a>
    `;
    if (notebookUrl) {
      linksHtml += `
        <a href="${notebookUrl}" class="link-btn" target="_blank">
          <i data-lucide="book-open"></i> Open Local Notebook
        </a>
      `;
    }
  }

  drawerContent.innerHTML = `
    <div class="drawer-header">
      <div class="drawer-meta">
        <span class="card-category badge-${tech.category}">${tech.categoryName}</span>
        <span class="video-badge">Day ${tech.videoNum}</span>
      </div>
      <h2>${tech.name}</h2>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
        ${(tech.subtopics || []).map(sub => `<span style="font-size:0.72rem; background-color:rgba(255,255,255,0.05); padding:2px 8px; border-radius:4px; color:var(--text-main); font-weight:550;">${sub}</span>`).join('')}
      </div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="external-link"></i> Resource Links</h3>
      <div class="local-links">
        ${linksHtml}
      </div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="help-circle"></i> Mathematical Intuition</h3>
      <p style="white-space: pre-wrap;">${tech.intuition}</p>
    </div>

    ${galleryHtml}

    <div class="drawer-section">
      <div class="pros-cons-grid">
        <div>
          <h3 style="color: var(--success);"><i data-lucide="check-circle"></i> Advantages</h3>
          <ul class="pros-list">
            ${tech.advantages.map(adv => `<li>${adv}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="color: var(--danger);"><i data-lucide="x-circle"></i> Disadvantages</h3>
          <ul class="cons-list">
            ${tech.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="sparkles"></i> Best Practices & Warnings</h3>
      <ul class="tips-list">
        ${tech.bestPractices.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>

    <div class="drawer-section">
      <h3><i data-lucide="code"></i> Scikit-Learn Template</h3>
      <div class="code-container">
        <div class="code-header">
          <span>Python (Scikit-Learn)</span>
          <button class="copy-btn" onclick="copyCode(this)">
            <i data-lucide="copy" style="width: 14px; height: 14px;"></i> Copy Code
          </button>
        </div>
        <pre><code id="code-block">${escapeHtml(tech.code)}</code></pre>
      </div>
    </div>
  `;
  
  lucide.createIcons();
  drawer.classList.add('active');
  drawerOverlay.classList.add('active');
}

function closeDrawer() {
  drawer.classList.remove('active');
  drawerOverlay.classList.remove('active');
}

function copyCode(btn) {
  const codeText = document.getElementById('code-block').innerText;
  navigator.clipboard.writeText(codeText).then(() => {
    btn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px;"></i> Copied!`;
    lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = `<i data-lucide="copy" style="width: 14px; height: 14px;"></i> Copy Code`;
      lucide.createIcons();
    }, 2000);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Global Image zoom modal helper
window.zoomImage = function(src) {
  let modal = document.querySelector('.img-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'img-zoom-modal';
    modal.innerHTML = `
      <button class="img-zoom-close" onclick="this.parentElement.classList.remove('active')">
        <i data-lucide="x" style="width:24px; height:24px;"></i>
      </button>
      <img src="" alt="Zoomed View">
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
  }
  modal.querySelector('img').src = src;
  modal.classList.add('active');
  
  modal.onclick = function(e) {
    if (e.target.tagName !== 'IMG') {
      modal.classList.remove('active');
    }
  };
};

// 5. DECISION WIZARD ENGINE
const WIZARD_NODES = {
  start: {
    question: "What is your main objective right now?",
    tip: "Tip: Preprocessing shapes your data distributions, while Supervised Learning fits models to labels, and Unsupervised discovers hidden patterns.",
    options: [
      { text: "Data Preprocessing & Feature Engineering", next: "prep" },
      { text: "Model Training & Selection (Supervised Learning)", next: "model" },
      { text: "Grouping Data or Dimensionality Reduction (Unsupervised)", next: "unsupervised" }
    ]
  },
  
  prep: {
    question: "What specific preprocessing task are you working on?",
    tip: "Tip: Real-world data is dirty. It is best to resolve missing values and outliers first, then perform transformations and feature scaling.",
    options: [
      { text: "Handling Missing Values (NaNs)", next: "missing" },
      { text: "Feature Scaling & Normalization", next: "scaling" },
      { text: "Outlier Detection & Removal", next: "outliers" },
      { text: "Encoding Categorical Variables", next: "encoding" },
      { text: "Feature Transformations (Skewness, Binning, Mixed, Dates)", next: "transforms" },
      { text: "Handling Class Imbalance in classification problems", next: "imbalance" },
      { text: "Creating Reusable Preprocessing Pipelines", next: "pipelines_choice" }
    ]
  },

  pipelines_choice: {
    question: "Do you need to apply different transformations to different columns (e.g. numeric vs categorical), or chain steps sequentially?",
    tip: "Tip: Pipelines chain scaling and model fitting in sequence, while ColumnTransformers apply specific scalers or encoders to named columns.",
    options: [
      { text: "Apply different steps to different columns (e.g. scale numerical, one-hot encode categories)", result: "column-transformer" },
      { text: "Chain steps sequentially for the entire dataset (e.g. impute -> scale -> train)", result: "pipelines" }
    ]
  },
  
  imbalance: {
    question: "What is the size and characteristics of your dataset?",
    tip: "Tip: Class imbalance (e.g. 95% vs 5%) biases classifiers. Oversampling (like SMOTE) works well for small data, whereas class-weights work best for larger data.",
    options: [
      { text: "Small or Medium (Generate synthetic samples to avoid losing data)", result: "smote" },
      { text: "Large (Can afford to reduce majority class, or want to weight loss algorithmically)", result: "logistic-regression" }
    ]
  },

  encoding: {
    question: "What type of categorical variable are you encoding?",
    tip: "Tip: Nominal categories have no rank order (use One-Hot). Ordinal categories have ranks (use Ordinal). High cardinality means hundreds of unique categories (like zip codes).",
    options: [
      { text: "Ordinal (Categories have a natural mathematical order, e.g. Rank)", result: "ordinal-encoder" },
      { text: "Nominal with low cardinality (No order, e.g. Color, Gender)", result: "one-hot-encoder" },
      { text: "Nominal with high cardinality (Many unique categories, e.g. Zip codes)", result: "target-encoder" }
    ]
  },

  transforms: {
    question: "What type of feature transformation do you need?",
    tip: "Tip: Non-linear features can be binned, mixed columns must be split, and skewed features must be normalized so linear models can learn.",
    options: [
      { text: "Correcting skewed columns to make them normally distributed", next: "skewed" },
      { text: "Grouping continuous columns into discrete blocks (binning)", result: "binning-discretization" },
      { text: "Splitting columns containing combined letters & numbers (mixed)", result: "mixed-variables" },
      { text: "Extracting features from Date & Time columns", result: "datetime-variables" },
      { text: "Constructing or splitting features based on domain knowledge", result: "feature-construction" }
    ]
  },

  skewed: {
    question: "Does your skewed feature contain negative values or zeros?",
    tip: "Tip: Standard log transform np.log(x) requires x > 0. For zeros and negative values, use Yeo-Johnson power transform.",
    options: [
      { text: "No, strictly positive (> 0)", result: "log-transformer" },
      { text: "Yes, contains zero or negative values", result: "power-transformer" }
    ]
  },

  outliers: {
    question: "Is your outlier-laden feature normally (Gaussian) distributed, or do you have a specific cutoff percentile?",
    tip: "Tip: Z-score relies on mean and standard deviation, which assumes normal data. Skewed datasets should use IQR boundaries.",
    options: [
      { text: "Yes, looks symmetric and bell-shaped (Z-Score)", result: "zscore-outlier" },
      { text: "No, highly skewed or arbitrary (IQR)", result: "iqr-outlier" },
      { text: "I want to clip values at specific percentiles (e.g. 1% and 99% Percentiles)", result: "percentile-outlier" }
    ]
  },

  scaling: {
    question: "Does your dataset contain significant outliers that you haven't removed?",
    tip: "Tip: Distance-based models (KNN, SVM, K-Means) and regularized models are highly sensitive to feature scaling.",
    options: [
      { text: "Yes, many outliers are present", result: "robust-scaler" },
      { text: "No, data is relatively clean of outliers", next: "scaling_no_outliers" }
    ]
  },
  scaling_no_outliers: {
    question: "Do you need your values bounded strictly between 0 and 1 (e.g. for image data or neural networks)?",
    tip: "Tip: StandardScaler preserves distribution variance around 0, while MinMaxScaler squeezes everything into [0, 1].",
    options: [
      { text: "Yes, strict boundary [0, 1] is needed", result: "min-max-scaler" },
      { text: "No, normal bell-curve centering is fine", result: "standard-scaler" }
    ]
  },

  missing: {
    question: "What is the missingness level and columns affected in your dataset?",
    tip: "Tip: If missing data is very small (<5%), dropping rows (CCA) is standard. Otherwise, we must impute or flag.",
    options: [
      { text: "Very low missingness (< 5% of rows, random across columns)", result: "cca" },
      { text: "Numerical features with higher missingness", next: "missing_num" },
      { text: "Categorical features with higher missingness", next: "missing_cat" },
      { text: "I want to explicitly track missingness as a model feature", result: "missing-indicator" }
    ]
  },
  missing_num: {
    question: "Are the values Missing Completely at Random (MCAR)?",
    tip: "Tip: If missingness is not random (e.g. low-income people not reporting salary), dropping or simple imputation creates bias. Use MICE.",
    options: [
      { text: "Yes (Missingness is random, e.g. sensor glitched randomly)", next: "missing_num_random" },
      { text: "No (Missingness carries meaning, e.g. wealthy people not detailing income)", result: "iterative-imputer" }
    ]
  },
  missing_num_random: {
    question: "Do you want a simple fast baseline, or a statistical model preservation?",
    tip: "Tip: Mean/Median imputation is fast but crushes feature variance. KNN Imputer uses neighborhood matching to preserve shapes.",
    options: [
      { text: "Simple and fast (replace with median)", result: "mean-median-imputer" },
      { text: "Model-based imputation (preserves variance via KNN nearest neighbors)", result: "knn-imputer" }
    ]
  },
  missing_cat: {
    question: "Is the missingness ratio very low (< 5%)?",
    tip: "Tip: Mode imputation is safe for low missingness. If high, flagging missingness as a new category ('Missing') prevents bias.",
    options: [
      { text: "Yes, very few missing entries (fill with most frequent value)", result: "missing-categorical-imputer" },
      { text: "No, there is high missingness (treat as a separate category 'Missing')", result: "missing-categorical-imputer" }
    ]
  },

  model: {
    question: "What is your target output variable type?",
    tip: "Tip: Predicting continuous numbers (prices, scores) is Regression. Predicting discrete categories (Yes/No, labels) is Classification.",
    options: [
      { text: "Continuous Numerical (Regression, e.g. predicting house price)", next: "model_reg" },
      { text: "Categorical / Classes (Classification, e.g. spam/not-spam)", next: "model_clf" }
    ]
  },
  model_reg: {
    question: "Is the relationship between your features and target linear?",
    tip: "Tip: Simple linear models have strict assumptions (e.g. homoscedasticity). Non-linear models can fit complex shapes natively.",
    options: [
      { text: "Yes, linear relationship is expected (check OLS assumptions)", next: "model_reg_linear" },
      { text: "No, non-linear relationships exist", next: "model_reg_non_linear" }
    ]
  },
  model_reg_linear: {
    question: "Do you need to check standard OLS assumptions first, fit standard OLS, or apply regularization?",
    tip: "Tip: Multicollinearity collapses linear coefficients. Regularization (Ridge/Lasso/ElasticNet) penalizes weights to prevent overfitting.",
    options: [
      { text: "Check standard linear regression assumptions (collinearity, homoscedasticity)", result: "linear-assumptions" },
      { text: "Fit standard multiple linear regression", result: "linear-regression" },
      { text: "Apply L2 regularization (penalize large coefficients - Ridge)", result: "ridge-regression" },
      { text: "Apply L1 regularization (force coefficients to zero for feature selection - Lasso)", result: "lasso-regression" },
      { text: "Apply combined L1 & L2 regularization (ElasticNet)", result: "elasticnet-regression" }
    ]
  },
  model_reg_non_linear: {
    question: "What is your main priority for non-linear regression?",
    tip: "Tip: Polynomial regression adds curved features to a linear model. Tree models split on boundaries. Ensembles give high performance.",
    options: [
      { text: "Model curved relations using a linear model with polynomial features", result: "polynomial-regression" },
      { text: "Highly interpretable tree structure (simple splits)", result: "decision-tree" },
      { text: "Maximum margins / hyperplane-based regression (SVR)", result: "svm" },
      { text: "High-accuracy ensemble (Random Forest)", result: "random-forest" }
    ]
  },
  model_clf: {
    question: "Do you require well-calibrated class probability scores, or do you need to optimize Logistic Regression parameters?",
    tip: "Tip: Calibrated probabilities let you tune thresholds. Optimization lets you choose solvers and penalties.",
    options: [
      { text: "Yes, I need to know the probability of predictions (Binary or Multiclass)", next: "model_clf_prob" },
      { text: "No, raw classification or fast prediction is fine", next: "model_clf_hard" },
      { text: "I am using Logistic Regression and need to optimize solvers/penalties", result: "logistic-hyperparameters" }
    ]
  },
  model_clf_prob: {
    question: "How many target classes do you have?",
    tip: "Tip: Multiclass targets (e.g. Red vs Green vs Blue) run logits through Softmax to normalize probability outputs.",
    options: [
      { text: "Exactly two classes (Binary Classification)", result: "logistic-regression" },
      { text: "More than two classes (Multiclass classification via Softmax)", result: "softmax-regression" }
    ]
  },
  model_clf_hard: {
    question: "What characteristics does your dataset have?",
    tip: "Tip: Text features are high-dimensional, sparse, and conditional (Naive Bayes). Tabular data benefits from boosting (XGBoost).",
    options: [
      { text: "High-dimensional text data (Naive Bayes)", result: "naive-bayes" },
      { text: "General tabular data, want high accuracy ensemble (XGBoost / Boosting)", next: "boosting_choice" },
      { text: "Small dataset, want distance-based classifications (KNN)", result: "knn-classifier" },
      { text: "Want decision tree visualization helper tools", result: "dtreeviz" }
    ]
  },
  boosting_choice: {
    question: "Which ensemble technique fits your requirements?",
    tip: "Tip: Voting averages models, Bagging reduces variance, Boosting sequentially reduces bias, and Stacking fits a meta-model.",
    options: [
      { text: "Standard Random Forest (Bagging ensemble)", result: "random-forest" },
      { text: "Extreme Gradient Boosting (XGBoost - state-of-the-art tabular)", result: "xgboost" },
      { text: "Adaptive Boosting (AdaBoost - sequential weight adjustments)", result: "adaboost" },
      { text: "Gradient Boosting (GBM - fits trees to residuals)", result: "gradient-boosting" },
      { text: "General Bagging (Bag any estimator, e.g. Bagged KNN)", result: "bagging-ensemble" },
      { text: "Voting Ensemble (Simple majority/average of diverse estimators)", result: "voting-ensemble" },
      { text: "Stacking Ensemble (Train a meta-model on predictions of base estimators)", result: "stacking" }
    ]
  },

  unsupervised: {
    question: "What is your unsupervised learning objective?",
    tip: "Tip: PCA acts on dimensions, while Clustering acts on grouping row observations.",
    options: [
      { text: "Reduce dimensions / remove multicollinearity", result: "pca" },
      { text: "Group similar data points (Clustering)", next: "clustering" }
    ]
  },
  clustering: {
    question: "Do you know the number of clusters in advance, or do clusters have arbitrary shapes?",
    tip: "Tip: K-Means assumes spherical shapes and needs 'K'. DBSCAN groups continuous dense areas and filters noise.",
    options: [
      { text: "Clusters are spherical, and I can guess/determine 'K'", result: "kmeans" },
      { text: "Clusters have arbitrary shapes and contains noise", result: "dbscan" }
    ]
  }
};

// 6. INTERACTIVE DIAGNOSTIC QUESTIONS DATABASE
const DIAGNOSTIC_DB = {
  "standard-scaler": [
    {
      q: "Are you applying this scaling to target variables (y) as well as features (X)?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Target variables generally do not need scaling in classical ML regression. It makes output predictions and coefficients extremely hard to interpret in original units.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Correct. Scale features (X) to speed up gradient descent and help distance calculations, but leave y in its original units.", severity: "safe" }
      ]
    },
    {
      q: "Are you fitting the scaler on the entire dataset *before* performing train_test_split?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>CRITICAL WARNING (DATA LEAKAGE)</b>: Fitting on the entire dataset calculates the global mean and std, leaking information from the test set into training. Always run <code>scaler.fit(X_train)</code> and then <code>scaler.transform(X_train)</code> and <code>scaler.transform(X_test)</code>.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Perfect! Fitting only on <code>X_train</code> prevents validation-data leakage.", severity: "safe" }
      ]
    },
    {
      q: "Is your destination model tree-based (Decision Trees, Random Forests, XGBoost)?",
      options: [
        { text: "Yes", isTrap: false, feedback: "💡 <b>PRO-TIP</b>: Tree-based models split on thresholds and are scale-invariant. You can skip feature scaling entirely to reduce pipeline complexity!", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Distance-based models (KNN, SVM) and gradient-descent models (Linear, Neural Nets) are highly sensitive to scales, so scaling is mandatory here.", severity: "safe" }
      ]
    }
  ],
  "min-max-scaler": [
    {
      q: "Does your dataset contain significant outliers that you haven't handled?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: MinMaxScaler is extremely sensitive to outliers. A single extreme value will compress all regular values into a tiny range, destroying feature variance. Use <code>RobustScaler</code> instead!", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Safe. Since there are no outliers, MinMaxScaler will scale your data evenly across [0, 1].", severity: "safe" }
      ]
    },
    {
      q: "Are you using a model that requires strictly bounded inputs (e.g., Image pixels or Neural Network inputs)?",
      options: [
        { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Perfect. MinMaxScaler is ideal for bounds-restricted models.", severity: "safe" },
        { text: "No", isTrap: false, feedback: "💡 <b>PRO-TIP</b>: If strict bounding is not required and data is normally distributed, <code>StandardScaler</code> is usually preferred for classical algorithms.", severity: "warning" }
      ]
    }
  ],
  "robust-scaler": [
    {
      q: "Are you using this to 'remove' outliers from the dataset?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: RobustScaler does NOT remove outliers. It only prevents outliers from distorting the scaling factor (median and IQR). The outliers remain in the scaled data. If you want to remove them, use IQR or Z-score outlier trimming first.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Correct! RobustScaler scales the normal data properly while keeping outliers intact.", severity: "safe" }
      ]
    }
  ],
  "smote": [
    {
      q: "Are you applying SMOTE to the entire dataset *before* performing train-test split or cross-validation?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>CRITICAL WARNING (DATA LEAKAGE)</b>: Generating synthetic points on the whole dataset leaks information. The synthetic test points will be highly correlated with training points, leading to inflated, fake accuracy scores. Apply SMOTE *only* on the training set!", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Excellent! Keeping the test set completely pure ensures realistic metric evaluation.", severity: "safe" }
      ]
    },
    {
      q: "Are you using Accuracy as your primary metric to evaluate performance?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Accuracy is highly misleading for imbalanced data. A dummy model predicting the majority class can get 99% accuracy on a 1% imbalanced set. Use <b>F1-Score</b>, <b>Precision-Recall AUC</b>, or <b>ROC-AUC</b> instead.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Correct. F1, Precision, and Recall are much more robust metrics for minority classes.", severity: "safe" }
      ]
    },
    {
      q: "Did you try class-weight tuning (e.g., class_weight='balanced') first?",
      options: [
        { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Great! It is always a good practice to test class-weighting as a lightweight, faster baseline before generating synthetic points.", severity: "safe" },
        { text: "No", isTrap: false, feedback: "💡 <b>PRO-TIP</b>: Many scikit-learn models (LogisticRegression, RandomForest, SVC) have a <code>class_weight='balanced'</code> parameter. It scales the loss function directly, which is faster and doesn't generate artificial points.", severity: "warning" }
      ]
    }
  ],
  "one-hot-encoder": [
    {
      q: "Is your destination model a Linear Regression or Logistic Regression model?",
      options: [
        { text: "Yes", isTrap: false, feedback: "💡 <b>PRO-TIP</b>: Linear models suffer from multicollinearity. Make sure to set <code>drop='first'</code> to drop the reference category and avoid the 'Dummy Variable Trap'.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Non-linear models like trees do not suffer from the dummy variable trap, so dropping the first category is optional.", severity: "safe" }
      ]
    },
    {
      q: "Does your categorical column have more than 15 unique values (high cardinality)?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED (CURSE OF DIMENSIONALITY)</b>: One-hot encoding high-cardinality features (like Zip Code, City, Job Title) creates dozens or hundreds of sparse columns. This slows training and leads to overfitting. Consider <code>TargetEncoder</code> or frequency encoding.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Low cardinality features work beautifully with One-Hot encoding.", severity: "safe" }
      ]
    }
  ],
  "log-transformer": [
    {
      q: "Does your column contain zero or negative values?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>CRITICAL WARNING (NaN/INF ERROR)</b>: Standard log <code>np.log(x)</code> will output <code>-inf</code> for 0, and <code>NaN</code> for negative values. If you have zeros, use <code>np.log1p(x)</code> (adds 1 first) or Yeo-Johnson transform.", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Clean. Strictly positive values are safe for standard Log transformation.", severity: "safe" }
      ]
    }
  ],
  "pca": [
    {
      q: "Did you scale your data with StandardScaler before running PCA?",
      options: [
        { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Correct! PCA finds directions of maximum variance. If features are on different scales, the feature with the larger scale will dominate.", severity: "safe" },
        { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Scaling is mandatory for PCA. Otherwise, components will align purely with the features that have the largest raw numerical range.", severity: "danger" }
      ]
    },
    {
      q: "Is interpretability of features critical for your business stakeholders?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: PCA components are linear combinations of all original features, making them hard to interpret individually. If you need clean business explanations, consider feature selection methods (L1/Lasso, VIF, or mutual info) instead.", severity: "warning" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: PCA is excellent when you only care about prediction performance and removing multicollinearity.", severity: "safe" }
      ]
    }
  ],
  "linear-regression": [
    {
      q: "Have you checked your data for multicollinearity (using VIF or correlation matrices)?",
      options: [
        { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Excellent! Multicollinearity inflates coefficient variances, making model weights unstable.", severity: "safe" },
        { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Highly correlated features confuse OLS regression. Check VIF (Variance Inflation Factor); if VIF > 5, drop one of the correlated features or use Ridge/Lasso regularization.", severity: "warning" }
      ]
    }
  ],
  "kmeans": [
    {
      q: "Did you perform feature scaling before running clustering?",
      options: [
        { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Perfect! Clustering relies on distances (Euclidean). Scaling ensures all features contribute equally.", severity: "safe" },
        { text: "No", isTrap: true, feedback: "⚠️ <b>CRITICAL WARNING</b>: Clustering without scaling is highly distorted. Features with larger ranges will dominate the cluster boundaries completely.", severity: "danger" }
      ]
    }
  ],
  "knn-imputer": [
    {
      q: "Are your columns on vastly different numeric scales?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: KNN Imputer uses Euclidean distance to find the nearest neighbors. If features aren't scaled, features with larger ranges will dominate. Apply scaling first!", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Safe.", severity: "safe" }
      ]
    }
  ],
  "pipelines": [
    {
      q: "Are you performing cross-validation (e.g. cross_val_score) manually?",
      options: [
        { text: "Yes", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: If you do preprocessing manually and then pass the data to cross_val_score, you will have data leakage across folds. Wrap your preprocessing steps and model in a scikit-learn Pipeline and pass the pipeline to cross_val_score!", severity: "danger" },
        { text: "No", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Excellent! Using Pipelines avoids manual leaks and makes deployment code much cleaner.", severity: "safe" }
      ]
    }
  ]
};

const GENERAL_DIAGNOSTICS = [
  {
    q: "Are you validating your ML pipeline using a pure, untouched test set?",
    options: [
      { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Great! Holding out an untouched test set prevents overfitting evaluation bias.", severity: "safe" },
      { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Evaluating on training data creates severe optimistic bias. Always split your data into Train, Validation, and Test sets.", severity: "danger" }
    ]
  },
  {
    q: "Are you checking for missing values (NaNs) before training the model?",
    options: [
      { text: "Yes", isTrap: false, feedback: "✅ <b>SAFE PASSAGE</b>: Perfect! Preprocessing missingness avoids scikit-learn fit errors.", severity: "safe" },
      { text: "No", isTrap: true, feedback: "⚠️ <b>TRAP DETECTED</b>: Most scikit-learn models will crash if passed data containing NaNs. Ensure you run an Imputer (like MeanMedianImputer or KNNImputer) or drop missing values.", severity: "warning" }
    ]
  }
];

// State for active diagnostic check
let activeDiagnosticQuestions = [];
let activeDiagnosticAnswers = {};

function initWizard() {
  wizardRestartBtn.addEventListener('click', restartWizard);
  wizardBackBtn.addEventListener('click', handleWizardBack);
  renderWizardNode();
}

function renderWizardNode() {
  const node = WIZARD_NODES[currentWizardNode];
  if (!node) return;
  
  // Show tip if present, otherwise hide
  const tipContainer = document.getElementById('wizard-tip');
  const tipText = document.getElementById('wizard-tip-text');
  if (node.tip) {
    tipText.innerText = node.tip;
    tipContainer.style.display = 'flex';
  } else {
    tipContainer.style.display = 'none';
  }
  
  let progress = 25;
  if (currentWizardNode === 'start') progress = 25;
  else if (['prep', 'model', 'unsupervised'].includes(currentWizardNode)) progress = 50;
  else if (['missing', 'scaling', 'outliers', 'model_reg', 'model_clf', 'clustering', 'encoding', 'transforms', 'boosting_choice', 'pipelines_choice'].includes(currentWizardNode)) progress = 75;
  else progress = 90;
  
  wizardProgressFill.style.width = `${progress}%`;
  
  if (wizardHistory.length > 0) {
    wizardBackBtn.style.visibility = 'visible';
  } else {
    wizardBackBtn.style.visibility = 'hidden';
  }
  
  let optionsHtml = '';
  
  node.options.forEach(opt => {
    if (opt.next) {
      optionsHtml += `
        <button class="option-btn" onclick="advanceWizard('${opt.next}')">
          <span>${opt.text}</span>
          <i data-lucide="chevron-right"></i>
        </button>
      `;
    } else if (opt.result) {
      optionsHtml += `
        <button class="option-btn" onclick="showWizardResult('${opt.result}')">
          <span>${opt.text}</span>
          <i data-lucide="check"></i>
        </button>
      `;
    }
  });
  
  questionBox.innerHTML = `
    <h3 class="question-title">${node.question}</h3>
    <div class="options-list">
      ${optionsHtml}
    </div>
  `;
  
  lucide.createIcons();
}

window.advanceWizard = function(nextNodeId) {
  wizardHistory.push(currentWizardNode);
  currentWizardNode = nextNodeId;
  renderWizardNode();
};

window.showWizardResult = function(techId) {
  const tech = TECHNIQUES_DB.find(t => t.id === techId);
  if (!tech) return;
  
  // Hide tip when showing result
  document.getElementById('wizard-tip').style.display = 'none';
  
  wizardProgressFill.style.width = '100%';
  
  questionBox.innerHTML = `
    <div class="result-box">
      <div class="result-icon">
        <i data-lucide="award"></i>
      </div>
      <h3>Recommended: ${tech.name}</h3>
      <p>${tech.intuition.split('\n')[0]}</p>
      
      <!-- Interactive Pipeline Integrity check -->
      <div class="integrity-container">
        <div class="integrity-header">
          <div class="integrity-title">
            <i data-lucide="shield-check" style="color: var(--success); width: 20px; height: 20px;"></i>
            <span>🧠 Pipeline Integrity Check</span>
          </div>
          <span class="integrity-score-badge badge-score-secure" id="integrity-badge">100% SECURE</span>
        </div>
        <div class="integrity-meter-bg">
          <div class="integrity-meter-fill" id="integrity-meter-fill" style="width: 100%;"></div>
        </div>
        <div class="diagnostic-quiz-section" id="diagnostic-quiz-section">
          <!-- Populated dynamically -->
        </div>
      </div>
      
      <!-- Key Considerations & Feedback block (Dynamically populated from Database Best Practices) -->
      <div class="result-considerations-card" style="text-align: left; margin: 16px 0; background-color: rgba(255,255,255,0.01); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; width: 100%; box-shadow: var(--card-shadow);">
        <h4 style="color: var(--warning); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">
          <i data-lucide="alert-triangle" style="width:16px; height:16px;"></i> Key Considerations & Feedback
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${(tech.bestPractices || []).map(bp => `
            <li style="position: relative; padding-left: 20px; font-size: 0.88rem; line-height: 1.4; color: var(--text-muted);">
              <span style="position: absolute; left: 0; color: var(--warning);">•</span>
              ${bp}
            </li>
          `).join('')}
        </ul>
      </div>
      
      <div style="display:flex; gap:12px; margin-top:10px;">
        <button class="btn btn-primary" onclick="openDrawer('${tech.id}')">
          <i data-lucide="book-open"></i> Read details & Get Code
        </button>
        <button class="btn btn-secondary" onclick="restartWizard()">
          <i data-lucide="rotate-ccw"></i> Try Again
        </button>
      </div>
    </div>
  `;
  
  // Render the quiz questions
  renderDiagnosticQuiz(tech.id);
  lucide.createIcons();
};

window.renderDiagnosticQuiz = function(techId) {
  const quizSection = document.getElementById('diagnostic-quiz-section');
  if (!quizSection) return;

  // Find questions or default
  let questions = DIAGNOSTIC_DB[techId] || GENERAL_DIAGNOSTICS;
  activeDiagnosticQuestions = questions;
  activeDiagnosticAnswers = {}; // Reset answers

  let html = '';
  questions.forEach((q, idx) => {
    let optionsHtml = q.options.map((opt, optIdx) => {
      return `
        <button class="diag-btn" id="diag-btn-${idx}-${optIdx}" onclick="selectDiagnosticAnswer('${techId}', ${idx}, ${optIdx})">
          ${opt.text}
        </button>
      `;
    }).join('');

    html += `
      <div class="diagnostic-item" id="diagnostic-item-${idx}">
        <div class="diagnostic-question-text">${idx + 1}. ${q.q}</div>
        <div class="diagnostic-options">
          ${optionsHtml}
        </div>
        <div class="diag-feedback-container" id="diag-feedback-${idx}" style="display: none; margin-top: 10px;"></div>
      </div>
    `;
  });

  quizSection.innerHTML = html;
};

window.selectDiagnosticAnswer = function(techId, qIdx, optIdx) {
  // Guard if already answered
  if (activeDiagnosticAnswers[qIdx] !== undefined) return;

  // Save selection
  activeDiagnosticAnswers[qIdx] = optIdx;

  const question = activeDiagnosticQuestions[qIdx];
  const selectedOpt = question.options[optIdx];
  
  // Highlight clicked button and disable all buttons in this question group
  question.options.forEach((opt, oIdx) => {
    const btn = document.getElementById(`diag-btn-${qIdx}-${oIdx}`);
    if (btn) {
      btn.disabled = true;
      if (oIdx === optIdx) {
        if (selectedOpt.isTrap) {
          btn.classList.add('selected-trap');
          btn.innerHTML += ` <i data-lucide="alert-triangle" style="width:14px; height:14px; margin-left:4px;"></i>`;
        } else {
          btn.classList.add('selected-yes');
          btn.innerHTML += ` <i data-lucide="check" style="width:14px; height:14px; margin-left:4px;"></i>`;
        }
      } else {
        btn.classList.add('selected-no');
      }
    }
  });

  // Display feedback card
  const feedbackContainer = document.getElementById(`diag-feedback-${qIdx}`);
  if (feedbackContainer) {
    let cardClass = 'feedback-safe';
    let iconName = 'check-circle';
    if (selectedOpt.severity === 'danger') {
      cardClass = 'feedback-danger';
      iconName = 'x-circle';
    } else if (selectedOpt.severity === 'warning') {
      cardClass = 'feedback-warning';
      iconName = 'alert-circle';
    }
    
    feedbackContainer.innerHTML = `
      <div class="diag-feedback-card ${cardClass}">
        <i data-lucide="${iconName}"></i>
        <div>${selectedOpt.feedback}</div>
      </div>
    `;
    feedbackContainer.style.display = 'block';
  }

  // Update Integrity Score
  updateIntegrityScore();
  lucide.createIcons();
};

function updateIntegrityScore() {
  const badge = document.getElementById('integrity-badge');
  const meterFill = document.getElementById('integrity-meter-fill');
  if (!badge || !meterFill) return;

  let trapsTriggered = 0;
  
  // Calculate total questions and traps
  Object.keys(activeDiagnosticAnswers).forEach(qIdx => {
    const optIdx = activeDiagnosticAnswers[qIdx];
    const option = activeDiagnosticQuestions[qIdx].options[optIdx];
    if (option && option.isTrap) {
      trapsTriggered++;
    }
  });

  // Each trap reduces score by 30%
  let score = Math.max(10, 100 - (trapsTriggered * 30));

  meterFill.style.width = `${score}%`;

  if (score >= 90) {
    badge.innerText = `${score}% SECURE`;
    badge.className = 'integrity-score-badge badge-score-secure';
    meterFill.style.backgroundColor = 'var(--success)';
  } else if (score >= 60) {
    badge.innerText = `${score}% VULNERABLE`;
    badge.className = 'integrity-score-badge badge-score-warning';
    meterFill.style.backgroundColor = 'var(--warning)';
  } else {
    badge.innerText = `${score}% COMPROMISED`;
    badge.className = 'integrity-score-badge badge-score-danger';
    meterFill.style.backgroundColor = 'var(--danger)';
  }
}

function handleWizardBack() {
  if (wizardHistory.length > 0) {
    currentWizardNode = wizardHistory.pop();
    renderWizardNode();
  }
}

function restartWizard() {
  wizardHistory = [];
  currentWizardNode = 'start';
  renderWizardNode();
}

// 7. Theme Toggle
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeText = document.getElementById('theme-text');
  
  if (!themeToggleBtn) return;
  
  // Check localStorage for saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeUI(true);
  } else {
    updateThemeUI(false);
  }
  
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeUI(isLight);
  });
  
  function updateThemeUI(isLight) {
    const iconContainer = document.getElementById('theme-icon-container');
    if (!iconContainer) return;
    
    if (isLight) {
      iconContainer.innerHTML = `<i data-lucide="moon" id="theme-icon"></i>`;
      themeText.innerText = 'Dark Mode';
    } else {
      iconContainer.innerHTML = `<i data-lucide="sun" id="theme-icon"></i>`;
      themeText.innerText = 'Light Mode';
    }
    lucide.createIcons();
  }
}
