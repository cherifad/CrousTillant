import datetime
import os 
import requests
import json
from bs4 import BeautifulSoup as bs
from model.config import Config
from model.meal import Meal, MealType, FoodItem
from utils import parse_date, insert_meals, insert_restaurants, extract_cp_city_coord, get_restaurants
import sqlite3 as sql
from model.restaurant import Restaurant
from deepdiff import DeepDiff

firefox_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

def getMenu(url, restaurantId, headers):
    response = requests.get(url, headers=headers)
    soup = bs(response.text, 'html.parser')

    returnMeals: list[Meal] = []

    print(f"[{datetime.datetime.now()}] Gathering meals from {url}...")

    try:
        meals = soup.find_all("div", class_="meal")
        # print(meals)
        for meal in meals:
            # get parent div
            parent = meal.find_parent("div")
            date = parent.find("time", class_="menu_date_title").text
            newMeal = Meal(parse_date(date.replace("Menu du ", "").strip()), "", [], MealType.BREAKFAST, restaurantId)
            mealType = meal.find("div", class_="meal_title").text
            if "petit déjeuner" in mealType.lower():
                mealType = MealType.BREAKFAST
            elif "déjeuner" in mealType.lower():
                mealType = MealType.LUNCH
            elif "dîner" in mealType.lower():
                mealType = MealType.DINNER
            else:
                continue
            newMeal.mealType = mealType

            foods = meal.find("ul", class_="meal_foodies").find_all("li", recursive=False)
            # print(foods)

            for food in foods:
                title = food.contents[0].text
                newMeal.title = title
                newMeal.foodItems = []
                items = food.find_all("li")
                for item in items:
                    name = item.text.strip()
                    newMeal.foodItems.append(FoodItem(name, 0))
                returnMeals.append(newMeal.toJsonObject())
    except Exception as e:
        print(f"[{datetime.datetime.now()}] Failed to retrieve meals from {url}. {e}")
    
    print(f"[{datetime.datetime.now()}] Meals gathered successfully from {url}.")
    return returnMeals


def getRestaurants(url, crous_name, crous_id, headers):
    """
    Retrieves restaurant information from a given URL.

    Args:
        url (str): The URL to scrape restaurant information from.
        headers (dict): The headers to be included in the HTTP request.

    Returns:
        Restaurant: The restaurant object containing the scraped information.
    """
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"[{datetime.datetime.now()}] Failed to retrieve restaurant information. Status code: {response.status_code}")
        return None
    
    soup = bs(response.text, 'html.parser')

    items = soup.find("section", class_="vc_restaurants").find_all("li")

    restaurants = []
    i = 0
    
    for item in items:
        restaurant = Restaurant(id=len(restaurants) + 1, name=item.find("div", class_="restaurant_title").text, place="", url="", cp="", address="", city="", phone="", meals=[], img="", schedule="", crous_id=crous_id, lat=None, lon=None)
        
        print(f"[{datetime.datetime.now()}] Gathering restaurant information from {restaurant.name} {i + 1}/{len(items)}")

        restaurant_place = item.find("span", class_="restaurant_area")
        if restaurant_place is not None:
            restaurant.place = restaurant_place.text

        restaurant_url = item.find("a").get("href")
        if restaurant_url is not None:
            restaurant.url = restaurant_url

        restaurant = getRestaurantDetails(restaurant_url, headers, restaurant)
        if restaurant is not None:
            restaurants.append(restaurant.toJsonObject())
            print(f"[{datetime.datetime.now()}] Restaurant information gathered successfully.")

        if i == 2:
            break
        i += 1
    
    # write to json file
    with open(f'./json/{crous_name}/restaurants_{crous_name}.json', 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, indent=4, ensure_ascii=False)

    # insert restaurants into the database
    insert_restaurants(restaurants)

    return restaurants

def getRestaurantDetails(url, headers, restaurant: Restaurant):
    """
    Retrieves restaurant details from a given URL.

    Args:
        url (str): The URL to scrape the restaurant details from.
        headers (dict): The headers to be used in the HTTP request.
        restaurant (Restaurant): The restaurant object to store the details.

    Returns:
        Restaurant: The updated restaurant object with the retrieved details.
    """
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        # print(f"Failed to retrieve restaurant details for {restaurant.name}. Status code: {response.status_code}")
        print(f"[{datetime.datetime.now()}] Failed to retrieve restaurant details for {restaurant.name}. Status code: {response.status_code}")
        return None
    
    soup = bs(response.text, 'html.parser')

    items = soup.find("section", class_="infos").find_all("div", class_="info")
    
    for item in items:
        info_title = item.find("div", class_="info_title").text
        if "horaires" in info_title.lower():
            restaurant.schedule = item.find("p").text.strip()
        elif "téléphone" in info_title.lower():
            restaurant.phone = item.find("p").text.strip()
        elif "adresse" in info_title.lower():
            # the adress look like "51 chemin des Mouilles - 69130 Ecully" or even "7A, avenue Albert Einstein - 69 100 Villeurbanne" or "1361 rue des résidences 38400 Saint martin d'heres"
            # juste delete all comma, dash and double space and replace them by a single space, then call the api
            address = item.find("p").text.strip().replace(",", "").replace("-", "").replace("  ", " ")

            cp, city, address_name, coord = extract_cp_city_coord(address)

            if cp is not None and city is not None:
                restaurant.cp = cp
                restaurant.city = city
                restaurant.address = address_name
                restaurant.lat = coord[1]
                restaurant.lon = coord[0]

        else:
            continue

    photo = soup.find("section", class_="infos").find("div", class_="photo")
    if photo is not None:
        restaurant.img = photo.find("img").get("src")
    else:
        restaurant.img = ""

    return restaurant

