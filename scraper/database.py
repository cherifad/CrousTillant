from datetime import datetime
import json
import psycopg2
from model.meal import Meal, FoodItem
from model.restaurant import Restaurant
from model.config import SupportedCrousModel
from model.scraping_log import ScrapingStatus, ScrapingLog

def insert_meals(meals: list[Meal], conn):
    """
    Inserts or updates meals in the database.

    Args:
        meals (list[Meal]): A list of Meal objects to be inserted or updated.

    Returns:
        None
    """
    # Connect to an existing database
    cur = conn.cursor()

    print(f"[{datetime.now()}] Checking for meals to insert or update in the database")        
    for meal in meals:
        if type(meal) is not Meal:
            meal = Meal(**meal)
        if meal.toUpdate:
            print(f"[{datetime.now()}] Updating meal {meal.title}")
            # update meal
            cur.execute(
                'UPDATE public."Meal" SET food_items = %s WHERE date = %s AND meal_type = %s AND title = %s',
                (json.dumps([FoodItem(**foodItem).toJsonObject() for foodItem in meal.foodItems]), meal.date, meal.mealType, meal.title))
        elif meal.toInsert:
            print(f"[{datetime.now()}] Inserting meal {meal.title} into the database")
            cur.execute(
                'INSERT INTO public."Meal" (date, title, food_items, meal_type, "restaurantId") VALUES (%s, %s, %s, %s, %s)',
                (meal.date, meal.title, json.dumps([FoodItem(**foodItem).toJsonObject() for foodItem in meal.foodItems]), meal.mealType, meal.restaurantId))
        else:
            print(f"[{datetime.now()}] Meal {meal.title} already up to date, skipping")
            continue

    # commit the transaction
    conn.commit()
    # close the cursor
    cur.close()

