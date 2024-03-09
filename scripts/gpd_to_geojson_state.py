import geopandas as gpd
import pandas as pd
from shapely import wkt, ops

access_data_path = "map/data/state_access_df.csv"

# Load access data
state_access_df = pd.read_csv(access_data_path)
print(state_access_df)

# Ensure the geometry column is in a format that can be interpreted as such, i.e. WKT
state_access_df['geometry'] = state_access_df['geometry'].apply(wkt.loads)
print(state_access_df)

# Ensure polygons follow the right-hand rule and the first and last positions are the same
state_access_df['geometry'] = state_access_df['geometry'].apply(lambda geom: ops.transform(lambda x, y, z=None: (x, y), ops.orient(geom)))

# Convert the DataFrame to a GeoDataFrame
state_access_gdf = gpd.GeoDataFrame(state_access_df, geometry='geometry')
print(state_access_gdf)

# Reset the index of the GeoDataFrame
state_access_gdf["row_id"] = state_access_gdf.index + 1
state_access_gdf.reset_index(drop=True, inplace=True)
state_access_gdf.set_index("row_id", inplace = True)

# Convert the GeoDataFrame to GeoJSON
output_geojson_path = "map/data/access_data_state_new.geojson"
try:
    state_access_gdf.to_file(output_geojson_path, driver='GeoJSON')
    print(f"GeoJSON file has been created successfully at {output_geojson_path}!")
except Exception as e:
    print(f"Failed to write GeoJSON file: {e}")