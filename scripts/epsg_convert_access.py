# converts polygon objects to EPSG 4674

import geopandas as gpd

gdf = gpd.read_file("map/data/access_data_polygons.geojson")
gdf.crs = "epsg:5641"
gdf_conv = gdf.to_crs("epsg:4674")

# Reset the index of the GeoDataFrame
gdf_conv["row_id"] = gdf_conv.index + 1
gdf_conv.reset_index(drop=True, inplace=True)
gdf_conv.set_index("row_id", inplace = True)

gdf_conv.to_file("map/data/access_data_polygons_converted.geojson", driver="GeoJSON")