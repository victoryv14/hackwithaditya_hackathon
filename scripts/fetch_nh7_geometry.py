import urllib.request
import json
import os

# Coordinates along NH-7: Rishikesh Tapovan -> Shivpuri -> Byasi -> Kaudiyala -> Devprayag -> Maletha -> Srinagar
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
url = f"https://router.project-osrm.org/route/v1/driving/{wp_str}?overview=full&geometries=geojson"

print("Querying real road centerline from OSRM...")
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 LRSS-Research/1.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode("utf-8"))

coords = data["routes"][0]["geometry"]["coordinates"]
distance_km = data["routes"][0]["distance"] / 1000.0
print(f"Total road coordinates: {len(coords)}, Total road distance: {distance_km:.2f} km")

# Partition the coordinates into 35 contiguous segments
num_segments = 35
total_pts = len(coords)
pts_per_seg = total_pts // num_segments

segments_coords = []
for i in range(num_segments):
    start_idx = i * pts_per_seg
    end_idx = (i + 1) * pts_per_seg + 1 if i < num_segments - 1 else total_pts
    seg = coords[start_idx:end_idx]
    # Sample down to max 15 points per segment for lightweight rendering
    if len(seg) > 15:
        step = len(seg) / 15.0
        seg = [seg[int(j * step)] for j in range(15)]
    segments_coords.append(seg)

with open("scripts/nh7_real_geometry.json", "w") as f:
    json.dump(segments_coords, f, indent=2)

print(f"Successfully generated {len(segments_coords)} real road segment geometries!")
