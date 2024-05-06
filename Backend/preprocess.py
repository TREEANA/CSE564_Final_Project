import pandas as pd

file_path = "listings.csv"
columns = [
    'host_name', 'host_total_listings_count', 'room_type', 'accommodates',
    'bathrooms_text', 'bedrooms', 'bathrooms', 'host_acceptance_rate', 
    'number_of_reviews', 'review_scores_rating', 'review_scores_accuracy', 'review_scores_cleanliness', 
    'review_scores_communication', 'review_scores_location', 'review_scores_value', 'price', 
    'neighbourhood_cleansed', 'neighbourhood_group_cleansed', 'latitude', 'longitude'
]

rename_map = {
    "review_scores_rating": "rating",
    "review_scores_accuracy": "accuracy",
    "review_scores_cleanliness": "cleanliness",
    "review_scores_communication": "communication",
    "review_scores_location": "location",
    "review_scores_value": "value",
    "neighbourhood_cleansed": "neighbourhood",
    "neighbourhood_group_cleansed": "neighbourhood_group",
    "accommodates": "max_capacity"
}

data = pd.read_csv(file_path, usecols=columns).dropna()
data['price'] = data['price'].str.replace('$', '').str.replace(',', '').str.replace(' ', '')
data["price"] = data["price"].astype(float)

# Filter out outliers in the data
data = data[data["price"] <= 2000].reset_index(drop=True)
data = data[data["host_total_listings_count"] <= 500].reset_index(drop=True)
data = data.rename(rename_map, axis=1)

sampled_data = data.sample(n=5000, random_state=1)

sampled_data['host_acceptance_rate'] = sampled_data['host_acceptance_rate'].astype(str).str.replace('%', '').astype(int)

sampled_data.to_csv("data.csv", index=False)