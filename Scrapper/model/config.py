import json
from datetime import datetime

class SupportedCrousModel:
    """
    Represents a supported Crous model.

    Attributes:
        name (str): The name of the Crous model.
        folder_name (str): The folder name of the Crous model.
        url (str): The base URL of the Crous model.
        id (int): The ID of the Crous model.
    """

    def __init__(self, Name: str, BaseUrl: str, id: int):
        self.name = Name
        self.folder_name = Name.lower().replace(' ', '_')
        self.url = BaseUrl
        self.id = id

    def __str__(self):
        return f'{self.name} ({self.url}) ==> {self.folder_name}'

    def __repr__(self):
        return f'{self.name} ({self.url}) ==> {self.folder_name}'

class Config:
    """
    Represents the configuration settings for the application.

    Attributes:
        name (str): The name of the application.
        version (str): The version of the application.
        description (str): A brief description of the application.
        author (str): The author of the application.
        source (str): The source of the application.
        appConfig (dict): The configuration settings for the application.
        supportedCrous (list): A list of supported Crous models.
    """

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
        """
        Loads the configuration from the 'conf.json' file.

        Returns:
            Config or None: The loaded configuration or None if the file is not found.
        """
        try:
            with open('conf.json') as f:
                return Config(**json.load(f))
        except FileNotFoundError as e:
            print(f"[ERROR] [{datetime.now()}] Configuration file not found: {e}")
            return None
        
    def __str__(self):
        """
        Returns a string representation of the Config object.

        Returns:
            str: The string representation of the Config object.
        """
        return f'{self.name} v{self.version} by {self.author}, currently supported Crous: {", ".join([str(crous) for crous in self.supportedCrous])}'
    
    def __repr__(self):
        """
        Returns a string representation of the Config object.

        Returns:
            str: The string representation of the Config object.
        """
        return f'{self.name} v{self.version} by {self.author}'