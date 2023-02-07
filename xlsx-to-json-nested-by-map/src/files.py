
import pandas as pd
import json



## f"C:\dev\workspaceMateus\\focoRun\\z-main\\0-input\\4870.xlsx"
def read_xlsx(path_file):

    df = pd.read_excel(path_file, sheet_name=0, dtype=str)
    return df


def read_json(path_file):

    f = open(path_file, "r")
    return json.loads(f.read())


##  f"C:\dev\workspaceMateus\\focoRun\\z-main\\1-output\\converted.json"
def write_file(path_file, content):

    f = open(path_file, "w")
    f.write(content)
    f.close()
