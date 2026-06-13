// Expanded Machine Learning Techniques Database - CampusX 100 Days of ML
// Includes 52 distinct techniques/topics matching course videos and local notebooks.
const TECHNIQUES_DB = [
  // CATEGORY: FEATURE SCALING
  {
    id: "standard-scaler",
    name: "Standardization (StandardScaler)",
    category: "scaling",
    categoryName: "Feature Scaling",
    videoRef: "24 Feature Scaling - Standardization ｜ Day 24 ｜ 100 Days of Machine Learning [1Yw9sC0PNwY].mp4",
    videoNum: "24",
    notebookPath: "Code/day24-standardization/day24.ipynb",
    subtopics: ["Centering", "Variance Scaling", "Z-Score", "Gaussian Distribution assumptions"],
    intuition: "Centers the distribution of each feature to have a mean of 0 and standard deviation of 1. It scales features by subtracting the mean and dividing by the standard deviation:\n\n    z = (x - μ) / σ\n\nThis transformation does not change the shape of the original distribution (e.g., if the feature was skewed, it remains skewed). It simply shifts the center to 0 and scales the width to unit variance.",
    advantages: [
      "Crucial for algorithms assuming normally distributed data.",
      "Maintains the shape of the original distribution (no range compression).",
      "Essential for distance-based models (KNN, SVM) and gradient descent-based models (Linear/Logistic Regression, Neural Networks)."
    ],
    disadvantages: [
      "Does not bound values to a specific range (values can go from -infinity to +infinity).",
      "Mean and standard deviation are heavily influenced by extreme outliers, meaning outliers can skew the scaling results."
    ],
    bestPractices: [
      "Fit the scaler ONLY on the training set (scaler.fit(X_train)) and then transform both train and test sets to avoid data leakage.",
      "Do not apply to sparse data matrices (use MaxAbsScaler instead) as subtracting the mean will destroy the sparsity (turns zeros into non-zeros)."
    ],
    code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)`
  },
  {
    id: "min-max-scaler",
    name: "Normalization (MinMaxScaler)",
    category: "scaling",
    categoryName: "Feature Scaling",
    videoRef: "25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4",
    videoNum: "25",
    notebookPath: "Code/day25-normalization/day25.ipynb",
    subtopics: ["Bounding ranges", "Min-Max boundaries", "Non-Gaussian scaling"],
    intuition: "Scales features to a fixed range, typically [0, 1] or [-1, 1]. It subtracts the minimum value and divides by the range:\n\n    x_scaled = (x - x_min) / (x_max - x_min)\n\nThis is useful when the distribution is not normal and the model requires bounded values.",
    advantages: [
      "Bounds values to a strict range, making it highly useful for neural networks (e.g., scaling image pixels from 0-255 to 0-1).",
      "Preserves zero values in sparse datasets (when scaling to [0, 1])."
    ],
    disadvantages: [
      "Extremely sensitive to outliers. A single extreme outlier will compress the normal values into a very tiny range, destroying feature variance."
    ],
    bestPractices: [
      "Use when you know features do not follow a Gaussian distribution and are bounded (like coordinates, percentages, or RGB data).",
      "Avoid if data contains unaddressed outliers."
    ],
    code: `from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler(feature_range=(0, 1))
X_train_norm = scaler.fit_transform(X_train)
X_test_norm = scaler.transform(X_test)`
  },
  {
    id: "robust-scaler",
    name: "Robust Scaling (RobustScaler)",
    category: "scaling",
    categoryName: "Feature Scaling",
    videoRef: "25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4",
    videoNum: "25",
    notebookPath: "Code/day25-normalization/day25.ipynb",
    subtopics: ["Median centering", "IQR scaling", "Outlier resilience"],
    intuition: "Scales features using statistics that are robust to outliers. It subtracts the median and divides by the Interquartile Range (IQR = Q3 - Q1):\n\n    x_scaled = (x - Median) / IQR\n\nBy using median and quartiles, outliers do not affect the centering or scaling factors.",
    advantages: [
      "Outliers do not influence the scaling factors (median and IQR are robust statistics).",
      "Excellent default scaler when features have significant, unremoved outliers."
    ],
    disadvantages: [
      "Scaled values are not bounded to a strict range.",
      "Outliers are preserved in the scaled dataset (they are not removed or clipped, just scaled robustly)."
    ],
    bestPractices: [
      "Use as your default scaler when your dataset has outliers that you cannot drop and you plan to use an outlier-sensitive model like KNN."
    ],
    code: `from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)`
  },
  {
    id: "max-abs-scaler",
    name: "MaxAbs Scaling (MaxAbsScaler)",
    category: "scaling",
    categoryName: "Feature Scaling",
    videoRef: "25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4",
    videoNum: "25",
    notebookPath: "Code/day25-normalization/day25.ipynb",
    subtopics: ["Maximum absolute value", "Sparse matrix scaling", "Zero-centering preservation"],
    intuition: "Scales each feature by dividing by its maximum absolute value:\n\n    x_scaled = x / |x_max|\n\nThis maps values into the range [-1, 1]. It does not shift/center the data, which preserves zero values.",
    advantages: [
      "Does not destroy sparsity in sparse matrices because it does not subtract a mean.",
      "Very fast and computationally trivial."
    ],
    disadvantages: [
      "Highly sensitive to outliers (similar to MinMaxScaler)."
    ],
    bestPractices: [
      "Use when processing sparse matrices (e.g., text TF-IDF matrices or sparse bag-of-words) that need scaling without blowing up memory."
    ],
    code: `from sklearn.preprocessing import MaxAbsScaler

scaler = MaxAbsScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)`
  },

  // CATEGORY: CATEGORICAL ENCODING
  {
    id: "ordinal-encoder",
    name: "Ordinal Encoding (OrdinalEncoder)",
    category: "encoding",
    categoryName: "Categorical Encoding",
    videoRef: "26 Encoding Categorical Data ｜ Ordinal Encoding ｜ Label Encoding [w2GglmYHfmM].mp4",
    videoNum: "26",
    notebookPath: "Code/day26-ordinal-encoding/day26.ipynb",
    subtopics: ["Rank representation", "Ordinal vs Nominal", "LabelEncoder differences"],
    intuition: "Converts ordered categorical variables into integer values (0, 1, 2...) based on a specific, user-defined order. It maps categories to numbers while preserving their mathematical hierarchy.",
    advantages: [
      "Preserves the natural rank/order of the categories.",
      "Keeps the feature space compact (does not create multiple columns)."
    ],
    disadvantages: [
      "Inappropriate for nominal features. If applied to nominal data, models will assume a false order of categories (e.g., city codes)."
    ],
    bestPractices: [
      "Always explicitly define the hierarchy using the `categories` argument. Do not let scikit-learn sort them alphabetically.",
      "Use LabelEncoder ONLY for the target variable (y). For input features (X), always use OrdinalEncoder."
    ],
    code: `from sklearn.preprocessing import OrdinalEncoder

# Define explicit rank hierarchy
education_levels = ['High School', 'Bachelors', 'Masters', 'PhD']
encoder = OrdinalEncoder(categories=[education_levels])

X_train_encoded = encoder.fit_transform(X_train[['education']])`
  },
  {
    id: "one-hot-encoder",
    name: "One-Hot Encoding (OneHotEncoder)",
    category: "encoding",
    categoryName: "Categorical Encoding",
    videoRef: "27 One Hot Encoding ｜ Handling Categorical Data ｜ Day 27 ｜ 100 Days of Machine Learning [U5oCv3JKWKA].mp4",
    videoNum: "27",
    notebookPath: "Code/day27-one-hot-encoding/day27.ipynb",
    subtopics: ["Dummy variables", "Nominal features", "Dummy Variable Trap", "Multicollinearity"],
    intuition: "Converts categorical features into multiple binary columns (dummy variables), where 1 indicates presence and 0 indicates absence. For a feature with C categories, it creates C columns (or C-1 columns if the first is dropped).",
    advantages: [
      "Perfect for nominal variables (no natural order, e.g., Country, Color).",
      "Prevents models from assuming false relationships between nominal categories."
    ],
    disadvantages: [
      "Creates high-dimensional sparse representations (curse of dimensionality) if features have high cardinality.",
      "Introduces multicollinearity (the Dummy Variable Trap), which must be handled in linear models."
    ],
    bestPractices: [
      "Set `drop='first'` to drop the first category, resolving the dummy variable trap in linear models.",
      "Set `handle_unknown='ignore'` when using inside a Pipeline to ensure the model doesn't crash on unseen test categories (Note: `drop` and `handle_unknown='ignore'` cannot be used together, choose based on model type)."
    ],
    code: `from sklearn.preprocessing import OneHotEncoder

