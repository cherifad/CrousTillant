class Restaurant:
    def __init__(self, id, name, place, schedule, url, cp, address, city, phone, img, crous_id, lat=None, lon=None, meals=[]):
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
            'lon': self.lon
        }