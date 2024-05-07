from datetime import datetime
import json
import locale
import requests
import urllib.parse


# Parse a date string in French format to a datetime object
# ex: "vendredi 26 avril 2024" -> datetime(2024, 4, 26)
def parse_date(date_string):
    # Set the locale to French for proper parsing of French month names
    locale.setlocale(locale.LC_TIME, 'fr_FR.UTF-8')

    date = datetime.strptime(date_string, "%A %d %B %Y")

    return date.__str__()

def extract_cp_city_coord(address):
    if address is None or address == "":
        print(f"[{datetime.now()}] Address is empty, cannot extract postal code and city")
        return None, None
    
    print(f"[{datetime.now()}] Extracting postal code and city from address: {address}")
    # Define regex pattern to match postal code and city
    
    api_call = f"https://api-adresse.data.gouv.fr/search/?q={urllib.parse.quote(address)}&limit=1"
    response = requests.get(api_call)
    response_json = json.loads(response.text)

    if response_json['features']:
        postal_code = response_json['features'][0]['properties']['postcode']
        city = response_json['features'][0]['properties']['city']
        coord = response_json['features'][0]['geometry']['coordinates']
        address = response_json['features'][0]['properties']['name']
        print(f"[{datetime.now()}] Postal code: {postal_code}, City: {city}, Coordinates: {coord}")
        return postal_code, city, address, coord
    else:
        print(f"[{datetime.now()}] No postal code or city found")
        return None, None, None
    
def convert_json_to_utf8(json_file):
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)