# Set sparse_output=False (modern replacement for sparse=False in older sklearn)
ohe = OneHotEncoder(drop='first', sparse_output=False)
X_train_ohe = ohe.fit_transform(X_train[['city']])`
  },
  {
    id: "target-encoder",
    name: "Target Encoding (TargetEncoder)",
    category: "encoding",
    categoryName: "Categorical Encoding",
    videoRef: "27 One Hot Encoding ｜ Handling Categorical Data ｜ Day 27 ｜ 100 Days of Machine Learning [U5oCv3JKWKA].mp4",
    videoNum: "27",
    notebookPath: "",
    subtopics: ["High Cardinality Encoding", "Mean Encoding", "Target-based encoding", "Modern scikit-learn updates"],
    intuition: "Replaces each category value with the mean of the target variable for that category. To prevent severe overfitting (target leakage), scikit-learn uses a smoothed mean incorporating the global target mean and cross-fitting.",
    advantages: [
      "Extremely effective for high-cardinality features (e.g., Zip Codes, Device IDs) because it represents them in a single column without expanding dimensions.",
      "Directly captures the correlation between categorical values and the target."
    ],
    disadvantages: [
      "Highly prone to overfitting (target leakage) if smoothing and cross-fitting are not applied.",
      "Cannot represent categories that were not present in the training set well."
    ],
    bestPractices: [
      "Use scikit-learn's built-in `TargetEncoder` (added in version 1.2), which uses cross-fitting and shrinkage to automatically handle smoothing and prevent data leakage."
    ],
    code: `# Available in scikit-learn >= 1.2
from sklearn.preprocessing import TargetEncoder

encoder = TargetEncoder(smooth="auto", cv=5)
X_train_encoded = encoder.fit_transform(X_train[['zip_code']], y_train)`
  },

  // CATEGORY: FEATURE TRANSFORMERS & PIPELINES
  {
    id: "column-transformer",
    name: "Column Transformer (ColumnTransformer)",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "28 Column Transformer in Machine Learning ｜ How to use ColumnTransformer in Sklearn [5TVj6iEBR4I].mp4",
    videoNum: "28",
    notebookPath: "Code/day28-column-transformer/day28.ipynb",
    subtopics: ["Parallel preprocessing", "Column subsets", "Passthrough and drop"],
    intuition: "Enables applying different preprocessing steps (scaling, encoding, imputing) to different subsets/columns of your dataset in parallel, combining the outputs into a single NumPy array or DataFrame.",
    advantages: [
      "Consolidates feature-specific preprocessing into a single scikit-learn object.",
      "Prevents messy, manual coding where you split pandas DataFrames and merge them back.",
      "Crucial for building deployment-ready Scikit-Learn Pipelines."
    ],
    disadvantages: [
      "Drops pandas column names initially (outputs NumPy arrays, though modern scikit-learn supports `set_output(transform='pandas')`)."
    ],
    bestPractices: [
      "Use `remainder='passthrough'` to keep columns that do not need any transformation, or `remainder='drop'` to discard them.",
      "Call `ct.get_feature_names_out()` to inspect the names of the generated features."
    ],
    code: `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['age', 'fare']),
        ('cat', OneHotEncoder(drop='first'), ['gender', 'embarked'])
    ],
    remainder='passthrough'
)
X_train_processed = preprocessor.fit_transform(X_train)`
  },
  {
    id: "pipelines",
    name: "Scikit-Learn Pipelines (Pipeline)",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "29 Machine Learning Pipelines A-Z ｜ Day 29 ｜ 100 Days of Machine Learning [xOccYkgRV4Q].mp4",
    videoNum: "29",
    notebookPath: "Code/day29-sklearn-pipelines/titanic-using-pipeline.ipynb",
    subtopics: ["Sequential workflows", "Data leakage prevention", "Cross-validation integration"],
    intuition: "Chains multiple preprocessing steps and a final model estimator into a single, cohesive workflow. When calling `fit()`, it sequentially runs `fit_transform()` on all steps and `fit()` on the estimator. When calling `predict()`, it runs `transform()` on preprocessors and `predict()` on the estimator.",
    advantages: [
      "Completely prevents data leakage because preprocessing parameters are fit ONLY on the cross-validation/training folds.",
      "Simplifies model deployment: save a single pipeline pickle file, and your server can accept raw inputs.",
      "Enables grid-searching hyperparameters of both the preprocessors and the model together."
    ],
    disadvantages: [
      "Intermediate data states between steps cannot be easily inspected using standard pandas commands."
    ],
    bestPractices: [
      "Never do scaling or imputation outside a Pipeline. Group the preprocessor (ColumnTransformer) and model (estimator) inside a final Pipeline object."
    ],
    code: `from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# Combine preprocessing (ColumnTransformer) + model
clf = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier())
])

clf.fit(X_train, y_train)`
  },
  {
    id: "log-transformer",
    name: "Log Transformation",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "30 Function Transformer ｜ Log Transform ｜ Reciprocal Transform ｜ Square Root Transform [cTjj3LE8E90].mp4",
    videoNum: "30",
    notebookPath: "Code/day30-function-transformer/day30.ipynb",
    subtopics: ["Right-skewed data", "Logarithmic scaling", "np.log1p usage", "Skewness correction"],
    intuition: "Applies the mathematical logarithm to a feature: y = log(x) or log(x + 1). This pulls extreme values closer, compressing long right-skewed tails into a normal shape.",
    advantages: [
      "Highly effective at converting right-skewed distributions into symmetric/normal distributions.",
      "Helps linear models meet the assumption of homoscedasticity (constant variance of errors)."
    ],
    disadvantages: [
      "Cannot be applied to negative numbers or zero (log(0) is undefined).",
      "Reduces interpretability of the raw values (requires taking the exponent to interpret results)."
    ],
    bestPractices: [
      "Use `np.log1p(x)` which calculates `log(x + 1)`. This safely handles zero values in your data without returning negative infinity."
    ],
    code: `import numpy as np
from sklearn.preprocessing import FunctionTransformer

# Log(x + 1) transformer
log_transformer = FunctionTransformer(np.log1p)
X_train_log = log_transformer.fit_transform(X_train[['fare']])`
  },
  {
    id: "power-transformer",
    name: "Power Transformers (Box-Cox & Yeo-Johnson)",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "31 Power Transformer ｜ Box - Cox Transform ｜ Yeo - Johnson Transform [lV_Z4HbNAx0].mp4",
    videoNum: "31",
    notebookPath: "Code/day31-power-transformer/day31.ipynb",
    subtopics: ["Lambda search", "Variance stabilization", "Normalizing transformations"],
    intuition: "Applies parameter-based power transformations to stabilize variance and normalize data. Box-Cox works only on positive values; Yeo-Johnson supports zero and negative values.",
    advantages: [
      "Optimizes the transform parameters (lambda) automatically to force the feature as close to a normal distribution as possible.",
      "Extremely robust for preprocessing features in regression models."
    ],
    disadvantages: [
      "Computationally slower because it must numerically search for the optimal lambda parameter.",
      "Transforms are complex and difficult to explain or calculate manually."
    ],
    bestPractices: [
      "Use Yeo-Johnson by default, as real-world features often contain zeros or negative values (e.g., profit, temperature). Only use Box-Cox if you have strictly positive data (>0)."
    ],
    code: `from sklearn.preprocessing import PowerTransformer

# Automatically normalizes positive and negative data using Yeo-Johnson
pt = PowerTransformer(method='yeo-johnson')
X_train_norm = pt.fit_transform(X_train[['income', 'profit']])`
  },
  {
    id: "binning-discretization",
    name: "Binarization & Discretization (Binning)",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "32 Binning and Binarization ｜ Discretization ｜ Quantile Binning ｜ KMeans Binning [kKWsJGKcMvo].mp4",
    videoNum: "32",
    notebookPath: "Code/day32-binning-and-binarization/binarization.ipynb",
    subtopics: ["Uniform Binning", "Quantile Binning", "K-Means Binning", "Binarizer", "KBinsDiscretizer"],
    intuition: "Discretization splits continuous features into discrete intervals (bins). It can be uniform (equal width), quantile (equal frequency), or based on K-Means clusters. Binarization thresholds a feature into a binary value (0 or 1) based on a threshold.",
    advantages: [
      "Handles non-linear relationships in linear models by converting a continuous variable into categorical bins.",
      "Reduces the impact of minor noise and outliers."
    ],
    disadvantages: [
      "Discards granular quantitative information, converting a scale into blocks.",
      "Bin boundaries are arbitrary and can create edge-case issues."
    ],
    bestPractices: [
      "Use `KBinsDiscretizer` with `encode='ordinal'` or `encode='onehot'`. Select `strategy='quantile'` if you want bins with an equal number of points, or `strategy='uniform'` for equal-width intervals."
    ],
    code: `from sklearn.preprocessing import KBinsDiscretizer, Binarizer

# Discretize into 5 bins using K-Means clustering
discretizer = KBinsDiscretizer(n_bins=5, encode='ordinal', strategy='kmeans')
X_train_bins = discretizer.fit_transform(X_train[['age']])

