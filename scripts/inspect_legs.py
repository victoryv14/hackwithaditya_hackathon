import json

with open("scripts/nh7_real_geometry.json") as f:
    segs = json.load(f)

print("Segment 0 start:", segs[0][0])
print("Segment 0 end:", segs[0][-1])
print("Segment 34 end:", segs[-1][-1])
