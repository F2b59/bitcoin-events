import json
import os


BRANCH = "main"

os.chdir("..")
ROOT_PATH = os.getcwd()
print("[debug] PWD = " + os.getcwd())  # debug


# Download data from the repository

if not (os.path.exists("bitcoin-events/json_data") and os.path.isdir("bitcoin-events/json_data")):
    # Fetch data from Github
    os.system("git clone -n -b " + BRANCH + " --depth=1 --filter=tree:0 https://github.com/F2b59/bitcoin-events.git")
    os.chdir("bitcoin-events")
    print("[debug] PWD = " + os.getcwd())  # debug
    print("[debug] Checking out...")  # debug
    os.system("git sparse-checkout set --no-cone json_data")
    os.system("git checkout")
    os.chdir("json_data")
    print("[debug] PWD = " + os.getcwd())  # debug
else:
    os.chdir("bitcoin-events/json_data")
    print("[debug] PWD = " + os.getcwd())  # debug
    print("[debug] Pulling...")  # debug
    os.system("git pull")


# Preparation

if (os.path.exists("all_data.json")):
    os.rename("all_data.json", "all_data.json.old")

# Aggregate the data into one file 'all_data.json'

aggregated_data = []

for filename in os.listdir():
    if filename.endswith(".json"):
        print("[debug] Adding file: " + filename)  # debug
        with open(filename, 'r') as file_in:
            aggregated_data.extend(json.load(file_in))

with open("all_data.json", 'w') as file_out:
    json.dump(aggregated_data, file_out, indent=2)


# Copy the resulting data to the web server directory

print("[debug] Copying file to the web server directory")  # debug
if (os.path.exists(ROOT_PATH + "/www/all_data.json")):
    os.remove(ROOT_PATH + "/www/all_data.json")
os.system(f'cp {ROOT_PATH}/bitcoin-events/json_data/all_data.json {ROOT_PATH}/www/all_data.json')