def getAllMeals(restaurants: list[Restaurant], crous_name: str):
    """
    Retrieves all meals from the given list of restaurants.

    Args:
        restaurants (list): A list of dictionaries representing restaurants.

    Returns:
        list: A list of dictionaries representing all the meals from the given restaurants.
    """
    allMeals = []
    i = 0
    for restaurant in restaurants:
        meals = getMenu(restaurant.url, restaurant.id, firefox_headers)
        for meal in meals:
            allMeals.append(meal)
        i += 1
        print(f"[{datetime.datetime.now()}] Fetched meals from {restaurant.name} {i}/{len(restaurants)} ==> found {len(meals)} meals")

    if len(allMeals) > 0:
        with open(f'./json/{crous_name}/meals_new.json', 'w', encoding='utf-8') as f:
            json.dump(allMeals, f, indent=4, ensure_ascii=False)
    else:
        print(f"[{datetime.datetime.now()}] No meals found.")
        # throw an exception if no meals are found to stop the process
        raise Exception("No meals found.")
    
    return allMeals

def compareAndInsertMeals(crous_name):
    """
    Compare meals between 'meals_old.json' and 'meals_new.json', and insert any new meals into the database.
    If 'meals_old.json' doesn't exist, it directly inserts all meals from 'meals_new.json' into the database.

    Args:
        crous_name (str): Name of the crous.

    Returns:
        None
    """
    print(f"[{datetime.datetime.now()}] Comparing and inserting meals...")

    # Check if 'meals_old.json' exists
    old_meals_file = f'./json/{crous_name}/meals_old.json'
    if os.path.exists(old_meals_file):
        # Load old meals from file
        with open(old_meals_file, 'r', encoding='utf-8') as f:
            oldMeals = json.load(f)
        print(f"[{datetime.datetime.now()}] Meals in the old file: {len(oldMeals)}")
    else:
        print(f"[{datetime.datetime.now()}] 'meals_old.json' file does not exist. Creating it...")
        # Create 'meals_old.json' and initialize it with an empty list
        with open(old_meals_file, 'w', encoding='utf-8') as f:
            f.write("[]")
        oldMeals = []

    # Load new meals from file
    with open(f'./json/{crous_name}/meals_new.json', 'r', encoding='utf-8') as f:
        newMeals = json.load(f)
    print(f"[{datetime.datetime.now()}] Meals in the new file: {len(newMeals)}")

    # Remove old meals older than today's date
    today = datetime.datetime.now()
    oldMeals = [meal for meal in oldMeals if datetime.datetime.strptime(meal['date'], '%Y-%m-%d %H:%M:%S') >= today]
    print(f"[{datetime.datetime.now()}] Removing old meals older than today...")

    print(f"[{datetime.datetime.now()}] Comparing {len(oldMeals)} old meals with {len(newMeals)} new meals...")
    
    diff = compare_json_objects(oldMeals, newMeals)

    if diff:
        print(f"[{datetime.datetime.now()}] Found {len(diff)} differences between the old and new meals.")
        # Set 'toUpdate' to True for meals with differences
        for d in diff:
            for meal in newMeals:
                if d['date'] == meal['date'] and d['title'] == meal['title'] and d['restaurantId'] == meal['restaurantId']:
                    meal['toUpdate'] = True

    # Insert all new meals into the database
    insert_meals(newMeals)
    print(f"[{datetime.datetime.now()}] Meals inserted successfully.")

    # Write the updated meals to 'meals_old.json'
    with open(old_meals_file, 'w', encoding='utf-8') as f:
        json.dump(newMeals, f, indent=4, ensure_ascii=False)

def compare_json_objects(obj1, obj2):
    # Find the differences between the arrays of JSON objects
    diff = DeepDiff(obj1, obj2, ignore_order=True)
    print(diff)
    input()
    different_objects = []
    # Check if there are any differences in the items
    if 'iterable_item_added' in diff:
        for item in diff['iterable_item_added']:
            different_objects.append(item['value'])

    return different_objects

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
            print(f"[{datetime.datetime.now()}] Starting the scrapping process...")
            # if a folder with the crous name does not exist, create it and fetch the data, fetch the date if the folder exists but is empty
            if not os.path.exists(f'./json/{supported_crous.folder_name}') or len(os.listdir(f'./json/{supported_crous.folder_name}')) == 0:
                if not os.path.exists(f'./json/{supported_crous.folder_name}'):
                    os.makedirs(f'./json/{supported_crous.folder_name}')
                    print(f"[{datetime.datetime.now()}] Created folder for {supported_crous} in the 'json' directory.")


                #################### Restaurants scrapping ####################
                # get the restaurants from the crous website
                # print(f"[{datetime.datetime.now()}] Starting the restaurants scrapping process for {supported_crous.name}...")
                # getRestaurants(supported_crous.url, supported_crous.folder_name, supported_crous.id, firefox_headers)
                # print(f"[{datetime.datetime.now()}] Restaurants scrapping process completed successfully for {supported_crous.name}.")
                #################### Restaurants scrapping ####################\

            ####################### Meals scrapping #######################
            # get all the meals from the restaurants
            print(f"[{datetime.datetime.now()}] Scrapping meals from {supported_crous.name}...")
            # restaurants = get_restaurants(supported_crous.id) # json.load(open(f'./json/{supported_crous.folder_name}/restaurants_{supported_crous.folder_name}.json'))
            # getAllMeals(restaurants, supported_crous.folder_name)

            # compare and insert the meals into the database
            compareAndInsertMeals(supported_crous.folder_name)
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

    