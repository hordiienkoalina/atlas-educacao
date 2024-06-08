import pandas as pd

# Step 1: Read the state_access_df CSV file
state_access_df = pd.read_csv('./public/data/state_access_df.csv')

# Step 2: Create a mapping of abbrev_state to name_state
state_name_mapping = dict(zip(state_access_df['abbrev_state'], state_access_df['name_state']))

# Function to add name_state to a DataFrame
def add_name_state(df, state_name_mapping):
    if 'abbrev_state' in df.columns:
        df['name_state'] = df['abbrev_state'].map(state_name_mapping)
    else:
        print(f"Warning: 'abbrev_state' column not found in DataFrame")
    return df

# List of CSV files to update (excluding state_access_df)
csv_files = [
    './public/data/access_df.csv',
    './public/data/microregion_access_df.csv',
    './public/data/municipality_access_df.csv',
    './public/data//school_census.csv',
    './public/data//school_census.csv'
]

# Step 3: Read, merge, and save each CSV file
for file in csv_files:
    try:
        df = pd.read_csv(file, low_memory=False)
        df = add_name_state(df, state_name_mapping)
        df.to_csv(file, index=False)  # Save the updated DataFrame back to the CSV file
        print(f"Updated {file} successfully.")
    except Exception as e:
        print(f"Error processing {file}: {e}")