def insert_restaurants(restaurants, conn):
    """
    Inserts a list of restaurants into the database.

    Args:
        restaurants (list): A list of dictionaries representing the restaurants to be inserted.
            Each dictionary should contain the following keys:
            - name (str): The name of the restaurant.
            - place (str): The place of the restaurant.
            - schedule (str): The schedule of the restaurant.
            - url (str): The URL of the restaurant.
            - cp (str): The postal code of the restaurant.
            - address (str): The address of the restaurant.
            - city (str): The city of the restaurant.
            - phone (str): The phone number of the restaurant.
            - img (str): The image URL of the restaurant.
            - crous_id (str): The CROUS ID of the restaurant.
            - lat (float): The latitude coordinate of the restaurant.
            - lon (float): The longitude coordinate of the restaurant.

    Returns:
        None
    """
    print(f"[{datetime.now()}] Inserting {len(restaurants)} restaurants into the database")

    # Connect to an existing database
    cur = conn.cursor()

    for restaurant in restaurants:
        try:
            # insert restaurant
            cur.execute(
                'INSERT INTO public."Restaurant" (name, place, schedule, url, cp, address, city, phone, img, "crousId", lat, lng, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                (restaurant['name'], restaurant['place'], restaurant['schedule'], restaurant['url'], restaurant['cp'], restaurant['address'], restaurant['city'], restaurant['phone'], restaurant['img'], restaurant['crous_id'], restaurant['lat'], restaurant['lon'], datetime.now()))
        except psycopg2.DatabaseError as error:
            print(f"[{datetime.now()}] An error occurred while inserting the restaurants into the database: {e}")
            if conn:
                conn.rollback()
                print(error)
        except Exception as e:
            print(f"[{datetime.now()}] An error occurred while inserting the restaurants into the database: {e}")

    # commit the transaction
    conn.commit()
    # close the cursor
    cur.close()

def get_restaurants(crous_id, conn):
    """
    Retrieves restaurants from the database based on the provided Crous ID.

    Args:
        crous_id (int): The Crous ID of the restaurants to retrieve.

    Returns:
        list: A list of Restaurant objects representing the retrieved restaurants.
              Returns None if no restaurants are found.

    """
    # Connect to an existing database
    cur = conn.cursor()

    try:
        # get all the existing tables from the database schema
        cur.execute("SELECT id, name, place, schedule, url, cp, address, city, phone, img, \"crousId\", lat, lng FROM public.\"Restaurant\" WHERE \"crousId\" = %s", (crous_id,))
        restaurants = cur.fetchall()
        print(f"[{datetime.now()}] Found {len(restaurants)} restaurants in the database")

        returned_restaurants = [Restaurant(id=restaurant[0], name=restaurant[1], place=restaurant[2], schedule=restaurant[3], url=restaurant[4], cp=restaurant[5], address=restaurant[6], city=restaurant[7], phone=restaurant[8], img=restaurant[9], crous_id=restaurant[10], lat=restaurant[11], lon=restaurant[12]) for restaurant in restaurants]
        print(f"[{datetime.now()}] Successfully retrieved {len(returned_restaurants)} restaurants from the database")
        return returned_restaurants
    except psycopg2.DatabaseError as error:
        if conn:
            conn.rollback()
            print(f"[{datetime.now()}] An error occurred while retrieving the restaurants from the database: {error}")

def check_supported_crous(supported_crous_list: list[SupportedCrousModel], conn):
    """
    Checks if the supported Crous models are in the database. 
    The folder_name attribute of the SupportedCrousModel is NOT used to check.
    Id from model has to be the same too as the id from the database, if not update the record in the database.

    Args:
        supported_crous_list (list[SupportedCrousModel]): A list of supported Crous models to check.

    Returns:
        list[SupportedCrousModel]: A list of supported Crous models that are not in the database.
    """
    # Connect to an existing database
    cur = conn.cursor()

    print(f"[{datetime.now()}] Checking for supported Crous models in the database")

    # get all the existing tables from the database schema
    cur.execute("SELECT id, name, url FROM public.\"Crous\"")
    supported_crous = cur.fetchall()
    print(f"[{datetime.now()}] Found {len(supported_crous)} supported Crous in the database")

    # close the cursor
    cur.close()

    # compare the supported Crous models with the ones in the database, return the ones that are not in the database
    if len(supported_crous_list) == 0:
        # all supported Crous models are missing
        return supported_crous_list
    else:
        missing_supported_crous = []
        for crous in supported_crous_list:
            found = False
            for crous_db in supported_crous:
                if crous.id == crous_db[0]:
                    found = True
                    break
            if not found:
                missing_supported_crous.append(crous)

    return missing_supported_crous

def insert_supported_crous(supported_crous_list: list[SupportedCrousModel], conn):
    """
    Inserts a list of supported Crous models into the database.

    Args:
        supported_crous_list (list[SupportedCrousModel]): A list of supported Crous models to insert.

    Returns:
        None
    """
    print(f"[{datetime.now()}] Inserting {len(supported_crous_list)} supported Crous models into the database")

    # Connect to an existing database
    cur = conn.cursor()

    for crous in supported_crous_list:
        try:
            # insert supported Crous model
            cur.execute(
                'INSERT INTO public."Crous" (id, name, url, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)',
                (crous.id, crous.name, crous.url, datetime.now(), datetime.now()))
        except psycopg2.DatabaseError as error:
            print(f"[{datetime.now()}] An error occurred while inserting the supported Crous models into the database: {error}")
            if conn:
                conn.rollback()
        except Exception as e:
            print(f"[{datetime.now()}] An error occurred while inserting the supported Crous models into the database: {e}")

    # commit the transaction
    conn.commit()
    # close the cursor
    cur.close()

def insert_scraping_log(log: ScrapingLog, conn, update=False):
    """
    Inserts a scraping log into the database.

    Args:
        crous_id (int): The Crous ID of the scraping log to insert.
        started_at (datetime): The datetime when the scraping log was started.
        update (bool): If the scraping log is an update or not.

    Returns:
        int: The ID of the inserted scraping log.
    """
    print(f"[{datetime.now()}] Inserting a scraping log into the database")

    # Connect to an existing database
    cur = conn.cursor()

    try:
        if update:
            if log.id != -1:
                # update the scraping log
                cur.execute(
                    'UPDATE public."ScrapingLog" SET status = %s, error = %s, ended_at = %s WHERE id = %s',
                    (log.status.value, log.error, log.ended_at, log.id))
            else:
                print(f"[{datetime.now()}] No scraping log ID provided for the update")
        else:
            # insert the scraping log
            cur.execute(
                'INSERT INTO public."ScrapingLog" (\"crousId\", status, started_at, ended_at) VALUES (%s, %s, %s, %s) RETURNING id',
                (log.crous.id, log.status.value, log.started_at, datetime.now()))
            log.id = cur.fetchone()[0]
        
    except psycopg2.DatabaseError as error:
        print(f"[{datetime.now()}] An error occurred while inserting the scraping log into the database: {error}")
        print(log.status.value)
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"[{datetime.now()}] An error occurred while inserting the scraping log into the database: {e}")

    # commit the transaction
    conn.commit()

    # close the cursor
    cur.close()

    return log.id

def update_restaurant_scraping_status(restaurantId: int, status: ScrapingStatus, conn, error=None):
    """
    Updates the scraping status of a restaurant in the database.

    Args:
        restaurant (Restaurant): The restaurant to update.
        status (ScrapingStatus): The new status of the restaurant.
        error (str): The error message if the status is ERROR.

    Returns:
        None
    """

    # Connect to an existing database
    cur = conn.cursor()

    try:
        # update the restaurant
        cur.execute(
            'UPDATE public."Restaurant" SET last_scraping_at = %s, last_scraping_status = %s, last_scraping_error = %s WHERE id = %s',
            (datetime.now(), status.value, error, restaurantId))
    except psycopg2.DatabaseError as error:
        print(f"[{datetime.now()}] An error occurred while updating the restaurant scraping status in the database: {error}")
        if conn:
            conn.rollback()
    except Exception as e:
        print(f"[{datetime.now()}] An error occurred while updating the restaurant scraping status in the database: {e}")

    # commit the transaction
    conn.commit()
    # close the cursor
    cur.close()