import datetime
import requests
import json
from bs4 import BeautifulSoup as bs
from model.config import Config
from model.meal import Meal, MealType, FoodItem
from utils import parse_date, extract_cp_city, convert_json_to_utf8
import sqlite3 as sql
from model.restaurant import Restaurant

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
    return returnMeals

def getRestaurants(url, headers):
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
        print(f"Failed to retrieve restaurant information. Status code: {response.status_code}")
        return None
    
    soup = bs(response.text, 'html.parser')

    items = soup.find("section", class_="vc_restaurants").find_all("li")

    restaurants = []
    i = 0
    
    for item in items:
        restaurant = Restaurant(id=len(restaurants) + 1, name=item.find("div", class_="restaurant_title").text, place="", url="", cp="", address="", city="", phone="", meals=[], img="", schedule="")
        print(f"Gathering restaurant information from {restaurant.name} {i + 1}/{len(items)}")
        restaurant_place = item.find("span", class_="restaurant_area")
        if restaurant_place is not None:
            restaurant.place = restaurant_place.text
        restaurant_url = item.find("a").get("href")
        if restaurant_url is not None:
            restaurant.url = restaurant_url
        restaurant = getRestaurantDetails(restaurant_url, headers, restaurant)
        if restaurant is not None:
            restaurants.append(restaurant.toJsonObject())
            print(f"Current restaurant count: {len(restaurants)}\n\n")
        i += 1
    
    # write to json file
    with open('restaurants.json', 'w') as f:
        json.dump(restaurants, f, indent=4)

    print(restaurants)

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
        print(f"Failed to retrieve restaurant details for {restaurant.name}. Status code: {response.status_code}")
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
            # the adress look like "51 chemin des Mouilles - 69130 Ecully" or even "7A, avenue Albert Einstein - 69 100 Villeurbanne"
            address = item.find("p").text.strip().split(" - ")
            restaurant.address = address[0].strip()
            # Extract postal code and city from the address
            cp, city = extract_cp_city(" ".join(address[1:]))

            # Assign the extracted postal code and city to your restaurant object
            restaurant.cp = cp
            restaurant.city = city
        else:
            continue

    photo = soup.find("section", class_="infos").find("div", class_="photo")
    if photo is not None:
        restaurant.img = photo.find("img").get("src")
    else:
        restaurant.img = ""

    return restaurant

def getAllMeals(restaurants):
    allMeals = []
    i = 0
    for restaurant in restaurants:
        meals = getMenu(restaurant['url'], restaurant['id'], firefox_headers)
        for meal in meals:
            meal['restaurant'] = restaurant
            allMeals.append(meal)
        i += 1
        print(f"Fetched meals from {restaurant['name']} {i}/{len(restaurants)} ==> found {len(meals)} meals")
    # print(allMeals)
    return allMeals

def compareAndInsertMeals():
    # get the file called meals_old.json
    with open('meals_old.json', 'r') as f:
        oldMeals = json.load(f)

    # get the file called meals_new.json
    with open('meals_new.json', 'r') as f:
        newMeals = json.load(f)

    # delete all meals older than today in oldMeals
    for meal in oldMeals:
        if parse_date(meal['date']) < datetime.now():
            oldMeals.remove(meal)
    
    # delete all meals older than today in newMeals
    for meal in newMeals:
        if parse_date(meal['date']) < datetime.now():
            newMeals.remove(meal)

    # compare the two lists and insert the new meals in the database
    conn, cursor = dbConnection()
    for meal in newMeals:
        if meal not in oldMeals:
            cursor.execute("INSERT INTO Meal (date, title, food_items, meal_type, restaurantId) VALUES (?, ?, ?, ?, ?)", (meal['date'], meal['title'], json.dumps(meal['foodItems']), meal['mealType'], meal['restaurantId']))
            conn.commit()
    conn.close()

    # write the new meals in the old meals file
    with open('meals_old.json', 'w', encoding='utf-8') as f:
        json.dump(newMeals, f, indent=4, ensure_ascii=False)
            
def dbConnection():
    conn = sql.connect('./front/prisma/dev.db')
    cursor = conn.cursor()
    return conn, cursor

if __name__ == '__main__':
    # config = Config.loadConfig()
    # if config is None:
    #     exit(1)

    try:

        with open('restaurants.json     ', 'r') as f:
            restaurants = json.load(f)

        allMeals = getAllMeals(restaurants)

        with open('meals_new.json', 'w', encoding='utf-8') as f:
            json.dump(allMeals, f, indent=4, ensure_ascii=False)

        compareAndInsertMeals()

    except Exception as e:
        #append the error to the log file
        with open('error.log', 'a') as f:
            f.write(f'{str(e)}\n')
        exit(1)

    