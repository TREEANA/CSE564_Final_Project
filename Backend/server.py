import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
from matplotlib.patches import Patch
# task 4-a requirement 
from sklearn.manifold import MDS
from pandas.plotting import parallel_coordinates

import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import numpy as np
import seaborn as sns
from flask import Flask, jsonify
import json
from flask_cors import CORS

original_df = pd.read_csv('data.csv')

# Selecting numerical columns
numerical_cols = [col for col in original_df.columns if original_df[col].dtype in ['int64', 'float64']]

# Selecting categorical columns
categorical_cols = [col for col in original_df.columns if col not in numerical_cols]

numerical_cols =  [col for col in numerical_cols if col not in ['host_name', 'latitude', 'longitude']]

df = original_df[numerical_cols]

df2 = original_df[categorical_cols]

# Selecting all categorical columns except 'host_name'
categorical_cols_without_hostname = [col for col in categorical_cols if col != 'host_name']

# Creating a new dataframe with the selected columns
df2 = original_df[categorical_cols_without_hostname]

# Function to label top n categories and mark the rest as 'other'
def label_top_n_categories(column, top_n=8, other_label='other'):
    # Calculating frequency of each category
    value_counts = column.value_counts()
    # Labeling all categories except the top n as 'other'
    top_categories = value_counts.index[:top_n]
    return column.apply(lambda x: x if x in top_categories else other_label)

# Applying the function to all columns
for col in df2.columns:
   df2.loc[:, col] = label_top_n_categories(df2[col])
   
# Standardizing the data
scaler = StandardScaler()
X_standardized = scaler.fit_transform(df)
# X_standardized = MinMaxScaler().fit_transform(X_standardized)

# Finding the optimal k using the elbow method
sse = {}
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, max_iter=1000, random_state=14).fit(X_standardized)
    sse[k] = kmeans.inertia_

first_derivative = {k: sse[k] - sse[k-1] for k in range(2, 11)}
second_derivative = {k: first_derivative[k] - first_derivative[k-1] for k in range(3, 11)}
best_k = min(second_derivative, key=lambda k: abs(second_derivative[k]))

# Clustering with the optimal k
kmeans = KMeans(n_clusters=best_k, max_iter=1000, random_state=10).fit(X_standardized)
df['Cluster_ID'] = kmeans.labels_

# concat numerical_cols and  categorical_cols for pcp_plot 1
df_for_pcp = pd.concat([df, df2], axis=1)


mds_1 = MDS(n_components=2, metric=True, random_state=42)
X_mds = mds_1.fit_transform(X_standardized)

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route("/best_k")
def get_bestK():
    print("get_bestK")

    return str(best_k)

@app.route("/elbow_plot")
def elbow_plot():
    print("Get scree_plot")

    dict ={
        'x':list(sse.keys()),
        'y':list(sse.values())
    }

    return json.dumps(dict)


@app.route("/mds_plot_1/<int:k>")
def mds_plot_1(k):
    # Generating MDS plot
    print("mds_plot_1")
    user_K = int(k)

    kmeans = KMeans(n_clusters=user_K, max_iter=1000, random_state=10).fit(X_standardized)
    df['Cluster_ID'] = kmeans.labels_

    dict ={
        'points': df.to_dict(orient='records'), 
        'x':list(X_mds[:, 0]),
        'y':list(X_mds[:, 1])
    }

    return json.dumps(dict)
# task 4-b requirement 
@app.route("/mds_plot_2")
def mds_plot_2():

    # Generating MDS plot
    corr_matrix = df[numerical_cols].corr()

    # Converting correlation to distance (1 - |correlation|)
    distance_matrix = 1 - np.abs(corr_matrix)

    # Computing 2D representation of variables using metric MDS
    mds = MDS(n_components=2, metric=True, random_state=42, dissimilarity="precomputed")
    X_mds_variables = mds.fit_transform(distance_matrix)
    
    print("mds_plot_2")

    dict ={
        'points': df.to_dict(orient='records'), 
        'x':list(X_mds_variables[:, 0]),
        'y':list(X_mds_variables[:, 1]),
        'columns': list(corr_matrix.columns)
    }

    return json.dumps(dict)

@app.route("/pcp_plot_1/<int:k>")
def pcp_plot_1(k):

    user_K = int(k)
    kmeans = KMeans(n_clusters=user_K, max_iter=1000, random_state=10).fit(X_standardized)
    df['Cluster_ID'] = kmeans.labels_
    df_for_pcp = pd.concat([df, df2], axis=1)

    print("pcp_plot_1")
    data_dict = df_for_pcp.to_dict(orient='records')  
    return jsonify(data_dict)

@app.route("/pcp_plot_2/<int:k>")
def pcp_plot_2(k):
    user_K = int(k)
    kmeans = KMeans(n_clusters=user_K, max_iter=1000, random_state=10).fit(X_standardized)
    df['Cluster_ID'] = kmeans.labels_
    
    print("pcp_plot_2")
    data_dict = df.to_dict(orient='records')
    return jsonify(data_dict)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2000)