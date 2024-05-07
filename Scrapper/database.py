from datetime import datetime
import json
import psycopg
from model.meal import Meal, FoodItem
from model.restaurant import Restaurant

def insert_meals(meals: list[Meal]):
    # Connect to an existing database
    with psycopg.connect("dbname=smartru user=postgres password=postgres") as conn:
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
    # Connect to an existing database
    with psycopg.connect("dbname=smartru user=postgres password=postgres") as conn:

        # Open a cursor to perform database operations
        with conn.cursor() as cur:
            print(f"[{datetime.now()}] Inserting {len(restaurants)} restaurants into the database")

            for restaurant in restaurants:
                # insert restaurant
                cur.execute(
                    'INSERT INTO public."Restaurant" (name, place, schedule, url, cp, address, city, phone, img, "crousId", lat, lng, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                    (restaurant['name'], restaurant['place'], restaurant['schedule'], restaurant['url'], restaurant['cp'], restaurant['address'], restaurant['city'], restaurant['phone'], restaurant['img'], restaurant['crous_id'], restaurant['lat'], restaurant['lon'], datetime.now()))
            
            # Make the changes to the database persistent
            conn.commit()

def get_restaurants(crous_id):
    # Connect to an existing database
    with psycopg.connect("dbname=smartru user=postgres password=postgres") as conn:

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