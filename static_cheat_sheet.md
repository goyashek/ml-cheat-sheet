# CampusX 100 Days of ML: Expanded Static Cheat Sheet

This offline cheat sheet contains a highly detailed, categorized directory of the **52 core machine learning techniques, preprocessing methods, and model concepts** covered in the course. Each entry includes detailed mathematical intuition, advantages/disadvantages, best practices, video references, and ready-to-use scikit-learn code templates.

---

## 📁 Table of Contents
1. [Feature Scaling](#1-feature-scaling)
2. [Categorical Encoding](#2-categorical-encoding)
3. [Feature Transformers & Pipelines](#3-feature-transformers--pipelines)
4. [Advanced Preprocessing](#4-advanced-preprocessing)
5. [Missing Values Imputation](#5-missing-values-imputation)
6. [Outlier Handling](#6-outlier-handling)
7. [Dimensionality Reduction](#7-dimensionality-reduction)
8. [Supervised Regression & Regularization](#8-supervised-regression--regularization)
9. [Supervised Classification](#9-supervised-classification)
10. [Ensemble Methods](#10-ensemble-methods)
11. [Clustering](#11-clustering)
12. [Imbalanced Data & Tuning](#12-imbalanced-data--tuning)

---

## 1. Feature Scaling

### Standardization (StandardScaler)
*   **Intuition:** Centers features to mean=0 and standard deviation=1. Calculated as:
    $$z = \frac{x - \mu}{\sigma}$$
*   **Best Used For:** Distance-based models (KNN, SVM) and gradient descent models (Linear/Logistic Regression, Neural Networks).
*   **Advantages:** Preserves the shape of the original distribution; handles values that are not strictly bounded.
*   **Disadvantages:** Sensitive to outliers since mean and standard deviation are not robust statistics.
*   **Local Video:** `24 Feature Scaling - Standardization ｜ Day 24 ｜ 100 Days of Machine Learning [1Yw9sC0PNwY].mp4`
*   **Local Notebook:** `Code/day24-standardization/day24.ipynb`
*   **Code:**
    ```python
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    ```

### Normalization (MinMaxScaler)
*   **Intuition:** Scales features to a fixed range, usually $[0, 1]$. Calculated as:
    $$x_{scaled} = \frac{x - x_{min}}{x_{max} - x_{min}}$$
*   **Best Used For:** Algorithms that require strictly bounded ranges (Neural Networks, KNN).
*   **Advantages:** Compresses values to a clean boundary; preserves zero values in sparse matrices.
*   **Disadvantages:** Highly sensitive to outliers (compresses normal values).
*   **Local Video:** `25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import MinMaxScaler
    scaler = MinMaxScaler()
    X_train_norm = scaler.fit_transform(X_train)
    ```

### Robust Scaling (RobustScaler)
*   **Intuition:** Scales features using median and IQR. Calculated as:
    $$x_{scaled} = \frac{x - Median}{IQR}$$
*   **Best Used For:** Datasets containing significant outliers that cannot be dropped.
*   **Advantages:** Outliers do not skew the scaling factors because median and IQR are robust statistics.
*   **Local Video:** `25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import RobustScaler
    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    ```

### MaxAbs Scaling (MaxAbsScaler)
*   **Intuition:** Scales each feature by dividing by its maximum absolute value:
    $$x_{scaled} = \frac{x}{|x_{max}|}$$
*   **Best Used For:** Sparse matrices (e.g., TF-IDF text features) that need scaling.
*   **Advantages:** Preserves zeros in sparse matrices, saving memory.
*   **Local Video:** `25 Feature Scaling - Normalization ｜ MinMaxScaling ｜ MaxAbsScaling ｜ RobustScaling [eBrGyuA2MIg].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import MaxAbsScaler
    scaler = MaxAbsScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    ```

---

## 2. Categorical Encoding

### Ordinal Encoding (OrdinalEncoder)
*   **Intuition:** Converts categories to integers ($0, 1, 2...$) based on a rank order.
*   **Best Used For:** Ordinal features (ordered, e.g. Education: School=0, UG=1, PG=2).
*   **Local Video:** `26 Encoding Categorical Data ｜ Ordinal Encoding ｜ Label Encoding [w2GglmYHfmM].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import OrdinalEncoder
    edu_order = ['School', 'Bachelors', 'Masters', 'PhD']
    encoder = OrdinalEncoder(categories=[edu_order])
    X_train_encoded = encoder.fit_transform(X_train[['education']])
    ```

### One-Hot Encoding (OneHotEncoder)
*   **Intuition:** Converts categorical features into multiple binary columns.
*   **Best Used For:** Nominal features (no order, e.g., Country, Gender).
*   **Local Video:** `27 One Hot Encoding ｜ Handling Categorical Data ｜ Day 27 ｜ 100 Days of Machine Learning [U5oCv3JKWKA].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import OneHotEncoder
    ohe = OneHotEncoder(drop='first', sparse_output=False) # modern syntax
    X_train_ohe = ohe.fit_transform(X_train[['city']])
    ```

### Target Encoding (TargetEncoder)
*   **Intuition:** Replaces categories with the target variable's mean for that category, smoothed to prevent leakage.
*   **Best Used For:** High-cardinality nominal columns (e.g. Zip codes, Device IDs).
*   **Code:**
    ```python
    from sklearn.preprocessing import TargetEncoder # scikit-learn >= 1.2
    encoder = TargetEncoder(smooth="auto", cv=5)
    X_train_encoded = encoder.fit_transform(X_train[['zip_code']], y_train)
    ```

---

## 3. Feature Transformers & Pipelines

### ColumnTransformer
*   **Intuition:** Applies specific transformations to specific subsets of columns in parallel.
*   **Local Video:** `28 Column Transformer in Machine Learning ｜ How to use ColumnTransformer in Sklearn [5TVj6iEBR4I].mp4`
*   **Code:**
    ```python
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import StandardScaler, OneHotEncoder
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['age', 'fare']),
            ('cat', OneHotEncoder(drop='first'), ['gender'])
        ], remainder='passthrough')
    X_train_processed = preprocessor.fit_transform(X_train)
    ```

### Pipelines
*   **Intuition:** Chains preprocessing steps and a model estimator sequentially.
*   **Local Video:** `29 Machine Learning Pipelines A-Z ｜ Day 29 ｜ 100 Days of Machine Learning [xOccYkgRV4Q].mp4`
*   **Code:**
    ```python
    from sklearn.pipeline import Pipeline
    from sklearn.ensemble import RandomForestClassifier
    
    clf = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier())
    ])
    clf.fit(X_train, y_train)
    ```

### Log Transformation
*   **Intuition:** Applies natural logarithm to features: $y = \log(x + 1)$ to normalize right-skewed data.
*   **Local Video:** `30 Function Transformer ｜ Log Transform ｜ Reciprocal Transform ｜ Square Root Transform [cTjj3LE8E90].mp4`
*   **Code:**
    ```python
    import numpy as np
    from sklearn.preprocessing import FunctionTransformer
    log_transformer = FunctionTransformer(np.log1p)
    X_train_log = log_transformer.fit_transform(X_train[['fare']])
    ```

### Power Transformers (Box-Cox & Yeo-Johnson)
*   **Intuition:** Automatically finds parameters to transform data into a normal distribution.
*   **Local Video:** `31 Power Transformer ｜ Box - Cox Transform ｜ Yeo - Johnson Transform [lV_Z4HbNAx0].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import PowerTransformer
    pt = PowerTransformer(method='yeo-johnson')
    X_train_norm = pt.fit_transform(X_train[['income', 'profit']])
    ```

### Binarization & Discretization (Binning)
*   **Intuition:** Splits continuous features into discrete intervals (bins) or binary flags.
*   **Local Video:** `32 Binning and Binarization ｜ Discretization ｜ Quantile Binning ｜ KMeans Binning [kKWsJGKcMvo].mp4`
*   **Code:**
    ```python
    from sklearn.preprocessing import KBinsDiscretizer
    discretizer = KBinsDiscretizer(n_bins=5, encode='ordinal', strategy='kmeans')
    X_train_bins = discretizer.fit_transform(X_train[['age']])
    ```

---

## 4. Advanced Preprocessing

### Handling Mixed Variables
*   **Intuition:** Splits columns containing combined alphanumeric strings (e.g. cabin 'C123') into separate numerical and categorical features.
*   **Local Video:** `33 Handling Mixed Variables ｜ Feature Engineering [9xiX-I5_LQY].mp4`
*   **Code:**
    ```python
    import pandas as pd
    # Custom regex splits
    df['cabin_num'] = pd.to_numeric(df['cabin'].str.extract('(\\d+)'), errors='coerce')
    df['cabin_cat'] = df['cabin'].str.extract('([a-zA-Z]+)')
    ```

### Handling Date & Time Variables
*   **Intuition:** Parses date strings to extract numerical features (year, month, day of week) and cyclical sine/cosine features.
*   **Local Video:** `34 Handling Date and Time Variables ｜ Day 34 ｜ 100 Days of Machine Learning [J73mvgG9fFs].mp4`
*   **Code:**
    ```python
    import numpy as np
    df['date'] = pd.to_datetime(df['date_string'])
    df['month'] = df['date'].dt.month
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
    ```

### Feature Construction & Feature Splitting
*   **Intuition:** Builds new features (e.g. FamilySize = SibSp + Parch + 1) or splits strings (e.g. Names into titles).
*   **Local Video:** `45 Feature Construction ｜ Feature Splitting [ma-h30PoFms].mp4`

---

## 5. Missing Values Imputation

### Complete Case Analysis (CCA)
*   **Intuition:** Drop rows containing missing values. Only use if missingness is <5% and random.
*   **Local Video:** `35 Handling Missing Data ｜ Part 1 ｜ Complete Case Analysis [aUnNWZorGmk].mp4`

### Mean & Median Imputation
*   **Intuition:** Replaces numerical NaNs with mean (for normal features) or median (for skewed features).
*   **Local Video:** `36 Handling missing data ｜ Numerical Data ｜ Simple Imputer [mCL2xLBDw8M].mp4`

### Categorical Imputation
*   **Intuition:** Replaces categorical NaNs with mode or a new category named 'Missing'.
*   **Local Video:** `37 Handling Missing Categorical Data ｜ Simple Imputer ｜ Most Frequent Imputation ｜ Missing Category Imp [l_Wip8bEDFQ].mp4`

### Missing Indicator
*   **Intuition:** Adds a helper binary column indicating if the value was originally missing.
*   **Local Video:** `38 Missing Indicator ｜ Random Sample Imputation ｜ Handling Missing Data Part 4 [Ratcir3p03w].mp4`

### KNN Imputation
*   **Intuition:** Imputes missing values based on similarity to nearest neighbors. Scale features first!
*   **Local Video:** `39 KNN Imputer ｜ Multivariate Imputation ｜ Handling Missing Data Part 5 [-fK-xEev2I8].mp4`

### Iterative Imputer (MICE)
*   **Intuition:** Models each feature with missing values as a function of all other features in a round-robin loop.
*   **Local Video:** `40 Multivariate Imputation by Chained Equations for Missing Value ｜ MICE Algorithm ｜ Iterative Imputer [a38ehxv3kyk].mp4`

---

## 6. Outlier Handling

### Z-Score Method
*   **Intuition:** Limits outliers as values beyond 3 standard deviations from the mean. Assumes Gaussian distribution.
*   **Local Video:** `42 Outlier Detection and Removal using Z-score Method ｜ Handling Outliers Part 2 [OnPE-Z8jtqM].mp4`

### IQR Method
*   **Intuition:** Capping or trimming values outside $[Q1 - 1.5 \times IQR, Q3 + 1.5 \times IQR]$. Works for skewed data.
*   **Local Video:** `43 Outlier Detection and Removal using the IQR Method ｜ Handing Outliers Part 3 [Ccv1-W5ilak].mp4`

### Percentile Method / Winsorization
*   **Intuition:** Caps extreme values at defined percentile thresholds (e.g. 1% and 99%).
*   **Local Video:** `44 Outlier Detection using the Percentile Method ｜ Winsorization Technique [bcXA4CqRXvM].mp4`

---

## 7. Dimensionality Reduction

### Principal Component Analysis (PCA)
*   **Intuition:** Projects high-dimensional data onto orthogonal directions of maximum variance.
*   **Local Video:** `47 Principle Component Analysis  (PCA) ｜ Part 1 ｜ Geometric Intuition [iRbsBi5W0-c].mp4`
*   **Code:**
    ```python
    from sklearn.decomposition import PCA
    pca = PCA(n_components=0.95) # Retain 95% of explained variance
    X_train_pca = pca.fit_transform(X_train_scaled)
    ```

---

## 8. Supervised Regression & Regularization

### Linear Regression (Simple & Multiple)
*   **Intuition:** Models linear trends by minimizing sum of squared residuals (OLS).
*   **Local Video:** `53 Multiple Linear Regression ｜ Geometric Intuition & Code [ashGekqstl8].mp4`

### Assumptions of Linear Regression
*   **Intuition:** Five statistical assumptions: Linearity, Homoscedasticity (constant residual variance), Normality of residuals, No Multicollinearity (check VIF), and No Autocorrelation.
*   **Local Video:** `56 What are the main Assumptions of Linear Regression？ ｜ Top 5 Assumptions of Linear Regression [EmSNAtcHLm8].mp4`

### Gradient Descent Variations
*   **Intuition:** Optimization algorithm. Batch GD updates weights using all rows, Stochastic GD (SGD) updates after every single row, Mini-batch GD updates after small batches (e.g. 32 rows).
*   **Local Video:** `57 Gradient Descent From Scratch ｜ End to End Gradient Descent ｜ Gradient Descent Animation [ORyfPJypKuU].mp4`

### Polynomial Regression
*   **Intuition:** Fits curved patterns by adding raised feature power variables.
*   **Local Video:** `61 Polynomial Regression ｜ Machine Learning [BNWLf3cKdbQ].mp4`

### Regularization (Ridge / Lasso / ElasticNet)
*   **Intuition:** Ridge adds squared weights penalty (L2). Lasso adds absolute weights penalty (L1) and zeros coefficients (feature selection). ElasticNet combines both.
*   **Local Video:** `63 Ridge Regression Part 1`, `67 Lasso Regression`, `69 ElasticNet Regression`

---

## 9. Supervised Classification

### Logistic & Softmax Regression
*   **Intuition:** Logistic fits linear boundary mapped through Sigmoid for binary tasks. Softmax generalizes this to multiclass using exponent normalized outputs.
*   **Local Video:** `70 Logistic Regression Part 1` & `079 - Softmax Regression`

### Naive Bayes Classifier
*   **Intuition:** Probabilistic classifier utilizing Bayes' Theorem under feature independence assumptions.
*   **Local Video:** `088 - Naive Bayes Classifier Part 7 - Mathematics`

### K-Nearest Neighbors (KNN)
*   **Intuition:** Distance-based lazy learner classifying points using votes from neighbor data.
*   **Local Video:** `091 - What is K Nearest Neighbors？`

### Support Vector Machines (SVC & SVR)
*   **Intuition:** Maximizes margins between classes. Kernel trick handles non-linearity. SVR fits regression values inside an epsilon margins tube.
*   **Local Video:** `092 - Support Vector Machines` & `095 - Kernel Trick`

### Decision Trees & dtreeviz
*   **Intuition:** Recursively splits data using Information Gain. High variance, prune to stabilize. dtreeviz outputs detailed graphical tree split diagrams.
*   **Local Video:** `097 - Decision Trees` & `100 - Awesome Decision Tree Visualization`

---

## 10. Ensemble Methods

### Voting Ensemble
*   **Intuition:** Combines predictions of heterogeneous base models via hard voting (majority counts) or soft voting (average probabilities).
*   **Local Video:** `103 - Voting Ensemble Part 2`

### Bagging & Pasting
*   **Intuition:** Trains base estimators in parallel on bootstrap samples (with replacement) or pasting samples (without replacement).
*   **Local Video:** `106 - Bagging Ensemble`

### Random Forest
*   **Intuition:** Ensemble of decorrelated trees using bootstrap samples and random feature subsets.
*   **Local Video:** `108 - Introduction to Random Forest`

### Boosting (AdaBoost, Gradient Boosting, XGBoost)
*   **Intuition:** Sequential models. AdaBoost adjusts sample weights based on errors. Gradient Boosting predicts residual errors of previous steps. XGBoost is an optimized regularized implementation.
*   **Local Video:** `115 - AdaBoost`, `120 - Gradient Boosting`, `123 - XGBoost`

### Stacking & Blending
*   **Intuition:** Combines base model predictions using a meta-classifier.
*   **Local Video:** `127 - Stacking and Blending Ensembles.mp4`

---

## 11. Clustering

### K-Means Clustering
*   **Intuition:** Groups data into $K$ spherical clusters using distance to centroids.
*   **Local Video:** `128 - K-Means Clustering Algorithm`

### DBSCAN Clustering
*   **Intuition:** Density-based clustering grouping contiguous core points, flagging outliers as noise (-1).
*   **Local Video:** `132 - DBSCAN Clustering Algorithms`

---

## 12. Imbalanced Data & Tuning

### SMOTE
*   **Intuition:** Synthesizes minority samples by interpolating between nearest minority neighbors. Always apply ONLY to training folds to prevent data leakage.
*   **Local Video:** `133 - Imbalanced Data in Machine Learning ｜ Undersampling ｜ Oversampling ｜ SMOTE.mp4`
*   **Code:**
    ```python
    from imblearn.over_sampling import SMOTE
    from imblearn.pipeline import Pipeline
    from sklearn.ensemble import RandomForestClassifier
    
    # imblearn pipeline restricts SMOTE only to training folds
    pipeline = Pipeline([
        ('smote', SMOTE(random_state=42)),
        ('classifier', RandomForestClassifier())
    ])
    pipeline.fit(X_train, y_train)
    ```

### Optuna
*   **Intuition:** Bayesian hyperparameter search framework using statistical surrogate models to converge on optimal configurations.
*   **Local Video:** `134 - Hyperparameter Tuning using Optuna`
