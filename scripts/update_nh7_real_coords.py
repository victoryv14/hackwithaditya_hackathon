import urllib.request
import json
import re

url = 'https://router.project-osrm.org/route/v1/driving/78.3248,30.1335;78.7805,30.2204?overview=full&geometries=geojson'
print("Fetching real NH-7 highway trace from OSRM...")
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 LRSS-App/1.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode())

all_coords = data['routes'][0]['geometry']['coordinates']
total_distance = data['routes'][0]['distance'] / 1000.0
print(f"Total points: {len(all_coords)}, Distance: {total_distance:.2f} km")

with open("src/data/nh7CorridorData.ts", "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r'coordinates:\s*createCoordSegment\([^)]+\)')
matches = pattern.findall(content)
num_segments = len(matches)
print(f"Found {num_segments} coordinate definitions to replace!")

total_pts = len(all_coords)
pts_per_seg = total_pts // num_segments

segment_geometries = []
for i in range(num_segments):
    start_idx = i * pts_per_seg
    end_idx = min((i + 1) * pts_per_seg + 1, total_pts) if i < num_segments - 1 else total_pts
    slice_pts = all_coords[start_idx:end_idx]
    
    # Downsample slice to ~10-14 points if larger
    if len(slice_pts) > 12:
        step = (len(slice_pts) - 1) / 11.0
        sampled = [slice_pts[int(round(j * step))] for j in range(12)]
    else:
        sampled = slice_pts
    
    formatted = [[round(p[0], 5), round(p[1], 5)] for p in sampled]
    segment_geometries.append(formatted)

new_content = content
for i, geom in enumerate(segment_geometries):
    geom_str = f"coordinates: {json.dumps(geom)}"
    new_content = pattern.sub(geom_str, new_content, count=1)

with open("src/data/nh7CorridorData.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"SUCCESS: Successfully replaced all {num_segments} segment coordinates with real NH-7 road centerline!")
