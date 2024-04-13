import pandas as pd
import csv

# Load the CSV file
df = pd.read_csv('map/data/access_df.csv')

# Convert the 'points' column to string type
df['points'] = df['points'].astype(str)

# Remove rows where 'points' column is 'nan'
df = df[df['points'] != 'nan']

cols_to_keep = ['geometry', 'sector_id',
                'state_abbrev', 
                'city_name', 
                'neighborhood_name',
                'pct_white', 'avg_monthly_earnings',
                    'A', 'Q', 'H',
                   'A_percentile', 'Q_percentile', 'H_percentile', 
                   'A_normalized', 'H_normalized']

# Only keep the relevant columns
df_polygons = df[cols_to_keep]

# Save the DataFrame to a new CSV file
df_polygons.to_csv('map/data/access_df_polygons.csv', index=False)

# Replace the 'geometry' column with the 'points' column
df['geometry'] = df['points']

# Drop the 'points' column
df = df.drop(columns=['points'])

# Only keep the relevant columns
df_points = df[cols_to_keep]

# Save the DataFrame to a new CSV file
df_points.to_csv('map/data/access_df_points.csv', index=False)