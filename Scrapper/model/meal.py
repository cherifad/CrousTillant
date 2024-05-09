from collections.abc import Iterable
from enum import Enum
import json
from .restaurant import Restaurant

class MealType(Enum):
    BREAKFAST = 1
    LUNCH = 2
    DINNER = 3

class FoodItem:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        return f'{self.name} - {self.price}'
    
    def __repr__(self) -> str:
        return f'{self.name} - {self.price}'
    
    def toJsonObject(self):
        return {
            'name': self.name,
            'price': self.price
        }
    
    def __dict__(self):
        return {
            'name': self.name,
            'price': self.price
        }
    
class Meal:
    def __init__(self, date, title, foodItems: list[FoodItem], mealType: MealType, restaurantId, toUpdate=False, toInsert=False, fieldsToUpdate=[]):
        self.title = title
        self.foodItems = foodItems
        self.mealType = mealType
        self.date = date
        self.restaurantId = restaurantId
        self.toUpdate = toUpdate
        self.toInsert = toInsert
        self.fieldsToUpdate = fieldsToUpdate

    def __str__(self):
        return f'{self.title} - {self.date}'
    
    def toJsonObject(self):
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
        return json.dumps(self.__dict__())

