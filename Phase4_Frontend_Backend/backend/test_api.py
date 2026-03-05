import requests

url = "http://localhost:8000/api/analyze_resume"
data = {"resume_text": "I am a software engineer with 5 years of experience in Python, Django, and machine learning."}

try:
    response = requests.post(url, data=data)
    print("Status Code:", response.status_code)
    import json
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
except Exception as e:
    print("Error:", e)
