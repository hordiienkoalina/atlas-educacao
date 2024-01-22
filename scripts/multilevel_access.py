# Previously: Access metric at different levels.ipynb
# Reformatted for consistency

import pandas as pd
import geobr
import numpy as np
from pathlib import Path

basepath = str(Path.cwd().parent) + '/access-to-education/map/data'

# Load Access Data
access_data_path = "map/data/access_df.csv"
access_df = pd.read_csv(access_data_path)

# Define Levels
municipalities_df = geobr.read_municipality(year=2010) # Municipalities
microregion_df = geobr.read_micro_region(year=2010, ) # Microregions
region_df = geobr.read_region(year=2010) # Region
state_df = geobr.read_state(year=2010) # State
country_df = geobr.read_country(year=2010) # Country

# Calculate Access Metrics at Different Levels
def weighted_average(group):
    weights = group['n_people_15to17']
    
    # Select all numerical columns
    numerical_columns = group.select_dtypes(include=[np.number]).columns
    
    weighted_averages = {}
    for col in numerical_columns:
        weighted_averages[col] = np.average(group[col], weights=weights)
    
    return pd.Series(weighted_averages)

agg_dict = {'sum':['n_people',
    'n_households',
    'n_people_15to17_white', 'n_people_15to17_black',
    'n_people_15to17_asian', 'n_people_15to17_parda',
    'n_people_15to17_indigenous', 'n_people_15', 'n_people_16',
    'n_people_17', 'n_people_15_men', 'n_people_16_men', 'n_people_17_men',
    'n_people_15_women', 'n_people_16_women', 'n_people_17_women',
    'n_people_15to17dem', 'n_people_15to17_alternative'
], 

    'weighted_average':['A', 'Q', 'H',
    'pct_black', 'pct_white', 'pct_indigenous', 'pct_pardos', 'pct_asian',
    'pct_men']}

# Define a custom function for weighted average
def weighted_avg(group):
    weights = group['n_people_15to17']

    columns_to_average = agg_dict['weighted_average']
    weighted_averages = {}
    for col in columns_to_average:
        weighted_averages[col] = np.average(group[col], weights=weights)
    
    return pd.Series(weighted_averages)

# Renaming variables
access_df = access_df.rename(columns = {'city_id':'code_muni', 'microregion_id':'code_micro', 'state_id':'code_state'})

# Filling NaN values for the regions that do not have a school nearby
access_df[["A", "Q", "H"]] = access_df[["A", "Q", "H"]].fillna(0)

def new_access_level(previous_level, new_level_df, new_level_name):

    # Group by 'Category'
    grouped = previous_level.groupby(new_level_name)

    # Calculate sum of 'Quantity' and 'Price'
    sum_columns = grouped[agg_dict['sum']].sum().reset_index()


    # Calculate weighted average of 'Value' using 'Weight'
    weighted_average = grouped.apply(weighted_avg).reset_index(drop=True)#[agg_dict['weighted_average']]

    # Combine the sum and weighted average DataFrames
    result_df = pd.concat([sum_columns, weighted_average], axis=1)

    new_level_access_df = result_df.merge(new_level_df, on=new_level_name, how='right')

    return new_level_access_df

# Municipality
municipalities_access_df = new_access_level(access_df, municipalities_df, 'code_muni')
municipalities_access_df.to_csv(f"{basepath}/municipality_access_df.csv")

# Microregion
microregion_access_df = new_access_level(access_df, microregion_df, 'code_micro')
microregion_access_df.to_csv(f"{basepath}/microregion_access_df.csv")

# State
state_access_df = new_access_level(access_df, state_df, 'code_state')
state_access_df.to_csv(f"{basepath}/state_access_df.csv")