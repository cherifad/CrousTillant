from datetime import datetime
import locale

month_names_fr_to_en = {
    "janvier": "January",
    "février": "February",
    "mars": "March",
    "avril": "April",
    "mai": "May",
    "juin": "June",
    "juillet": "July",
    "août": "August",
    "septembre": "September",
    "octobre": "October",
    "novembre": "November",
    "décembre": "December"
}

# Parse a date string in French format to a datetime object
# ex: "vendredi 26 avril 2024" -> datetime(2024, 4, 26)
def parse_date(date_string):
    # Set the locale to French for proper parsing of French month names
    locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')

    return datetime.strptime(date_string, "%A %d %B %Y")