# Binarize values based on a threshold (e.g. values > 18 become 1)
binarizer = Binarizer(threshold=18.0)
X_train_binary = binarizer.transform(X_train[['age']])`
  },
  {
    id: "mixed-variables",
    name: "Handling Mixed Variables",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "33 Handling Mixed Variables ｜ Feature Engineering [9xiX-I5_LQY].mp4",
    videoNum: "33",
    notebookPath: "Code/day33-handling-mixed-variables/Untitled.ipynb",
    subtopics: ["Mixed columns", "Alpha-numeric splitting", "Custom feature extractors"],
    intuition: "Mixed variables contain both numbers and string categories in the same column (e.g., Titanic Cabin numbers like 'C123' or Ticket codes). To handle them, you must split them into distinct numerical and categorical features.",
    advantages: [
      "Recovers valuable hidden features that standard encoders would treat as noisy strings.",
      "Significantly cleans the feature space."
    ],
    disadvantages: [
      "Requires custom pandas/regex splitting logic because scikit-learn does not have a native mixed-variable splitter."
    ],
    bestPractices: [
      "Write a custom FunctionTransformer or write a pandas cleaning step in your pipeline. Extract the alphabetical prefix into a categorical column and the numerical suffix into a continuous column."
    ],
    code: `import pandas as pd
import re

def split_mixed_cabin(df):
    # Extract letter prefix (Cabin deck)
    df['cabin_num'] = df['cabin'].str.extract('(\\d+)') # Numerical part
    df['cabin_cat'] = df['cabin'].str.extract('([a-zA-Z]+)') # Alphabetical part
    df['cabin_num'] = pd.to_numeric(df['cabin_num'], errors='coerce')
    return df[['cabin_num', 'cabin_cat']]`
  },
  {
    id: "datetime-variables",
    name: "Handling Date & Time Variables",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "34 Handling Date and Time Variables ｜ Day 34 ｜ 100 Days of Machine Learning [J73mvgG9fFs].mp4",
    videoNum: "34",
    notebookPath: "Code/day34-handling-date-and-time/working-with-dates-and-time.ipynb",
    subtopics: ["Datetime extraction", "Cyclical features", "Day of week", "Elapsed time"],
    intuition: "Raw datetime strings cannot be parsed by models. Preprocessing extracts descriptive numerical features: Year, Month, Day, Hour, Day of Week, Is Weekend, and elapsed time since an event. For cyclical time variables (e.g. Month 12 -> 1, Hour 23 -> 0), sine/cosine transforms preserve mathematical closeness.",
    advantages: [
      "Enables models to capture seasonality, weekly patterns, and time-based trends.",
      "Reduces overfitting by replacing absolute datetimes with repeating features."
    ],
    disadvantages: [
      "Sine/cosine transforms double the number of columns and require additional math."
    ],
    bestPractices: [
      "For cyclical features (e.g. hour), calculate: `x_sin = sin(2*pi*hour/24)` and `x_cos = cos(2*pi*hour/24)`. This ensures hour 23 and hour 00 are treated as adjacent."
    ],
    code: `import numpy as np
import pandas as pd

