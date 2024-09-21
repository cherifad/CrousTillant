from collections.abc import Iterable
from enum import Enum
import json
from .restaurant import Restaurant

from enum import Enum

class MealType(Enum):
    """
    Enumeration representing different types of meals.
    """

    BREAKFAST = 1
    LUNCH = 2
    DINNER = 3

class FoodItem:
    """
    Represents a food item with a name and price.
    """

    def __init__(self, name, price):
        """
        Initializes a new instance of the FoodItem class.

        Args:
            name (str): The name of the food item.
            price (float): The price of the food item.
        """
        self.name = name
        self.price = price

    def __str__(self):
        """
        Returns a string representation of the FoodItem.

        Returns:
            str: The string representation of the FoodItem.
        """
        return f'{self.name} - {self.price}'
    
    def __repr__(self) -> str:
        """
        Returns a string representation of the FoodItem.

        Returns:
            str: The string representation of the FoodItem.
        """
        return f'{self.name} - {self.price}'
    
    def toJsonObject(self):
        """
        Converts the FoodItem to a JSON object.

        Returns:
            dict: The JSON object representation of the FoodItem.
        """
        return {
            'name': self.name,
            'price': self.price
        }
    
    def __dict__(self):
        """
        Converts the FoodItem to a dictionary.

        Returns:
            dict: The dictionary representation of the FoodItem.
        """
        return {
            'name': self.name,
            'price': self.price
        }
    
class Meal:
    """
    Represents a meal with its properties and methods.
    """

    def __init__(self, date, title, foodItems: list[FoodItem], mealType: MealType, restaurantId, toUpdate=False, toInsert=False, fieldsToUpdate=[]):
        """
        Initializes a new instance of the Meal class.

        Args:
            date (str): The date of the meal.
            title (str): The title of the meal.
            foodItems (list[FoodItem]): The list of food items in the meal.
            mealType (MealType): The type of the meal.
            restaurantId: The ID of the restaurant.
            toUpdate (bool, optional): Indicates if the meal needs to be updated. Defaults to False.
            toInsert (bool, optional): Indicates if the meal needs to be inserted. Defaults to False.
            fieldsToUpdate (list, optional): The list of fields to update. Defaults to an empty list.
        """
        self.title = title
        self.foodItems = foodItems
        self.mealType = mealType
        self.date = date
        self.restaurantId = restaurantId
        self.toUpdate = toUpdate
        self.toInsert = toInsert
        self.fieldsToUpdate = fieldsToUpdate

    def __str__(self):
        """
        Returns a string representation of the meal.

        Returns:
            str: The string representation of the meal.
        """
        return f'{self.title} - {self.date}'
    
    def toJsonObject(self):
        """
        Converts the meal object to a JSON object.

        Returns:
            dict: The JSON object representing the meal.
        """
        return {
            'date': self.date,
            'title': self.title,
            'foodItems': [foodItem.toJsonObject() for foodItem in self.foodItems],
            'mealType': self.mealType.name,
            'restaurantId': self.restaurantId,
            'toUpdate': self.toUpdate,
            'toInsert': self.toInsert,
            'fieldsToUpdate': self.fieldsToUpdate
        }
    
    def __dict__(self):
        """
        Converts the meal object to a dictionary.

        Returns:
            dict: The dictionary representing the meal.
        """
        return {
            'date': self.date,
            'title': self.title,
            'foodItems': [foodItem.__dict__() for foodItem in self.foodItems],
            'mealType': self.mealType.name,
            'restaurantId': self.restaurantId,
            'toUpdate': self.toUpdate,
            'toInsert': self.toInsert,
            'fieldsToUpdate': self.fieldsToUpdate
        }
    
    def to_json(self):
        """
        Converts the meal object to a JSON string.

        Returns:
            str: The JSON string representing the meal.
        """
        return json.dumps(self.__dict__())

