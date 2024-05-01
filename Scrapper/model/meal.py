from collections.abc import Iterable
from enum import Enum
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
    
    def toJsonObject(self):
        return {
            'name': self.name,
            'price': self.price
        }
    
class Meal:
    def __init__(self, date, title, foodItems: list[FoodItem], mealType: MealType, restaurantId, toUpdate=False):
        self.title = title
        self.foodItems = foodItems
        self.mealType = mealType
        self.date = date
        self.restaurantId = restaurantId
        self.toUpdate = toUpdate

    def __str__(self):
        return f'{self.title}' + '\n' + '\n'.join([f'{foodItem.name} - {foodItem.price}' for foodItem in self.foodItems])
    
    def __repr__(self):
        return f'{self.title}' + '\n' + '\n'.join([f'{foodItem.name} - {foodItem.price}' for foodItem in self.foodItems])
    
    def toJsonObject(self):
        return {
            'date': self.date,
            'title': self.title,
            'foodItems': [foodItem.toJsonObject() for foodItem in self.foodItems],
            'mealType': self.mealType.name,
            'restaurantId': self.restaurantId,
            'toUpdate': self.toUpdate
        }