# Convert string to datetime
df['date'] = pd.to_datetime(df['date_string'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek

# Cyclical transform for Month (1-12)
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)`
  },

  // CATEGORY: MISSING VALUES IMPUTATION
  {
    id: "cca",
    name: "Complete Case Analysis (CCA)",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "35 Handling Missing Data ｜ Part 1 ｜ Complete Case Analysis [aUnNWZorGmk].mp4",
    videoNum: "35",
    notebookPath: "Code/day35-complete-case-analysis/day35.ipynb",
    subtopics: ["Listwise deletion", "Row removal", "MCAR assumptions"],
    intuition: "Simply discarding/dropping any rows that contain missing values in any feature. Also known as listwise deletion.",
    advantages: [
      "Extremely simple to implement.",
      "No statistical distortion of features because no values are fabricated.",
      "Preserves relationships (covariance/correlation) between features."
    ],
    disadvantages: [
      "Can result in severe loss of training data (e.g., if 10 features each have 5% randomly missing values, you could lose 40%+ of your dataset).",
      "Introduces bias if the missingness is not Missing Completely at Random (MCAR). If values are missing because of a factor (e.g., high-income people not reporting income), dropping them biases the model."
    ],
    bestPractices: [
      "Only use CCA when the proportion of missing data in a feature is extremely low (typically < 5%) and the values are verified to be missing completely at random (MCAR)."
    ],
    code: `# Drop rows with missing values in specific columns
X_clean = X_train.dropna(subset=['age', 'salary'])`
  },
  {
    id: "mean-median-imputer",
    name: "Mean & Median Imputation (SimpleImputer)",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "36 Handling missing data ｜ Numerical Data ｜ Simple Imputer [mCL2xLBDw8M].mp4",
    videoNum: "36",
    notebookPath: "Code/day36-imputing-numerical-data/mean-median-imputation.ipynb",
    subtopics: ["Central tendency", "Variance distortion", "Histogram spikes"],
    intuition: "Replaces missing values in numerical columns with the mean (for normal distributions) or median (for skewed distributions) of the observed values in that column.",
    advantages: [
      "Very fast, computationally cheap, and simple.",
      "Easy to put into production (only requires saving a single value per column from training)."
    ],
    disadvantages: [
      "Distorts the variance of the feature (underestimates variance because many points are filled with the exact same central value).",
      "Creates artificial peaks in the histogram.",
      "Destroys covariance/correlation relationships between the imputed feature and other variables."
    ],
    bestPractices: [
      "Use Median imputation for skewed columns and Mean imputation for normally distributed columns.",
      "Limit to columns with < 5% missingness. Combine with `add_indicator=True` to flag which entries were originally missing."
    ],
    code: `from sklearn.impute import SimpleImputer

# Impute median and add indicator column to capture missingness status
imputer = SimpleImputer(strategy='median', add_indicator=True)
X_train_imputed = imputer.fit_transform(X_train)`
  },
  {
    id: "missing-categorical-imputer",
    name: "Categorical Imputation (SimpleImputer)",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "37 Handling Missing Categorical Data ｜ Simple Imputer ｜ Most Frequent Imputation ｜ Missing Category Imp [l_Wip8bEDFQ].mp4",
    videoNum: "37",
    notebookPath: "Code/day37-handling-missing-categorical-data/frequent-value-imputation.ipynb",
    subtopics: ["Mode imputation", "Missing label assignment", "Categorical missingness"],
    intuition: "For categorical columns, missing values are replaced either with the most frequent class (mode) or by creating a brand new category named 'Missing'.",
    advantages: [
      "Mode Imputation: Simple, does not expand the feature space.",
      "Missing Category Imputation: Treats missingness as a valuable signal, which is critical if data is Missing Not at Random (MNAR) (e.g., people refusing to specify a credit rating)."
    ],
    disadvantages: [
      "Mode Imputation: Distorts the proportion of categories, artificially inflating the popularity of the mode class.",
      "Missing Category Imputation: Adds a new category, increasing cardinality slightly."
    ],
    bestPractices: [
      "Use Mode imputation if missingness is very low (<2%). Use 'Missing' category imputation if missingness is higher or if the missingness itself contains predictive pattern."
    ],
    code: `from sklearn.impute import SimpleImputer

# Impute a new category label 'Missing'
cat_imputer = SimpleImputer(strategy='constant', fill_value='Missing')
X_train_cat = cat_imputer.fit_transform(X_train[['city', 'gender']])`
  },
  {
    id: "missing-indicator",
    name: "Missing Indicator",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "38 Missing Indicator ｜ Random Sample Imputation ｜ Handling Missing Data Part 4 [Ratcir3p03w].mp4",
    videoNum: "38",
    notebookPath: "Code/day38-missing-indicator/automatically-select-imputer-parameters.ipynb",
    subtopics: ["Missingness indicator", "Flagging features", "Data leakage control"],
    intuition: "Creates a binary column indicating whether a value was originally missing. For a column with missing values, it adds a helper column where 1 = originally missing, 0 = not missing, and then imputes the original column.",
    advantages: [
      "Explicitly captures the pattern of missingness, which is valuable if the fact that data is missing carries predictive signal (MNAR).",
      "Natively supported inside SimpleImputer as a boolean flag."
    ],
    disadvantages: [
      "Doubles the feature space for columns with missing values."
    ],
    bestPractices: [
      "Always set `add_indicator=True` in your SimpleImputer classes to get the benefits of both imputation and missingness flagging automatically."
    ],
    code: `from sklearn.impute import SimpleImputer

# Automatically adds binary indicators for columns containing NaNs
imputer = SimpleImputer(strategy='median', add_indicator=True)
X_train_imputed = imputer.fit_transform(X_train)`
  },
  {
    id: "knn-imputer",
    name: "K-Nearest Neighbors Imputation (KNNImputer)",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "39 KNN Imputer ｜ Multivariate Imputation ｜ Handling Missing Data Part 5 [-fK-xEev2I8].mp4",
    videoNum: "39",
    notebookPath: "Code/day39-knn-imputer/day39.ipynb",
    subtopics: ["Distance-based imputation", "Multivariate relationships", "Scaling dependency"],
    intuition: "A multivariate method that imputes missing values by identifying the 'k' nearest samples based on non-missing features and averaging their values.",
    advantages: [
      "Highly accurate because it uses relationships across multiple features to estimate missing values.",
      "Preserves the variance and statistical distributions of data much better than mean/median imputation."
    ],
    disadvantages: [
      "Extremely slow and computationally expensive during prediction/inference, because it must calculate distances to all training points for every new prediction.",
      "Sensitive to the scale of features. Scaling (StandardScaler) MUST be performed before running KNNImputer."
    ],
    bestPractices: [
      "Create a Pipeline where you scale the data first, and then run KNNImputer. Set k between 3 and 7. Avoid for large, real-time prediction databases."
    ],
    code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import KNNImputer

# KNN is distance-based, so StandardScaler must run first!
imputation_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('imputer', KNNImputer(n_neighbors=5))
])

X_train_imputed = imputation_pipeline.fit_transform(X_train)`
  },
  {
    id: "iterative-imputer",
    name: "Multivariate Imputation by Chained Equations (MICE / IterativeImputer)",
    category: "imputation",
    categoryName: "Imputation",
    videoRef: "40 Multivariate Imputation by Chained Equations for Missing Value ｜ MICE Algorithm ｜ Iterative Imputer [a38ehxv3kyk].mp4",
    videoNum: "40",
    notebookPath: "Code/day40-iterative-imputer/step-by-step.ipynb",
    subtopics: ["MICE Algorithm", "Sequential regression", "Bayesian Ridge estimators"],
    intuition: "Models each feature with missing values as a function of all other features. It does this in a round-robin (chained) fashion, training regressors sequentially to impute each feature.",
    advantages: [
      "The gold standard for missing data imputation; captures complex, multivariate relationships.",
      "Preserves covariance, correlations, and variances exceptionally well.",
      "Much faster at prediction time than KNNImputer because it uses pre-trained regression models."
    ],
    disadvantages: [
      "Requires training multiple internal machine learning models, making the initial fitting phase slow.",
      "Experimental in scikit-learn (requires importing an enabling statement)."
    ],
    bestPractices: [
      "Use this for datasets with high missingness (>10%) across multiple columns, where relationships between columns are strong. Use `BayesianRidge` as the default estimator."
    ],
    code: `# IterativeImputer is experimental, must enable it first
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.linear_model import BayesianRidge

imputer = IterativeImputer(estimator=BayesianRidge(), max_iter=10, random_state=0)
X_train_imputed = imputer.fit_transform(X_train)`
  },

  // CATEGORY: OUTLIER HANDLING
  {
    id: "zscore-outlier",
    name: "Z-Score Outlier Method",
    category: "outliers",
    categoryName: "Outliers",
    videoRef: "42 Outlier Detection and Removal using Z-score Method ｜ Handling Outliers Part 2 [OnPE-Z8jtqM].mp4",
    videoNum: "42",
    notebookPath: "Code/day42-outlier-removal-using-zscore/day42.ipynb",
    subtopics: ["Standard deviations", "Normally distributed outliers", "Capping limits"],
    intuition: "Identifies outliers as values that lie beyond 3 standard deviations from the mean (Z > 3 or Z < -3). Assumes the feature follows a Normal (Gaussian) distribution.",
    advantages: [
      "Mathematically grounded for normal distributions.",
      "Standard and easy to interpret (marks the extreme 0.3% of data as outliers)."
    ],
    disadvantages: [
      "Completely unreliable if the data is highly skewed or bimodal, as the mean and standard deviation themselves will be skewed by the outliers."
    ],
    bestPractices: [
      "Check the skewness and plot a histogram first. Only use this method if the feature has a symmetric, bell-shaped Gaussian distribution. You can either trim (remove rows) or cap (Winsorize) the values."
    ],
    code: `import numpy as np

# Find limits
mean = X_train['age'].mean()
std = X_train['age'].std()
upper_limit = mean + 3 * std
lower_limit = mean - 3 * std

# Capping (Winsorization)
X_train['age'] = np.clip(X_train['age'], lower_limit, upper_limit)`
  },
  {
    id: "iqr-outlier",
    name: "IQR Outlier Method",
    category: "outliers",
    categoryName: "Outliers",
    videoRef: "43 Outlier Detection and Removal using the IQR Method ｜ Handing Outliers Part 3 [Ccv1-W5ilak].mp4",
    videoNum: "43",
    notebookPath: "Code/day43-outlier-removal-using-iqr-method/day43.ipynb",
    subtopics: ["Interquartile Range", "Skewed data outliers", "Trimming rows"],
    intuition: "Identifies outliers using quartiles. It calculates the Interquartile Range (IQR = Q3 - Q1) and marks values outside [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR] as outliers.",
    advantages: [
      "Highly effective for skewed, non-normal distributions.",
      "Robust to outliers because Q1 and Q3 are not pulled by extreme values (unlike mean and standard deviation)."
    ],
    disadvantages: [
      "The 1.5 multiplier is a heuristic; sometimes it flags normal data points in highly skewed variables as outliers."
    ],
    bestPractices: [
      "Use this as your default outlier handler for most tabular features (like income, transaction amount, etc.) which are typically right-skewed."
    ],
    code: `import numpy as np

# Calculate IQR limits
q1 = X_train['salary'].quantile(0.25)
q3 = X_train['salary'].quantile(0.75)
iqr = q3 - q1
lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr

# Trimming
X_train_trimmed = X_train[(X_train['salary'] >= lower_fence) & (X_train['salary'] <= upper_fence)]`
  },
  {
    id: "percentile-outlier",
    name: "Percentile Method / Winsorization",
    category: "outliers",
    categoryName: "Outliers",
    videoRef: "44 Outlier Detection using the Percentile Method ｜ Winsorization Technique [bcXA4CqRXvM].mp4",
    videoNum: "44",
    notebookPath: "Code/day44-outlier-detection-using-percentiles/day44.ipynb",
    subtopics: ["Percentiles", "Quantile boundaries", "Winsorization capping"],
    intuition: "Detects outliers by defining hard percentile thresholds (e.g. 1st and 99th percentiles) and capping or removing values outside this range.",
    advantages: [
      "Extremely flexible; does not assume any specific statistical distribution.",
      "Guarantees that a fixed percentage of extreme points will be managed."
    ],
    disadvantages: [
      "Arbitrary thresholds (e.g., choosing 99% vs 99.5% is subjective and depends on manual visual inspection)."
    ],
    bestPractices: [
      "Winsorization (capping instead of dropping) is generally preferred because it handles the outliers without discarding the rest of the information in that data row."
    ],
    code: `import numpy as np

# Find percentiles
low_limit = X_train['height'].quantile(0.01)
high_limit = X_train['height'].quantile(0.99)

# Capping (Winsorization)
X_train['height'] = np.clip(X_train['height'], low_limit, high_limit)`
  },

  // CATEGORY: ADVANCED PREPROCESSING
  {
    id: "feature-construction",
    name: "Feature Construction & Feature Splitting",
    category: "transformers",
    categoryName: "Feature Transformers",
    videoRef: "45 Feature Construction ｜ Feature Splitting [ma-h30PoFms].mp4",
    videoNum: "45",
    notebookPath: "Code/day45-feature-construction-and-feature-splitting/day45.ipynb",
    subtopics: ["Feature mathematics", "String parsing", "Titanic Name splitting", "Family size construction"],
    intuition: "Feature construction creates brand new features from existing columns using domain knowledge (e.g. combining SibSp and Parch on Titanic to create FamilySize). Feature splitting breaks apart complex strings (e.g., parsing 'Mr. Jack Dawson' to extract the title 'Mr.').",
    advantages: [
      "Significantly boosts accuracy by giving models clean, highly-correlated indicators.",
      "Reduces noise and consolidates redundant variables."
    ],
    disadvantages: [
      "Requires manual domain analysis and custom pandas code (cannot be automated easily)."
    ],
    bestPractices: [
      "Always construct features that combine overlapping information (like sum of expenses, ratio of transactions, or age brackets). In pipelines, implement these via custom transformers or FunctionTransformers."
    ],
    code: `import pandas as pd
from sklearn.preprocessing import FunctionTransformer

# Construct FamilySize feature
def construct_family_size(df):
    df['family_size'] = df['sibsp'] + df['parch'] + 1
    return df[['family_size']]

# Use in scikit-learn
family_transformer = FunctionTransformer(construct_family_size)
X_train_fam = family_transformer.fit_transform(X_train)`
  },

  // CATEGORY: DIMENSIONALITY REDUCTION
  {
    id: "pca",
    name: "Principal Component Analysis (PCA)",
    category: "dim-red",
    categoryName: "Dimensionality Reduction",
    videoRef: "47 Principle Component Analysis  (PCA) ｜ Part 1 ｜ Geometric Intuition [iRbsBi5W0-c].mp4",
    videoNum: "47",
    notebookPath: "Code/day47-pca/day47.ipynb",
    subtopics: ["Eigenvectors", "Eigenvalues", "Variance maximization", "Scree plot", "Explained variance"],
    intuition: "An unsupervised technique that projects data onto a lower-dimensional space by finding orthogonal directions (principal components) of maximum variance.",
    advantages: [
      "Reduces dimensionality, solving the 'curse of dimensionality' and reducing overfitting.",
      "Speeds up training times for models.",
      "Removes multicollinearity because all principal components are orthogonal (uncorrelated)."
    ],
    disadvantages: [
      "Principal components are linear combinations of features, making them completely uninterpretable in real-world terms.",
      "Can lose important predictive information if the target variable's relationship is aligned with low-variance directions."
    ],
    bestPractices: [
      "Feature scaling (StandardScaler) is MANDATORY before PCA. If features are on different scales, PCA will be completely dominated by high-magnitude columns.",
      "Use `explained_variance_ratio_` to plot a cumulative variance chart (Scree plot) and select the number of components that retain 90-95% of variance."
    ],
    code: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

pca_pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA(n_components=0.95)) # Retain 95% of explained variance
])

