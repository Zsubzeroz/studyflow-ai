import requests

with open("test_study.pdf", "rb") as f:
    res = requests.post("http://localhost:8000/upload-pdf", files={"file": f})
    print(res.json())
