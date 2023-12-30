import geopandas as gpd
import pandas as pd
from shapely import wkt

access_data_path = "data/access_df.csv"

# Load access data
access_df = pd.read_csv(access_data_path)

# Ensure the geometry column is in a format that can be interpreted as such, i.e. WKT
geometry = 'geometry'
access_df[geometry] = access_df[geometry].apply(wkt.loads)

# Convert the DataFrame to a GeoDataFrame and set the CRS at the same time
access_gdf = gpd.GeoDataFrame(access_df, geometry=geometry, crs="EPSG:4326")

# Convert the GeoDataFrame to GeoJSON
output_geojson_path = "access_data.geojson"
access_gdf.to_file(output_geojson_path, driver='GeoJSON')
print(f"GeoJSON file has been created successfully at {output_geojson_path}!")