X_train_pca = pca_pipe.fit_transform(X_train)`
  },

  // CATEGORY: REGRESSION
  {
    id: "linear-regression",
    name: "Linear Regression (Simple & Multiple)",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "53 Multiple Linear Regression ｜ Geometric Intuition & Code [ashGekqstl8].mp4",
    videoNum: "53",
    notebookPath: "Code/day48-simple-linear-regression/day48.ipynb",
    subtopics: ["OLS (Ordinary Least Squares)", "Coefficients", "Intercept", "Residuals minimizing"],
    intuition: "Fits a linear equation to model the relationship between independent variables X and a continuous target y. It minimizes the sum of squared residuals (OLS method):\n\n    ŷ = w₁x₁ + w₂x₂ + ... + w_n x_n + b\n\nIt attempts to find the hyperplane of best fit in N-dimensional space.",
    advantages: [
      "Highly interpretable coefficients (tells you the exact direction and impact of each feature).",
      "Very fast to train and predict.",
      "Serves as an excellent simple baseline for regression tasks."
    ],
    disadvantages: [
      "Assumes relationships are linear.",
      "Highly sensitive to outliers.",
      "Struggles if features are highly collinear (multicollinearity)."
    ],
    bestPractices: [
      "Check residual plots (errors should be randomly distributed around zero).",
      "Always inspect model coefficient weights for domain sanity checks."
    ],
    code: `from sklearn.linear_model import LinearRegression

lr = LinearRegression()
lr.fit(X_train, y_train)
print("Coefficients:", lr.coef_)
print("Intercept:", lr.intercept_)`
  },
  {
    id: "linear-assumptions",
    name: "Assumptions of Linear Regression",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "56 What are the main Assumptions of Linear Regression？ ｜ Top 5 Assumptions of Linear Regression [EmSNAtcHLm8].mp4",
    videoNum: "56",
    notebookPath: "",
    subtopics: ["Linearity", "Homoscedasticity", "Normality of Residuals", "No Multicollinearity", "No Autocorrelation"],
    intuition: "For OLS linear regression models to provide reliable coefficients and minimum variance unbiased estimators, 5 statistical assumptions must hold: 1) Linearity (linear relationship), 2) Homoscedasticity (constant variance of error terms), 3) Normality of residuals, 4) No Multicollinearity (features shouldn't be highly correlated), and 5) No Autocorrelation (error terms must be independent).",
    advantages: [
      "Ensures the statistical validity and unbiased nature of your regression results.",
      "Helps diagnose why a linear model is underperforming."
    ],
    disadvantages: [
      "Real-world data almost always violates one or more of these assumptions, requiring transformations (e.g. log transform, robust regression)."
    ],
    bestPractices: [
      "Use Variance Inflation Factor (VIF) to detect multicollinearity (VIF > 5 indicates high correlation). Check QQ plots for normality of residuals."
    ],
    code: `import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 1. Add constant for Statsmodels
X_constant = sm.add_constant(X_train)
model = sm.OLS(y_train, X_constant).fit()

# 2. Check Multicollinearity (VIF)
vifs = [variance_inflation_factor(X_constant.values, i) for i in range(X_constant.shape[1])]`
  },
  {
    id: "gradient-descent",
    name: "Gradient Descent Variations",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "57 Gradient Descent From Scratch ｜ End to End Gradient Descent ｜ Gradient Descent Animation [ORyfPJypKuU].mp4",
    videoNum: "57",
    notebookPath: "Code/day51-gradient-descent/gradient_descent_step_by_step.ipynb",
    subtopics: ["Batch GD", "Stochastic GD (SGD)", "Mini-batch GD", "Learning rate", "Epochs"],
    intuition: "An optimization algorithm that minimizes the cost function by iteratively stepping in the opposite direction of the gradient. Batch GD updates weights using the entire dataset (smooth but slow). Stochastic GD (SGD) updates weights after every single row (fast but highly noisy/fluctuating). Mini-batch GD updates weights after small subsets (e.g. 32 or 64 rows), combining speed and stability.",
    advantages: [
      "Batch GD: Guaranteed to converge to global minimum for convex functions.",
      "SGD: Extremely fast; can escape local minima due to noise.",
      "Mini-batch: Highly efficient, utilizes vectorization in modern GPUs."
    ],
    disadvantages: [
      "Finding the optimal learning rate (step size) requires tuning. Too large will overshoot; too small will take forever."
    ],
    bestPractices: [
      "Always standard scale features before running Gradient Descent, otherwise the cost function contour is stretched, causing convergence to take much longer.",
      "Use learning rate decay schedulers."
    ],
    code: `from sklearn.linear_model import SGDRegressor

