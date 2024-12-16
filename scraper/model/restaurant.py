
class Restaurant:
    """
    Represents a restaurant.

    Attributes:
        id (int): The unique identifier of the restaurant.
        name (str): The name of the restaurant.
        place (str): The place where the restaurant is located.
        schedule (str): The schedule of the restaurant.
        url (str): The URL of the restaurant's website.
        cp (str): The postal code of the restaurant.
        address (str): The address of the restaurant.
        city (str): The city where the restaurant is located.
        phone (str): The phone number of the restaurant.
        img (str): The image URL of the restaurant.
        meals (list): The list of meals offered by the restaurant.
        crous_id (str): The CROUS identifier of the restaurant.
        lat (float): The latitude coordinate of the restaurant's location.
        lon (float): The longitude coordinate of the restaurant's location.
    """

    def __init__(self, id, name, place, schedule, url, cp, address, city, phone, img, crous_id, lat=None, lon=None, meals=[], last_scraping_at=None, last_scraping_status=None, last_scraping_error=None):
        self.id = id
        self.name = name
        self.place = place
        self.schedule = schedule
        self.url = url
        self.cp = cp
        self.address = address
        self.city = city
        self.phone = phone
        self.img = img
        self.meals = meals
        self.crous_id = crous_id
        self.lat = lat
        self.lon = lon
        self.last_scraping_at = last_scraping_at
        self.last_scraping_status = last_scraping_status
        self.last_scraping_error = last_scraping_error

    def __str__(self):
        return f'{self.name} - {self.url} - {self.cp} - {self.address} - {self.city} - {self.phone}'

    def __repr__(self):
        return f'{self.name} - {self.url} - {self.cp} - {self.address} - {self.city} - {self.phone}'

    def toJsonObject(self):
        return {
            'id': self.id,
            'name': self.name,
            'place': self.place,
            'schedule': self.schedule,
            'url': self.url,
            'cp': self.cp,
            'address': self.address,
            'city': self.city,
            'phone': self.phone,
            'img': self.img,
            'meals': [meal.toJsonObject() for meal in self.meals],
            'crous_id': self.crous_id,
            'lat': self.lat,
            'lon': self.lon,
            'last_scraping_at': self.last_scraping_at,
            'last_scraping_status': self.last_scraping_status,
            'last_scraping_error': self.last_scraping_error
        }