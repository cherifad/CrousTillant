from datetime import datetime
import json
import locale
import re

# Parse a date string in French format to a datetime object
# ex: "vendredi 26 avril 2024" -> datetime(2024, 4, 26)
def parse_date(date_string):
    # Set the locale to French for proper parsing of French month names
    locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')

    date = datetime.strptime(date_string, "%A %d %B %Y")

    return date.__str__()

def extract_cp_city(address):
    print(address)
    # Define regex pattern to match postal code and city
    pattern = r'(\b\d{5}\b|\b\d{2}\s?\d{3}\b)[^\w]*([-\w\s\']+)' 

    # Search for matches in the address
    match = re.search(pattern, address, re.UNICODE)

    if match:
        cp = match.group(1).replace(" ", "").strip()
        city = match.group(2).strip()
        return cp, city
    else:
        print("No match found")
        input("Press Enter to continue...")
        return None, None
    
def convert_json_to_utf8(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)