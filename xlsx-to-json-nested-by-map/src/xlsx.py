
import pandas as pd
import copy
import json
import copy
import re
import files




def get_keys_by_regex(character, json_str):

    found_list = re.findall(f"(?<={character})(.*?)(?=\")", json_str)

    return found_list


def build_row_obj(json_map, row_data):

    character_identify_list = "$$"

    row_obj = copy.deepcopy(json_map)
    json_str = json.dumps(row_obj)
    key_list = get_keys_by_regex("\$\$", json_str)

    for key in key_list:
        json_str = json_str.replace(f"\"{character_identify_list}{key}\"", f"\"{row_data[key]}\"")

    return json.loads(json_str)


def get_list_row_obj_mapped(xlsx_df, json_map):

    df = xlsx_df

    list_row_obj = []

    for i, row in df.iterrows():
        print(f"trabalhando no item {i}")
        row_obj = build_row_obj(json_map, row)
        list_row_obj.append(row_obj)

    return list_row_obj


def get_main_obj_and_list_row_mapped(xlsx_df, json_map):

    list_row_obj = get_list_row_obj_mapped(xlsx_df, json_map)

    main_obj = copy.deepcopy(list_row_obj[0])
    list_row_obj.pop(0)

    obj = { "main_obj": main_obj,
            "list_row_obj" : list_row_obj}

    return obj
