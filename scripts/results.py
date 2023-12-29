import geopandas as gpd
import geobr
import pandas as pd

access_data_path = "data/access_df.csv"
common_column = "city_id"

# Load access data
access_df = pd.read_csv(access_data_path)

# Download geospatial data for Brazil's municipalities
cities_geom = geobr.read_municipality(code_muni='all', year=2010)

# Check for invalid geometries
# print(cities_geom.is_valid.sum())

# Convert city_id to the same data type as code_muni
# access_df['city_id'] = access_df['city_id'].astype(cities_geom['code_muni'].dtype)

# Merge access data with geospatial data
access_gdf = gpd.GeoDataFrame(access_df.merge(cities_geom, left_on='city_id', right_on='code_muni', how='inner'), geometry='geometry')

# Check the number of rows before and after to see how many were dropped
print("Before filtering: ", len(access_df))
print("After filtering: ", len(access_gdf))

# Convert the GeoDataFrame to GeoJSON
access_gdf.to_file("access_data.geojson", driver='GeoJSON')
print("GeoJSON file has been created successfully!")