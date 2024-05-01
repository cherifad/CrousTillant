import json

class SupportedCrousModel:
    def __init__(self, Name: str, BaseUrl: str):
        self.name = Name
        self.folder_name = Name.lower().replace(' ', '_')
        self.url = BaseUrl

    def __str__(self):
        return f'{self.name} ({self.url}) ==> {self.folder_name}'

    def __repr__(self):
        return f'{self.name} ({self.url}) ==> {self.folder_name}'

class Config:
    def __init__(self, Name, Version, Description, Author, Source, AppConfig, SupportedCrous):
        self.name = Name
        self.version = Version
        self.description = Description
        self.author = Author
        self.source = Source
        self.appConfig = AppConfig
        self.supportedCrous = [SupportedCrousModel(**crous) for crous in SupportedCrous]

    @staticmethod
    def loadConfig():
        try:
            with open('conf.json') as f:
                return Config(**json.load(f))
        except FileNotFoundError as e:
            print('Config file not found' + str(e))
            return None
        
    def __str__(self):
        return f'{self.name} v{self.version} by {self.author}, currently supported Crous: {", ".join([str(crous) for crous in self.supportedCrous])}'
    
    def __repr__(self):
        return f'{self.name} v{self.version} by {self.author}'