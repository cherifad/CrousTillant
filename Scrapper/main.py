import requests
import json
from bs4 import BeautifulSoup as bs
from model.config import Config
from model.meal import Meal, MealType, FoodItem
from utils import parse_date
import sqlite3 as sql

firefox_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

def getMenu(url, headers):
    response = requests.get(url, headers=headers)
    soup = bs(response.text, 'html.parser')
    date = soup.find("time", class_="menu_date_title").text
    print(parse_date(date.replace("Menu du ", "").strip()))

    returnMeals: list[Meal] = []

    meals = soup.find_all("div", class_="meal")
    # print(meals)
    for meal in meals:
        newMeal = Meal(parse_date(date.replace("Menu du ", "").strip()), "", [], MealType.BREAKFAST)
        mealType = meal.find("div", class_="meal_title").text
        if "Petit déjeuner" in mealType:
            mealType = MealType.BREAKFAST
        elif "Déjeuner" in mealType:
            mealType = MealType.LUNCH
        elif "Dîner" in mealType:
            mealType = MealType.DINNER
        else:
            continue

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

            print(f"found {len(newMeal.foodItems)} items for {mealType.name} : {newMeal.title}")
            print(f"List of items:" + '\n'.join([str(foodItem) for foodItem in newMeal.foodItems]) + '\n\n')
        

    return returnMeals

def dbConnection():
    conn = sql.connect('Database\data.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS meals (date TEXT, title TEXT, foodItems TEXT, mealType TEXT)')
    return conn, cursor

if __name__ == '__main__':
    config = Config.loadConfig()
    if config is None:
        exit(1)
    
    # url = config.appConfig['BaseUrl']
    # response = requests.get(url, headers=firefox_headers)
    # soup = bs(response.text, 'html.parser')
    # items = soup.find("section", class_="vc_restaurants").find_all("li")
    # print(items)

    getMenu("https://www.crous-lyon.fr/restaurant/cafeteria-saint-paul/", firefox_headers)