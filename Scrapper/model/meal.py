from enum import Enum

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
    
class Meal:
    def __init__(self, date, title, foodItems: list[FoodItem], mealType: MealType):
        self.title = title
        self.foodItems = foodItems
        self.mealType = mealType

    def __str__(self):
        return f'{self.title}' + '\n' + '\n'.join([f'{foodItem.name} - {foodItem.price}' for foodItem in self.foodItems])
    
    def __repr__(self):
        return f'{self.title}' + '\n' + '\n'.join([f'{foodItem.name} - {foodItem.price}' for foodItem in self.foodItems])
