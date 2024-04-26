import json

class Config:
    def __init__(self, Name, Version, Description, Author, Source, AppConfig):
        self.name = Name
        self.version = Version
        self.description = Description
        self.author = Author
        self.source = Source
        self.appConfig = AppConfig

    @staticmethod
    def loadConfig():
        try:
            with open('Scrapper\conf.json') as f:
                return Config(**json.load(f))
        except FileNotFoundError as e:
            print('Config file not found' + str(e))
            return None
        
    def __str__(self):
        return f'{self.name} v{self.version} by {self.author}'
    
    def __repr__(self):
        return f'{self.name} v{self.version} by {self.author}'