import logging

import logging

class Logger:
    """
    A class for logging messages to a file.

    Args:
        log_file (str): The path to the log file.

    Attributes:
        log_file (str): The path to the log file.
        logger (logging.Logger): The logger object.

    """

    def __init__(self, log_file):
        self.log_file = log_file
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def log(self, message):
        """
        Logs a message to the log file.

        Args:
            message (str): The message to be logged.

        """
        self.logger.debug(message)