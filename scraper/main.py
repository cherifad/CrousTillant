import datetime
import os
from dotenv import load_dotenv
from model.config import Config
from scraper import get_all_meals, compare_and_insert_meals, get_restaurants
from database import get_restaurants as get_restaurants_db, check_supported_crous, insert_supported_crous
from psycopg2 import pool

if __name__ == '__main__':

    # Load .env file
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.getenv('DATABASE_URL')

    # Create a connection pool
    connection_pool = pool.SimpleConnectionPool(
        1,  # Minimum number of connections in the pool
        10,  # Maximum number of connections in the pool
        connection_string
    )

    # Check if the pool was created successfully
    if connection_pool:
        print("Connection pool created successfully")

    # Get a connection from the pool
    conn = connection_pool.getconn()

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

        # check if the supported crous are in the database
        missing_crous = check_supported_crous(config.supportedCrous, conn)
        
        if len(missing_crous) > 0:
            # insert the missing crous into the database
            insert_supported_crous(missing_crous, conn)

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
                get_restaurants(supported_crous.url, supported_crous.folder_name, supported_crous.id, conn)
                print(f"[{datetime.datetime.now()}] Restaurants scrapping process completed successfully for {supported_crous.name}.")
                #################### Restaurants scrapping ####################\

            ####################### Meals scrapping #######################
            # get all the meals from the restaurants
            print(f"[{datetime.datetime.now()}] Scrapping meals from {supported_crous.name}...")

            restaurants = get_restaurants_db(supported_crous.id, conn) # json.load(open(f'./json/{supported_crous.folder_name}/restaurants_{supported_crous.folder_name}.json'))
            get_all_meals(restaurants, supported_crous.folder_name)

            # compare and insert the meals into the database
            compare_and_insert_meals(supported_crous.folder_name, conn)
            print(f"[{datetime.datetime.now()}] Scrapping meals completed successfully for {supported_crous.name}.")
            ####################### Meals scrapping #######################

        # Close all connections in the pool
        connection_pool.closeall()

        print(f"[{datetime.datetime.now()}] Scrapping process completed successfully.")
    except Exception as e:
        print(f'[ERROR] [{datetime.datetime.now()}] An error occurred during the scrapping process. {e}')

        #append the error to the log file
        if os.path.exists('json'):
            with open('error.log', 'a') as f:
                f.write(f'[ERROR] [{datetime.datetime.now()}] {e}\n')

        print(f"[{datetime.datetime.now()}] Scrapping process failed: {e}")

        exit(1)

    