import urllib.request
import json

waypoints = [
    (78.3245, 30.1340), # Tapovan Rishikesh
    (78.3900, 30.1370), # Shivpuri
    (78.4420, 30.0880), # Byasi
    (78.5020, 30.0760), # Kaudiyala
    (78.5350, 30.1100), # Teen Dhara
    (78.5680, 30.1360), # Totam
    (78.5980, 30.1460), # Devprayag Sangam
    (78.6320, 30.1680), # Rampur Chatti
    (78.6780, 30.2180), # Sirobagarh Chronic Zone
    (78.7050, 30.2220), # Maletha
    (78.7380, 30.2190), # Kirtinagar
    (78.7840, 30.2220)  # Srinagar Garhwal
]

wp_str = ";".join(f"{lng},{lat}" for lng, lat in waypoints)
url = f"https://router.project-osrm.org/route/v1/driving/{wp_str}?overview=full"

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 LRSS/1.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())

for i, leg in enumerate(data["routes"][0]["legs"]):
    print(f"Leg {i} -> {i+1}: {leg['distance']/1000.0:.2f} km, duration {leg['duration']/60.0:.1f} min")
