from enum import Enum


class ScrapingStatus(Enum):
    """
    Represents the status of a scraping log.

    Attributes:
        PENDING (str): The scraping log is pending.
        SUCCESS (str): The scraping log was successful.
        ERROR (str): The scraping log encountered an error.
    """

    PENDING = 'pending'
    SUCCESS = 'success'
    ERROR = 'error'

    def __str__(self):
        return self.value

    def __repr__(self):
        return self.value

    @staticmethod
    def from_string(status):
        """
        Returns the scraping status from a string.

        Args:
            status (str): The string representation of the scraping status.

        Returns:
            ScrapingStatus: The scraping status.
        """
        if status == ScrapingStatus.PENDING.value:
            return ScrapingStatus.PENDING
        elif status == ScrapingStatus.SUCCESS.value:
            return ScrapingStatus.SUCCESS
        elif status == ScrapingStatus.ERROR.value:
            return ScrapingStatus.ERROR
        else:
            raise ValueError(f'Invalid scraping status: {status}')

    @staticmethod
    def from_string_or_none(status):
        """
        Returns the scraping status from a string or None if the string is empty.

        Args:
            status (str): The string representation of the scraping status.

        Returns:
            ScrapingStatus: The scraping status or None.
        """
        if status == '':
            return None
        return ScrapingStatus.from_string(status)

    @staticmethod
    def from_string_or_pending(status):
        """
        Returns the scraping status from a string or PENDING if the string is empty.

        Args:
            status (str): The string representation of the scraping status.

        Returns:
            ScrapingStatus: The scraping status or PENDING.
        """
        if status == '':
            return ScrapingStatus.PENDING
        return ScrapingStatus.from_string(status)

    @staticmethod
    def from_string_or_error(status):
        """
        Returns the scraping status from a string or ERROR if the string is empty.

        Args:
            status (str): The string representation of the scraping status.

        Returns:
            ScrapingStatus: The scraping status or ERROR.
        """
        if status == '':
            return ScrapingStatus.ERROR
        return ScrapingStatus.from_string(status)

class ScrapingLog:
    """
    Represents a scraping log.

    Attributes:
        id (int): The unique identifier of the scraping log.
        crous (Crous): The Crous entity associated with the scraping log.
        status (ScrapingStatus): The status of the scraping log.
        error (str): The error message of the scraping log.
        started_at (datetime): The date and time when the scraping log started.
        ended_at (datetime): The date and time when the scraping log ended.
    """

    def __init__(self, id, crous, status: ScrapingStatus, error, started_at, ended_at):
        self.id = id
        self.crous = crous
        self.status = status
        self.error = error
        self.started_at = started_at
        self.ended_at = ended_at

    def __str__(self):
        return f'{self.crous} - {self.status} - {self.error} - {self.started_at} - {self.ended_at}'

    def __repr__(self):
        return f'{self.crous} - {self.status} - {self.error} - {self.started_at} - {self.ended_at}'

    def toJsonObject(self):
        return {
            'id': self.id,
            'crous': self.crous.toJsonObject(),
            'status': self.status,
            'error': self.error,
            'started_at': self.started_at,
            'ended_at': self.ended_at
        }