# SGDRegressor fits linear models using Stochastic Gradient Descent
sgd_reg = SGDRegressor(max_iter=1000, tol=1e-3, penalty=None, eta0=0.01)
sgd_reg.fit(X_train_scaled, y_train)`
  },
  {
    id: "polynomial-regression",
    name: "Polynomial Regression",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "61 Polynomial Regression ｜ Machine Learning [BNWLf3cKdbQ].mp4",
    videoNum: "61",
    notebookPath: "Code/day53-polynomial-regression/day53.ipynb",
    subtopics: ["Non-linear curves", "PolynomialFeatures", "Interaction terms", "Overfitting degree"],
    intuition: "Models non-linear relationships by raising independent features to mathematical powers (e.g. x², x³) and adding interaction terms (x₁ × x₂). The resulting model is still linear with respect to coefficients, allowing standard OLS fitting:\n\n    y = w₀ + w₁x + w₂x² + w₃x³ + b",
    advantages: [
      "Fits complex, curved relationships while keeping the simplicity and speed of linear regression."
    ],
    disadvantages: [
      "High degrees (degree > 3) overfit extremely fast, especially at the boundaries of data (Runaway boundary predictions)."
    ],
    bestPractices: [
      "Keep the degree low (usually 2). Combine with regularized models (Ridge/Lasso) to penalize excessive polynomial coefficients."
    ],
    code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline

# Pipeline raises features to 2nd degree and fits a linear regressor
poly_model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
poly_model.fit(X_train, y_train)`
  },
  {
    id: "ridge-regression",
    name: "Ridge Regression (L2 Regularization)",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "63 Ridge Regression Part 1 ｜ Geometric Intuition and Code ｜ Regularized Linear Models [aEow1QoTLo0].mp4",
    videoNum: "63",
    notebookPath: "Code/day55-regularized-linear-models/day55.ipynb",
    subtopics: ["L2 Penalty", "Weight shrinkage", "Multicollinearity solution", "Alpha hyperparameter"],
    intuition: "Adds a penalty proportional to the sum of squared weights (L2 penalty) to the loss function:\n\n    Loss = OLS_Loss + α * ∑(w_i²)\n\nThis forces the coefficients to shrink close to zero, reducing model variance (overfitting) while maintaining all features.",
    advantages: [
      "Excellent at preventing overfitting.",
      "Handles multicollinearity cleanly by distributing weight shrinkage among correlated features."
    ],
    disadvantages: [
      "Does not perform feature selection (coefficients are shrunk close to zero, but never exactly to zero)."
    ],
    bestPractices: [
      "Standard scaling is absolutely mandatory before Ridge, otherwise features with larger magnitudes will be penalized unfairly.",
      "Tune the alpha (regularization strength) parameter using cross-validation."
    ],
    code: `from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(StandardScaler(), Ridge(alpha=10.0))
model.fit(X_train, y_train)`
  },
  {
    id: "lasso-regression",
    name: "Lasso Regression (L1 Regularization)",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "67 Lasso Regression ｜ Intuition and Code Sample ｜ Regularized Linear Models [HLF4bFbBgwk].mp4",
    videoNum: "67",
    notebookPath: "Code/day56-lasso-regression/day56.ipynb",
    subtopics: ["L1 Penalty", "Sparsity creation", "Feature selection", "Weight zeroing"],
    intuition: "Adds a penalty proportional to the sum of absolute values of weights (L1 penalty) to the loss function:\n\n    Loss = OLS_Loss + α * ∑(|w_i|)\n\nBecause of the diamond shape of L1 constraint contours, Lasso shrinks unhelpful coefficients to exactly zero, performing automatic feature selection.",
    advantages: [
      "Creates sparse models, performing automatic feature selection.",
      "Greatly simplifies models by removing unneeded variables."
    ],
    disadvantages: [
      "If a group of features is highly correlated, Lasso arbitrarily selects one and discards the rest."
    ],
    bestPractices: [
      "Always scale features first.",
      "Use Lasso when you suspect only a small fraction of features are actually predictive."
    ],
    code: `from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(StandardScaler(), Lasso(alpha=1.0))
model.fit(X_train, y_train)`
  },
  {
    id: "elasticnet-regression",
    name: "ElasticNet Regression",
    category: "regression",
    categoryName: "Regression Models",
    videoRef: "69 ElasticNet Regression ｜ Intuition and Code Example ｜ Regularized Linear Models [2g2DBkFhTTY].mp4",
    videoNum: "69",
    notebookPath: "Code/day57-elasticnet-regression/day57.ipynb",
    subtopics: ["L1 + L2 hybrid", "L1 ratio", "Grouping effect"],
    intuition: "Combines L1 (Lasso) and L2 (Ridge) penalties in a weighted fashion:\n\n    Loss = OLS_Loss + a * L₁_Loss + b * L₂_Loss\n\nIt allows you to balance weight shrinkage (L2) and sparsity (L1) using the `l1_ratio` parameter.",
    advantages: [
      "Combines the benefits of both Ridge and Lasso.",
      "Handles groups of highly correlated features cleanly (retains/shrinks the entire group instead of randomly picking one like Lasso)."
    ],
    disadvantages: [
      "Adds another hyperparameter to tune (`l1_ratio` between 0 and 1)."
    ],
    bestPractices: [
      "Use when you have a high-dimensional dataset with groups of correlated features. Set `l1_ratio=0.5` as a starting point."
    ],
    code: `from sklearn.linear_model import ElasticNet
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(StandardScaler(), ElasticNet(alpha=1.0, l1_ratio=0.5))
model.fit(X_train, y_train)`
  },

  // CATEGORY: CLASSIFICATION
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "70 Logistic Regression Part 1 ｜ Perceptron Trick [XNXzVfItWGY].mp4",
    videoNum: "70",
    notebookPath: "Code/day58-logistic-regression/day58.ipynb",
    subtopics: ["Perceptron trick", "Sigmoid function", "Log Loss", "Binary Cross Entropy", "Gradient descent scratch"],
    intuition: "A linear model for binary classification. It fits a linear decision boundary (z = Wx + b) and passes the result through the Sigmoid function to output probability scores:\n\n    σ(z) = 1 / (1 + e^-z)\n\nIt minimizes Binary Cross Entropy / Log Loss using gradient descent.",
    advantages: [
      "Outputs well-calibrated class probability scores.",
      "Very fast, computationally lightweight, and highly interpretable.",
      "Regularization (L1/L2) is built-in."
    ],
    disadvantages: [
      "Can only model linear decision boundaries natively.",
      "Struggles with highly complex non-linear relationships."
    ],
    bestPractices: [
      "Set `class_weight='balanced'` if dealing with class imbalance.",
      "Use `predict_proba()` to evaluate probabilities, allowing you to tune classification thresholds."
    ],
    code: `from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(penalty='l2', C=1.0, class_weight='balanced')
clf.fit(X_train, y_train)`
  },
  {
    id: "softmax-regression",
    name: "Softmax Regression (Multinomial Logistic Regression)",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "079 - Softmax Regression ｜｜ Multinomial Logistic Regression ｜｜ Logistic Regression Part 6 [Z8noL_0M4tw].mp4",
    videoNum: "079",
    notebookPath: "Code/day60-logistic-regression-contd/softmax-demo.ipynb",
    subtopics: ["Multiclass classification", "Softmax activation", "Logits", "Cross Entropy Loss"],
    intuition: "Extends Logistic Regression to multiclass classification. Instead of a single sigmoid output, it computes separate logits for each class and passes them through the Softmax function to obtain a normalized probability distribution:\n\n    P(y=k|x) = e^(z_k) / ∑(e^(z_j))",
    advantages: [
      "Handles multiclass classification natively without needing separate binary models (One-vs-Rest).",
      "Outputs probabilities that sum to exactly 1."
    ],
    disadvantages: [
      "Decision boundaries between classes remain strictly linear."
    ],
    bestPractices: [
      "In scikit-learn, `LogisticRegression` automatically uses Softmax (multinomial) if it detects more than two classes in the target variable."
    ],
    code: `from sklearn.linear_model import LogisticRegression

# Scikit-learn handles multinomial softmax automatically
multiclass_clf = LogisticRegression(multi_class='multinomial', solver='lbfgs')
multiclass_clf.fit(X_train, y_train)`
  },
  {
    id: "logistic-hyperparameters",
    name: "Logistic Regression Hyperparameters & Polynomials",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "081 - Logistic Regression Hyperparameters ｜｜ Logistic Regression Part 8 [ay_OcblJasE].mp4",
    videoNum: "081",
    notebookPath: "",
    subtopics: ["Solver types", "C penalty parameter", "Polynomial features in classification"],
    intuition: "Key hyperparameters in Logistic Regression include `C` (inverse regularization strength, where smaller C means stronger regularization) and the `solver` (e.g. lbfgs, liblinear, saga). Non-linear decision boundaries can be modeled by adding `PolynomialFeatures` before fitting.",
    advantages: [
      "Enables modeling complex decision boundaries using linear classifiers.",
      "Optimizes training speed and convergence behavior for different dataset sizes."
    ],
    disadvantages: [
      "Adding polynomial features can explode dimensionality, making the model slow and prone to overfitting."
    ],
    bestPractices: [
      "Use `solver='liblinear'` for small datasets, and `solver='saga'` for large datasets. GridSearch the `C` parameter across a logarithmic scale (e.g. [0.01, 0.1, 1.0, 10.0])."
    ],
    code: `from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# Non-linear Logistic Regression pipeline
clf = make_pipeline(
    PolynomialFeatures(degree=2),
    LogisticRegression(C=0.1, solver='saga', penalty='l2')
)
clf.fit(X_train, y_train)`
  },
  {
    id: "naive-bayes",
    name: "Naive Bayes Classifier",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "088 - Naive Bayes Classifier ｜ Part 7 ｜ Mathematics behind Naive Bayes Algorithm [2PVRG45eVrY].mp4",
    videoNum: "088",
    notebookPath: "Code/day58-logistic-regression/day58.ipynb", // approx
    subtopics: ["Bayes Theorem", "Conditional Independence", "GaussianNB", "MultinomialNB", "BernoulliNB", "Laplace Smoothing"],
    intuition: "A probabilistic classifier based on Bayes' Theorem. It makes the 'naive' assumption that all features are conditionally independent of each other given the class label:\n\n    P(y | x₁,...,x_n) ∝ P(y) * ∏ P(x_i | y)\n\nIt handles numerical data (Gaussian distribution assumption) or counts (Multinomial with Laplace smoothing to prevent 0 probabilities).",
    advantages: [
      "Extremely fast to train and predict.",
      "Performs exceptionally well on high-dimensional text data (spam filtering, sentiment analysis).",
      "Performs well even with limited training data."
    ],
    disadvantages: [
      "The conditional independence assumption is rarely true in real-world data."
    ],
    bestPractices: [
      "Use `MultinomialNB` for text word counts (TF-IDF), `BernoulliNB` for binary text representations, and `GaussianNB` for continuous tabular variables."
    ],
    code: `from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline

# Text classification pipeline
text_model = make_pipeline(TfidfVectorizer(), MultinomialNB(alpha=1.0))
text_model.fit(X_train_text, y_train)`
  },
  {
    id: "knn-classifier",
    name: "K-Nearest Neighbors (KNN)",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "091 - What is K Nearest Neighbors？ ｜ KNN Explained in Hindi ｜ Simple Overview in 1 Video ｜ CampusX [abnL_GUGub4].mp4",
    videoNum: "091",
    notebookPath: "",
    subtopics: ["Euclidean distance", "Lazy learning", "K hyperparameter selection"],
    intuition: "A non-parametric, distance-based algorithm. To classify a new point, it searches the feature space for the 'K' closest training instances and assigns the majority class label.",
    advantages: [
      "Zero training time (lazy learner).",
      "Very simple to understand, and maps complex decision boundaries natively.",
      "No statistical distribution assumptions."
    ],
    disadvantages: [
      "Inference/prediction is extremely slow on large datasets (must scan and compute distance to all training points).",
      "Highly sensitive to feature scaling and outliers."
    ],
    bestPractices: [
      "Feature scaling (StandardScaler) is mandatory before KNN. Use odd values of K (e.g. 5) to avoid class vote ties."
    ],
    code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

knn_clf = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
knn_clf.fit(X_train, y_train)`
  },
  {
    id: "svm",
    name: "Support Vector Machines (SVC & SVR)",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "092 - Support Vector Machines ｜ Geometric Intuition [ugTxMLjLS8M].mp4",
    videoNum: "092",
    notebookPath: "",
    subtopics: ["Hard Margin", "Soft Margin", "Support Vectors", "Kernel Trick", "RBF Kernel", "SVR Epsilon-insensitive tube"],
    intuition: "Finds the optimal hyperplane that maximizes the margin (distance) between classes. The Kernel Trick projects non-separable data into higher dimensions where it becomes linearly separable. Yes, it performs regression (SVR) by fitting a hyperplane that keeps errors within an ε-insensitive tube.",
    advantages: [
      "Very effective in high-dimensional spaces.",
      "Robust to overfitting due to regularization margin maximization."
    ],
    disadvantages: [
      "Slow to train on large datasets (>50,000 samples).",
      "Sensitive to noise and outliers near the margins."
    ],
    bestPractices: [
      "Standardizing features is mandatory.",
      "Use GridSearch to tune the penalty parameter `C` and RBF kernel parameter `gamma`."
    ],
    code: `from sklearn.svm import SVC, SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# SVM Classification
svc = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1.0))
svc.fit(X_train, y_train)

