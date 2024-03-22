import geopandas as gpd
import pandas as pd
from shapely import wkt, ops

access_data_path = "map/data/microregion_access_df.csv"

# Load access data
microregion_access_df = pd.read_csv(access_data_path)
print(microregion_access_df)

# Ensure the geometry column is in a format that can be interpreted as such, i.e. WKT
microregion_access_df['geometry'] = microregion_access_df['geometry'].apply(wkt.loads)
print(microregion_access_df)

# Ensure polygons follow the right-hand rule and the first and last positions are the same
microregion_access_df['geometry'] = microregion_access_df['geometry'].apply(lambda geom: ops.transform(lambda x, y, z=None: (x, y), ops.orient(geom)))

# Convert the DataFrame to a GeoDataFrame
microregion_access_gdf = gpd.GeoDataFrame(microregion_access_df, geometry='geometry')
print(microregion_access_gdf)

# Reset the index of the GeoDataFrame
microregion_access_gdf["row_id"] = microregion_access_gdf.index + 1
microregion_access_gdf.reset_index(drop=True, inplace=True)
microregion_access_gdf.set_index("row_id", inplace = True)

# Convert the GeoDataFrame to GeoJSON
output_geojson_path = "map/data/access_data_microregion_new.geojson"
try:
    microregion_access_gdf.to_file(output_geojson_path, driver='GeoJSON')
    print(f"GeoJSON file has been created successfully at {output_geojson_path}!")
except Exception as e:
    print(f"Failed to write GeoJSON file: {e}")