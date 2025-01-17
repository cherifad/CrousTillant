import datetime
import os
from dotenv import load_dotenv
from model.config import Config
from model.scraping_log import ScrapingStatus, ScrapingLog
from scraper import get_all_meals, compare_and_insert_meals, get_restaurants
from database import get_restaurants as get_restaurants_db, check_supported_crous, insert_supported_crous, insert_scraping_log
from utils import check_locale
from psycopg2 import pool

if __name__ == '__main__':

    locale_name = 'fr_FR.UTF-8'
    if not check_locale(locale_name):
        print("You'll need to install this locale on your system.")
        print("On Linux, you can run the following command to install the locale:")
        print(f"sudo locale-gen {locale_name}")
        print("sudo update-locale")
        exit(1)

    # Load .env file
    load_dotenv()

    # Get the connection string from the environment variable
    connection_string = os.getenv('DATABASE_URL')

    if connection_string is None:
        raise Exception("The 'DATABASE_URL' environment variable is not set.")

    # Create a connection pool
    connection_pool = pool.SimpleConnectionPool(
        1,  # Minimum number of connections in the pool
        10,  # Maximum number of connections in the pool
        connection_string
    )

    # Check if the pool was created successfully
    if connection_pool:
        print("Connection pool created successfully")
    else:
        raise Exception("Failed to create connection pool")

    # Get a connection from the pool
    conn = connection_pool.getconn()

    current_log = None

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

            # insert the log into the database
            current_log = ScrapingLog(-1, supported_crous, ScrapingStatus.PENDING, '', datetime.datetime.now(), None)
            current_log.id = insert_scraping_log(current_log, conn, False)

            ####################### Meals scrapping #######################
            # get all the meals from the restaurants
            print(f"[{datetime.datetime.now()}] Scrapping meals from {supported_crous.name}...")

            restaurants = get_restaurants_db(supported_crous.id, conn) # json.load(open(f'./json/{supported_crous.folder_name}/restaurants_{supported_crous.folder_name}.json'))
            get_all_meals(restaurants, supported_crous.folder_name, conn)

            # compare and insert the meals into the database
            compare_and_insert_meals(supported_crous.folder_name, conn)

            current_log.status = ScrapingStatus.SUCCESS
            current_log.ended_at = datetime.datetime.now()
            # update the log in the database
            insert_scraping_log(current_log, conn, True)

            print(f"[{datetime.datetime.now()}] Scrapping meals completed successfully for {supported_crous.name}.")
            ####################### Meals scrapping #######################

        # Close all connections in the pool
        connection_pool.closeall()

        print(f"[{datetime.datetime.now()}] Scrapping process completed successfully.")
    except Exception as e:
        print(f'[ERROR] [{datetime.datetime.now()}] An error occurred during the scrapping process. {e}')

        # insert the log into the database
        if current_log is not None and current_log.id != -1:
            current_log.status = ScrapingStatus.ERROR
            current_log.error = str(e)
            current_log.ended_at = datetime.datetime.now()
            insert_scraping_log(current_log, conn, True)

        #append the error to the log file
        if os.path.exists('json'):
            with open('error.log', 'a') as f:
                f.write(f'[ERROR] [{datetime.datetime.now()}] {e}\n')

        print(f"[{datetime.datetime.now()}] Scrapping process failed: {e}")

        exit(1)

    