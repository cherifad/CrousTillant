import os
import requests
import json
from bs4 import BeautifulSoup as bs
from model.meal import Meal, MealType, Restaurant, FoodItem
from utils import parse_date, extract_cp_city_coord
from database import insert_meals, insert_restaurants
import datetime
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

def get_menu(url, restaurantId):
    """
    Retrieves the menu from the specified URL for a given restaurant.

    Args:
        url (str): The URL of the menu page.
        restaurantId (int): The ID of the restaurant.

    Returns:
        list: A list of dictionaries representing the meals in the menu.
    """
    response = requests.get(url, headers=firefox_headers)
    
    if response.status_code != 200:
        print(f"[{datetime.datetime.now()}] Failed to retrieve meals from {url}. Status code: {response.status_code}")
        return []
    
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

def get_restaurants(url, crous_name, crous_id, cur):
    """
    Retrieves restaurant information from a given URL.

    Args:
        url (str): The URL to scrape restaurant information from.
        headers (dict): The headers to be included in the HTTP request.

    Returns:
        Restaurant: The restaurant object containing the scraped information.
    """
    response = requests.get(url, headers=firefox_headers)
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

        restaurant = get_restaurant_details(restaurant_url, restaurant)
        if restaurant is not None:
            restaurants.append(restaurant.toJsonObject())
            print(f"[{datetime.datetime.now()}] Restaurant information gathered successfully.")

        i += 1
    
    # write to json file
    with open(f'./json/{crous_name}/restaurants_{crous_name}.json', 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, indent=4, ensure_ascii=False)

    # insert restaurants into the database
    insert_restaurants(restaurants, cur)

    return restaurants

def get_restaurant_details(url, restaurant: Restaurant):
    """
    Retrieves restaurant details from a given URL.

    Args:
        url (str): The URL to scrape the restaurant details from.
        headers (dict): The headers to be used in the HTTP request.
        restaurant (Restaurant): The restaurant object to store the details.

    Returns:
        Restaurant: The updated restaurant object with the retrieved details.
    """
    response = requests.get(url, headers=firefox_headers)
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

def get_all_meals(restaurants: list[Restaurant], crous_name: str):
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
        meals = get_menu(restaurant.url, restaurant.id)
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

def compare_and_insert_meals(crous_name, cur):
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

    # Remove old meals older than today's date, do not remove today's meals
    print(f"[{datetime.datetime.now()}] Removing old meals older than today...")
    today = datetime.datetime.now()
    oldMeals = [meal for meal in oldMeals if datetime.datetime.strptime(meal['date'], '%Y-%m-%d %H:%M:%S') > today]
    newMeals = [meal for meal in newMeals if datetime.datetime.strptime(meal['date'], '%Y-%m-%d %H:%M:%S') > today]

    print(f"[{datetime.datetime.now()}] Comparing {len(oldMeals)} old meals with {len(newMeals)} new meals...")
    
    newMeals = compare_json_objects(oldMeals, newMeals)

    # Insert all new meals into the database
    insert_meals(newMeals, cur)
    print(f"[{datetime.datetime.now()}] Meals inserted successfully.")


    # Write the updated meals to 'meals_old.json'
    with open(old_meals_file, 'w', encoding='utf-8') as f:
        json.dump(newMeals, f, indent=4, ensure_ascii=False)

def compare_json_objects(oldMeals: list[Meal], newMeals: list[Meal]):
    """
    Compares two arrays of JSON objects and identifies the differences between them.
    
    Args:
        oldMeals (list[Meal]): The old array of Meal objects.
        newMeals (list[Meal]): The new array of Meal objects.
    
    Returns:
        list[Meal]: The updated array of Meal objects with 'toUpdate' and 'toInsert' flags set accordingly.
    """
    # Find the differences between the arrays of JSON objects
    diff = DeepDiff(oldMeals, newMeals, ignore_order=True).to_dict()
    meal_to_update = 0
    meal_to_insert = 0

    # Get the objects that are different and set 'toUpdate' to True (with fieldsToUpdate) or toInsert to True in the new meals list
    for key, change in diff.items():
        if key == 'values_changed':
            # If values have changed, set toUpdate to True and record the changed fields
            for path, details in change.items():
                if path.startswith("root"):
                    # Extract the index of the food item from the path
                    index = int(path.split("[")[1].split("]")[0])
                    # Update the corresponding Meal object
                    newMeals[index]["toUpdate"] = True
                    new_value = details["new_value"]
                    if isinstance(new_value, (str, int, float, bool)):
                        if new_value not in newMeals[index]["fieldsToUpdate"]:
                            newMeals[index]["fieldsToUpdate"].append(new_value)
                    else:
                        if new_value not in newMeals[index]["fieldsToUpdate"]:
                            newMeals[index]["fieldsToUpdate"].append(str(new_value))
                    meal_to_update += 1
        elif key == 'iterable_item_added':
            # If items have been added, set toInsert to True
            for path, details in change.items():
                if path.startswith("root"):                    
                    # check if the path is a Meal object
                    if is_a_meal_object(details):
                        # meal object ==> this case "root[5]": {'date': '2024-05-15 00:00:00', 'title': 'Bar à salade', 'foodItems': [{'name': '4 bases aux choix', 'price': 0}, {'name': '20 ingredients aux choix', 'price': 0}], 'mealType': 'LUNCH', 'restaurantId': 4, 'toUpdate': False, 'toInsert': False, 'fieldsToUpdate': ['foodItems']}
                        meal = Meal(**details)
                        meal.toInsert = True
                        foodItems = []
                        for foodItem in meal.foodItems:
                            foodItems.append(FoodItem(**foodItem).toJsonObject())
                        newMeals.append({
                            'date': meal.date,
                            'title': meal.title,
                            'foodItems': foodItems,
                            'mealType': meal.mealType,
                            'restaurantId': meal.restaurantId,
                            'toUpdate': False,
                            'toInsert': True,
                            'fieldsToUpdate': []
                        })
                        meal_to_insert += 1
                    else:
                        # not a Meal object ==> this case "root[5]['foodItems'][2]": {'name': 'AJOUT', 'price': 9999999}
                        # Extract the index of the food item from the path
                        index = int(path.split("[")[1].split("]")[0])
                        # get the field name
                        field = path.split("]")[1].split("[")[1].split("]")[0]
                        # Update the corresponding Meal object
                        newMeals[index]["toUpdate"] = True
                        newMeals[index]["fieldsToUpdate"].append(field)
                        meal_to_update += 1

    print(f"[{datetime.datetime.now()}] Meals to update: {meal_to_update}, Meals to insert: {meal_to_insert}")
    return newMeals

def is_a_meal_object(data):
    """
    Checks if the given data can be used to create a Meal object.

    Args:
        data (dict): A dictionary containing the data for a meal.

    Returns:
        bool: True if the data can be used to create a Meal object, False otherwise.
    """
    try:
        meal = Meal(**data)
        return True
    except TypeError:
        return False
