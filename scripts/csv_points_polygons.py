import pandas as pd
import csv

# Load the CSV file
df = pd.read_csv('map/data/access_df.csv')

# Convert the 'points' column to string type
df['points'] = df['points'].astype(str)

# Remove rows where 'points' column is 'nan'
df = df[df['points'] != 'nan']

# Only keep the relevant columns
df_polygons = df[['geometry', 'sector_id', 'A', 'Q', 'H']]

# Save the DataFrame to a new CSV file
df_polygons.to_csv('map/data/access_df_polygons.csv', index=False)

# Replace the 'geometry' column with the 'points' column
df['geometry'] = df['points']

# Drop the 'points' column
df = df.drop(columns=['points'])

# Only keep the relevant columns
df_points = df[['geometry', 'sector_id', 'A', 'Q', 'H']]

# Save the DataFrame to a new CSV file
df_points.to_csv('map/data/access_df_points.csv', index=False)