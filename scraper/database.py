from datetime import datetime
import json
import psycopg
from model.meal import Meal, FoodItem
from model.restaurant import Restaurant
import os

db_connection = os.getenv('DATABASE_URL')

if db_connection is None:
    print("Database connection string not found, please set the DATABASE_URL environment variable")
    db_connection = 'dbname=smartru user=postgres password=postgres host=localhost port=5432'

def insert_meals(meals: list[Meal]):
    """
    Inserts or updates meals in the database.

    Args:
        meals (list[Meal]): A list of Meal objects to be inserted or updated.

    Returns:
        None
    """
    # Connect to an existing database
    with psycopg.connect(db_connection) as conn:
        print(f"[{datetime.now()}] Checking for meals to insert or update in the database")

        # Open a cursor to perform database operations
        with conn.cursor() as cur:          

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

            # Make the changes to the database persistent
            conn.commit()

def insert_restaurants(restaurants):
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
    # Connect to an existing database
    with psycopg.connect(db_connection) as conn:

        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            print(f"[{datetime.now()}] Inserting {len(restaurants)} restaurants into the database")

            for restaurant in restaurants:
                try:
                    # insert restaurant
                    cur.execute(
                        'INSERT INTO public."Restaurant" (name, place, schedule, url, cp, address, city, phone, img, "crousId", lat, lng, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                        (restaurant['name'], restaurant['place'], restaurant['schedule'], restaurant['url'], restaurant['cp'], restaurant['address'], restaurant['city'], restaurant['phone'], restaurant['img'], restaurant['crous_id'], restaurant['lat'], restaurant['lon'], datetime.now()))
                except Exception as e:
                    conn.commit()
                    print(f"[{datetime.now()}] An error occurred while inserting the restaurants into the database: {e}")
                
            # Make the changes to the database persistent
            conn.commit()

def get_restaurants(crous_id):
    """
    Retrieves restaurants from the database based on the provided Crous ID.

    Args:
        crous_id (int): The Crous ID of the restaurants to retrieve.

    Returns:
        list: A list of Restaurant objects representing the retrieved restaurants.
              Returns None if no restaurants are found.

    """
    # Connect to an existing database
    with psycopg.connect(db_connection) as conn:

        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            # get all the existing tables from the database schema
            cur.execute("SELECT id, name, place, schedule, url, cp, address, city, phone, img, \"crousId\", lat, lng FROM public.\"Restaurant\" WHERE \"crousId\" = %s", (crous_id,))
            restaurants = cur.fetchall()
            print(f"[{datetime.now()}] Found {len(restaurants)} restaurants in the database")

            returned_restaurants = [Restaurant(id=restaurant[0], name=restaurant[1], place=restaurant[2], schedule=restaurant[3], url=restaurant[4], cp=restaurant[5], address=restaurant[6], city=restaurant[7], phone=restaurant[8], img=restaurant[9], crous_id=restaurant[10], lat=restaurant[11], lon=restaurant[12]) for restaurant in restaurants]
            print(f"[{datetime.now()}] Successfully retrieved {len(returned_restaurants)} restaurants from the database")
            return returned_restaurants
        
    return None