# SVR Regression - YES, SVM does regression!
svr = make_pipeline(StandardScaler(), SVR(kernel='rbf', epsilon=0.1))`
  },
  {
    id: "decision-tree",
    name: "Decision Trees",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "097 - Decision Trees Geometric Intuition ｜ Entropy ｜ Gini impurity ｜ Information Gain [IZnno-dKgVQ].mp4",
    videoNum: "097",
    notebookPath: "",
    subtopics: ["Entropy", "Gini Impurity", "Information Gain", "Pruning", "Cost Complexity Pruning"],
    intuition: "Recursively splits the feature space into orthogonal regions by selecting features that maximize Information Gain (which reduces Gini impurity or Entropy).",
    advantages: [
      "Highly interpretable (can be visualized as a flowchart).",
      "No feature scaling or outlier removal required.",
      "Handles categorical and numerical columns natively."
    ],
    disadvantages: [
      "High variance: prone to severe overfitting.",
      "Highly unstable: minor changes in training data create completely different trees."
    ],
    bestPractices: [
      "Apply pruning using `max_depth`, `min_samples_split`, or `ccp_alpha` (Cost Complexity Pruning) to limit tree size."
    ],
    code: `from sklearn.tree import DecisionTreeClassifier

dt = DecisionTreeClassifier(max_depth=5, min_samples_leaf=10, random_state=42)
dt.fit(X_train, y_train)`
  },
  {
    id: "dtreeviz",
    name: "dtreeviz Visualizations",
    category: "classification",
    categoryName: "Classification Models",
    videoRef: "100 - Awesome Decision Tree Visualization using dtreeviz library [SlMZqfvl5uw].mp4",
    videoNum: "100",
    notebookPath: "",
    subtopics: ["Tree plots", "Decision boundaries", "Leaf node details"],
    intuition: "A specialized visualization library for decision trees that replaces traditional block diagrams with detailed histograms, scatter plots, and distribution graphs showing exactly how samples are split at each node.",
    advantages: [
      "Far more intuitive and detailed than scikit-learn's default `plot_tree` function.",
      "Makes decision tree behavior transparent to stakeholders."
    ],
    disadvantages: [
      "Requires installing external packages (`dtreeviz` and `graphviz`)."
    ],
    bestPractices: [
      "Use to explain complex model decisions and inspect split quality during debugging."
    ],
    code: `# Requires: pip install dtreeviz
import dtreeviz

# (Assuming model and data are pre-trained)
viz = dtreeviz.model(dt, 
                     X_train, 
                     y_train,
                     target_name="target",
                     feature_names=list(X_train.columns),
                     class_names=["Class0", "Class1"])
viz.view()`
  },

  // CATEGORY: ENSEMBLE METHODS
  {
    id: "voting-ensemble",
    name: "Voting Ensemble",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "103 - Voting Ensemble ｜ Classification ｜ Voting Classifier ｜ Hard Voting Vs Soft Voting ｜ Part 2 [pGQnNYdPTvY].mp4",
    videoNum: "103",
    notebookPath: "Code/day68-stacking-and-blending/stacking.ipynb", // approx
    subtopics: ["Hard Voting", "Soft Voting", "Model averaging", "Heterogeneous ensembles"],
    intuition: "Combines the predictions of multiple distinct model classes. Hard Voting counts predictions and selects the majority class. Soft Voting averages probability predictions across models, weighting predictions by model confidence.",
    advantages: [
      "Reduces error by balancing out individual model weaknesses.",
      "Works well when combining models that learn different representations (e.g. SVM + Random Forest)."
    ],
    disadvantages: [
      "Requires training and running multiple distinct models, increasing computational load."
    ],
    bestPractices: [
      "Use Soft Voting for models that produce well-calibrated probabilities, as it is generally more accurate than Hard Voting."
    ],
    code: `from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB

# Heterogeneous ensemble
voting_clf = VotingClassifier(
    estimators=[
        ('lr', LogisticRegression()),
        ('rf', RandomForestClassifier()),
        ('gnb', GaussianNB())
    ],
    voting='soft' # 'hard' for simple vote, 'soft' for probability average
)
voting_clf.fit(X_train, y_train)`
  },
  {
    id: "bagging-ensemble",
    name: "Bagging & Pasting",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "106 - Bagging Ensemble ｜ Part 2 ｜ Bagging Classifiers [-1T54G_E-ys].mp4",
    videoNum: "106",
    notebookPath: "",
    subtopics: ["Bootstrap aggregating", "Pasting (no replacement)", "Random Patches", "Random Subspaces", "Out-of-Bag validation"],
    intuition: "Bootstrap Aggregating (Bagging) trains multiple models in parallel on random subsets of the data sampled WITH replacement. Pasting samples WITHOUT replacement. Random Subspaces samples random subsets of features; Random Patches samples both rows and features.",
    advantages: [
      "Significantly reduces model variance (overfitting) without increasing bias.",
      "Parallelizable since estimators are independent."
    ],
    disadvantages: [
      "Loss of interpretability (ensemble of estimators)."
    ],
    bestPractices: [
      "Set `bootstrap=True` (Bagging) for variance reduction. Enable `oob_score=True` to get free validation score."
    ],
    code: `from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

