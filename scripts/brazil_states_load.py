import geopandas as gpd
import geobr

# Download data for all Brazilian states for the most recent year available
states = geobr.read_state(year=2019)

# Reset the index of the DataFrame
states['row_id'] = states.index + 1
states.reset_index(drop=True, inplace=True)
states.set_index('row_id', inplace=True)

# Save to a GeoJSON file
states.to_file("map/data/brazil_states.geojson", driver="GeoJSON")