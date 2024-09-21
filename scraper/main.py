import datetime
import os 
from model.config import Config
from scraper import get_all_meals, compare_and_insert_meals, get_restaurants
from database import get_restaurants as get_restaurants_db

if __name__ == '__main__':

    try:
        # clear the console
        os.system('cls' if os.name == 'nt' else 'clear')
        
        config = Config.loadConfig()
        if config is None:
            raise Exception("Failed to load the configuration file.")

        print(f"[{datetime.datetime.now()}] Loaded configuration: {config}")

        # look for required folders and files: json folder and error.log file
        if not os.path.exists('json'):
            raise Exception("The 'json' folder does not exist.")
        if not os.path.exists('error.log'):
            print(f"[{datetime.datetime.now()}] 'error.log' file does not exist. Creating it...")
            with open('error.log', 'w') as f:
                f.write(f"[{datetime.datetime.now()}] Created 'error.log' file.\n")

        # get the crous name from the config
        for supported_crous in config.supportedCrous:
            print("==============================================================================")
            print(f"[{datetime.datetime.now()}] Starting the scrapping process for {supported_crous.name}...")
            # if a folder with the crous name does not exist, create it and fetch the data, fetch the date if the folder exists but is empty
            if not os.path.exists(f'./json/{supported_crous.folder_name}') or len(os.listdir(f'./json/{supported_crous.folder_name}')) == 0:
                if not os.path.exists(f'./json/{supported_crous.folder_name}'):
                    os.makedirs(f'./json/{supported_crous.folder_name}')
                    print(f"[{datetime.datetime.now()}] Created folder for {supported_crous} in the 'json' directory.")


                #################### Restaurants scrapping ####################
                # get the restaurants from the crous website
                print(f"[{datetime.datetime.now()}] Starting the restaurants scrapping process for {supported_crous.name}...")
                get_restaurants(supported_crous.url, supported_crous.folder_name, supported_crous.id)
                print(f"[{datetime.datetime.now()}] Restaurants scrapping process completed successfully for {supported_crous.name}.")
                #################### Restaurants scrapping ####################\

            ####################### Meals scrapping #######################
            # get all the meals from the restaurants
            print(f"[{datetime.datetime.now()}] Scrapping meals from {supported_crous.name}...")
            restaurants = get_restaurants_db(supported_crous.id) # json.load(open(f'./json/{supported_crous.folder_name}/restaurants_{supported_crous.folder_name}.json'))
            get_all_meals(restaurants, supported_crous.folder_name)

            # compare and insert the meals into the database
            compare_and_insert_meals(supported_crous.folder_name)
            print(f"[{datetime.datetime.now()}] Scrapping meals completed successfully for {supported_crous.name}.")
            ####################### Meals scrapping #######################

        print(f"[{datetime.datetime.now()}] Scrapping process completed successfully.")
    except Exception as e:
        print(f'[ERROR] [{datetime.datetime.now()}] An error occurred during the scrapping process. {e}')

        #append the error to the log file
        if os.path.exists('json'):
            with open('error.log', 'a') as f:
                f.write(f'[ERROR] [{datetime.datetime.now()}] {e}\n')

        print(f"[{datetime.datetime.now()}] Scrapping process failed: {e}")

        exit(1)

    