# Bagging Classifier using Decision Trees
bag = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,
    max_samples=0.8,    # sample 80% of rows
    max_features=0.8,   # sample 80% of columns
    bootstrap=True,     # sample with replacement
    oob_score=True,
    random_state=42
)
bag.fit(X_train, y_train)`
  },
  {
    id: "random-forest",
    name: "Random Forest",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "108 - Introduction to Random Forest ｜ Intuition behind the Algorithm [bHK1fE_BUms].mp4",
    videoNum: "108",
    notebookPath: "Code/day65-random-forest/random_forest_demo.ipynb",
    subtopics: ["Tree Bagging", "Feature Bagging", "OOB evaluation", "Feature Importance"],
    intuition: "A bagging ensemble of Decision Trees that introduces extra randomness: at each node split, it only searches a random subset of features (typically √d). This decorrelates the trees, allowing their averaged predictions to have lower variance.",
    advantages: [
      "Highly accurate and robust; requires minimal tuning.",
      "Calculates feature importance natively.",
      "Provides Out-of-Bag (OOB) validation score."
    ],
    disadvantages: [
      "Black-box model; loses single-tree interpretability.",
      "Slow to predict with large number of trees."
    ],
    bestPractices: [
      "Use `max_features='sqrt'` for classification, and `max_features=0.3` for regression. Enable `oob_score=True`."
    ],
    code: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, max_features='sqrt', oob_score=True, random_state=42)
rf.fit(X_train, y_train)
print("OOB Accuracy:", rf.oob_score_)
print("Feature Importances:", rf.feature_importances_)`
  },
  {
    id: "adaboost",
    name: "AdaBoost (Adaptive Boosting)",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "115 - How Adaboost Classifier Works？ ｜ Geometric Intuition [sFKnP0iP0K0].mp4",
    videoNum: "115",
    notebookPath: "Code/day66-adaboost/adaboost_demo.ipynb",
    subtopics: ["Sequential boosting", "Decision stumps", "Sample weights update", "Learning rate decay"],
    intuition: "A sequential boosting algorithm. It trains simple models (usually decision stumps - 1-level decision trees). After each step, it increases the weights of misclassified training samples, forcing the next model to focus on hard samples.",
    advantages: [
      "Significantly reduces bias.",
      "Hard to overfit when using simple stumps."
    ],
    disadvantages: [
      "Highly sensitive to noisy data and outliers, as it will repeatedly boost the weights of unclassifiable points."
    ],
    bestPractices: [
      "Preprocess and remove outliers before running AdaBoost. Keep `learning_rate` low (0.01 to 0.1)."
    ],
    code: `from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier

base_stump = DecisionTreeClassifier(max_depth=1)
ada = AdaBoostClassifier(estimator=base_stump, n_estimators=50, learning_rate=0.1)
ada.fit(X_train, y_train)`
  },
  {
    id: "gradient-boosting",
    name: "Gradient Boosting (GBM)",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "120 - Gradient Boosting Explained ｜ How Gradient Boosting Works？ [fbKz7N92mhQ].mp4",
    videoNum: "120",
    notebookPath: "Code/gradient-boosting/gradient_boost_step_by_step.ipynb",
    subtopics: ["Pseudo-residuals", "Loss minimization", "Shrinkage", "GBDT"],
    intuition: "Sequentially builds trees. Unlike AdaBoost, it fits each new tree to predict the pseudo-residuals (errors) of the cumulative model using gradient descent.",
    advantages: [
      "State-of-the-art predictive accuracy on tabular datasets.",
      "Supports custom loss functions."
    ],
    disadvantages: [
      "Prone to overfitting if learning rate is too high.",
      "Cannot be parallelized during training."
    ],
    bestPractices: [
      "Apply early stopping. Keep learning rate small and increase estimators."
    ],
    code: `from sklearn.ensemble import GradientBoostingClassifier

gbm = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
gbm.fit(X_train, y_train)`
  },
  {
    id: "xgboost",
    name: "XGBoost (Extreme Gradient Boosting)",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "123 - Introduction to XGBOOST ｜ Machine Learning ｜ CampusX [C6aDw4y8qJ0].mp4",
    videoNum: "123",
    notebookPath: "",
    subtopics: ["Regularized Boosting", "L1/L2 weights penalty", "Sparsity-aware splitting", "Parallel tree construction"],
    intuition: "An optimized implementation of Gradient Boosting. It incorporates L1/L2 regularization directly into the cost function, supports parallel tree building, and handles missing values natively.",
    advantages: [
      "Extremely fast and accurate.",
      "Handles missing values automatically.",
      "Built-in regularization prevents overfitting."
    ],
    disadvantages: [
      "Massive hyperparameter space requires tuning."
    ],
    bestPractices: [
      "Use Optuna for tuning. Set `early_stopping_rounds` using a validation split."
    ],
    code: `# Requires: pip install xgboost
from xgboost import XGBClassifier

xgb = XGBClassifier(n_estimators=500, learning_rate=0.05, max_depth=5, reg_lambda=1.0, early_stopping_rounds=10)
xgb.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)`
  },
  {
    id: "stacking",
    name: "Stacking & Blending",
    category: "ensembles",
    categoryName: "Ensembles",
    videoRef: "127 - Stacking and Blending Ensembles [O-aDHBGMqXA].mp4",
    videoNum: "127",
    notebookPath: "Code/day68-stacking-and-blending/stacking.ipynb",
    subtopics: ["Meta-learning", "Heterogeneous classifiers", "Out-of-fold cross validation"],
    intuition: "Trains heterogeneous base models. A meta-model (usually Logistic Regression) is trained to make final predictions using the cross-validated predictions of the base models as input features.",
    advantages: [
      "Combines strengths of completely different model types.",
      "Almost always boosts accuracy."
    ],
    disadvantages: [
      "High complexity and inference latency (must run all base models)."
    ],
    bestPractices: [
      "Use scikit-learn's `StackingClassifier` to handle out-of-fold generation, preventing target leakage."
    ],
    code: `from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

base_models = [
    ('rf', RandomForestClassifier(n_estimators=50)),
    ('svc', SVC(probability=True))
]
stack = StackingClassifier(estimators=base_models, final_estimator=LogisticRegression(), cv=5)
stack.fit(X_train, y_train)`
  },

  // CATEGORY: CLUSTERING
  {
    id: "kmeans",
    name: "K-Means Clustering",
    category: "clustering",
    categoryName: "Clustering",
    videoRef: "128 - K-Means Clustering Algorithm ｜ Geometric Intuition ｜ Clustering ｜ Unsupervised Learning [5shTLzwAdEc].mp4",
    videoNum: "128",
    notebookPath: "Code/kmeans/kmeans.ipynb",
    subtopics: ["Euclidean centroids", "Elbow method", "Silhouette score", "K-Means++ initialization"],
    intuition: "Partitions data into 'K' clusters. It iteratively assigns points to the nearest cluster centroid (using Euclidean distance) and recalculates centroids as the mean of points in that cluster.",
    advantages: [
      "Fast and efficient on small to medium datasets."
    ],
    disadvantages: [
      "Must specify 'K' in advance.",
      "Sensitive to outliers; struggles on non-spherical clusters."
    ],
    bestPractices: [
      "Always scale features first. Use `init='k-means++'` to choose smart starting centroids."
    ],
    code: `from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

kmeans = make_pipeline(StandardScaler(), KMeans(n_clusters=4, init='k-means++'))
clusters = kmeans.fit_predict(X)`
  },
  {
    id: "dbscan",
    name: "DBSCAN Clustering",
    category: "clustering",
    categoryName: "Clustering",
    videoRef: "132 - DBSCAN Clustering Algorithms ｜ Density Based Clustering ｜ How DBSCAN Works ｜ CampusX [1_bLnsNmhCI].mp4",
    videoNum: "132",
    notebookPath: "",
    subtopics: ["Density-based clustering", "Eps radius", "MinSamples", "Core points", "Border points", "Noise detection", "K-Distance plot"],
    intuition: "Groups points based on spatial density. It defines clusters as continuous regions of high density, separated by low-density regions. Points in low-density regions are flagged as noise (-1).",
    advantages: [
      "No predefined cluster count required.",
      "Finds arbitrary shapes.",
      "Handles noise natively."
    ],
    disadvantages: [
      "Sensitive to `eps` and `min_samples` hyperparameters.",
      "Struggles with varying density clusters."
    ],
    bestPractices: [
      "Scale features first. Use a K-Distance plot elbow to set `eps`."
    ],
    code: `from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

dbscan = make_pipeline(StandardScaler(), DBSCAN(eps=0.5, min_samples=5))
clusters = dbscan.fit_predict(X)`
  },

  // CATEGORY: ADVANCED
  {
    id: "smote",
    name: "SMOTE (Synthetic Minority Over-sampling)",
    category: "advanced",
    categoryName: "Advanced (SMOTE/Optuna)",
    videoRef: "133 - Imbalanced Data in Machine Learning ｜ Undersampling ｜ Oversampling ｜ SMOTE [yh2AKoJCV3k].mp4",
    videoNum: "133",
    notebookPath: "",
    subtopics: ["Class Imbalance", "Synthetic interpolation", "imblearn Pipelines", "Over-optimistic evaluation"],
    intuition: "Addresses class imbalance. For each minority class point, it identifies its nearest minority neighbors, selects one, and interpolates new synthetic data points along the line segment connecting them.",
    advantages: [
      "Avoids information loss from undersampling.",
      "Reduces overfitting compared to simple duplication."
    ],
    disadvantages: [
      "Can introduce noise if minority samples are located near the majority boundary."
    ],
    bestPractices: [
      "ALWAYS run SMOTE ONLY on the training folds. Never apply it to the full dataset before validation/splitting, or you will leak data.",
      "Use `imblearn.pipeline.Pipeline` instead of scikit-learn's Pipeline so that SMOTE is automatically skipped during `predict()`."
    ],
    code: `# Requires: pip install imbalanced-learn
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

# Pipeline automatically applies SMOTE ONLY during fit(), not predict()
clf_pipeline = Pipeline(steps=[
    ('smote', SMOTE(random_state=42)),
    ('classifier', RandomForestClassifier(random_state=42))
])
clf_pipeline.fit(X_train, y_train)`
  },
  {
    id: "optuna",
    name: "Bayesian Optimization (Optuna)",
    category: "advanced",
    categoryName: "Advanced (SMOTE/Optuna)",
    videoRef: "134 - Hyperparameter Tuning using Optuna ｜ Bayesian Optimization using Optuna [E2b3SKMw934].mp4",
    videoNum: "134",
    notebookPath: "",
    subtopics: ["Bayesian hyperparameter optimization", "Dynamic search spaces", "Trial pruning", "Objective functions"],
    intuition: "An next-generation hyperparameter tuning framework. It uses Bayesian optimization to sample parameter spaces efficiently, focusing on regions that are statistically likely to yield better performance.",
    advantages: [
      "Drastically faster than GridSearch or RandomSearch on large spaces.",
      "Allows defining the search space dynamically inside standard Python control loops (if/else).",
      "Includes state-of-the-art pruning (early stopping of unpromising trials)."
    ],
    disadvantages: [
      "Requires writing a custom objective function.",
      "External library, not built directly into standard scikit-learn."
    ],
    bestPractices: [
      "Define clean ranges. Save study results in a database so you can resume interrupted runs. Plot the optimization history using `optuna.visualization`."
    ],
    code: `# Requires: pip install optuna
import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

def objective(trial):
    # Dynamically suggest hyperparameter values
    n_estimators = trial.suggest_int('n_estimators', 10, 200)
    max_depth = trial.suggest_int('max_depth', 2, 32)
    
    clf = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, random_state=42)
    score = cross_val_score(clf, X_train, y_train, cv=3).mean()
    return score

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50)
print(f"Best params: {study.best_params}")`
  }
];

// Export for ES6 modules if required
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TECHNIQUES_DB };
}
