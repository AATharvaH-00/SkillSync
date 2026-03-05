import traceback
import sys
try:
    import main
    print("Main imported successfully")
except Exception as e:
    with open("crash.txt", "w", encoding="utf-8") as f:
        traceback.print_exc(file=f)
    print("Crash log written to crash.txt")
