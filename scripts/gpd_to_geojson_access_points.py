import pandas as pd
import geopandas as gpd
from shapely import wkt

# Load the CSV file
df = pd.read_csv('map/data/access_df_points.csv')

# Convert 'geometry' to GeoSeries
df['geometry'] = df['geometry'].apply(wkt.loads)

# Convert DataFrame to GeoDataFrame
gdf = gpd.GeoDataFrame(df, geometry='geometry')

# Reset the index of the GeoDataFrame
gdf["row_id"] = gdf.index + 1
gdf.reset_index(drop=True, inplace=True)
gdf.set_index("row_id", inplace = True)

# Export to GeoJSON
gdf.to_file("map/data/access_data_points.geojson", driver='GeoJSON')