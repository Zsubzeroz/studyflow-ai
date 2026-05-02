import requests
res = requests.get("http://localhost:8000/stats")
print(res.json())
res = requests.get("http://localhost:8000/cards/revisar")
print(len(res.json()), "cards")
if len(res.json()) > 0:
    print(res.json()[0])
