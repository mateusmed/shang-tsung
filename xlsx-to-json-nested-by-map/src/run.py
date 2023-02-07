
import pandas as pd
import json
import copy
import re
import xlsx
import build_rule
import dynamic
import files
import sys


## mask, xlsx, json_output

def get_argument(number):
    return sys.argv[number]


def main():

    mask_json = get_argument(1)
    xlsx_input = get_argument(2)
    json_output = get_argument(3)

    json_map = files.read_json(mask_json)
    xlsx_df = files.read_xlsx(xlsx_input)

    obj = xlsx.get_main_obj_and_list_row_mapped(xlsx_df,
                                                json_map)

    list_row_obj = obj["list_row_obj"]
    main_obj = obj["main_obj"]

    rule_map = build_rule.get_rule(json_map)
    dynamic_function_str = dynamic.build_dynamic_function_str(rule_map)

    print(f"=======================")
    print(f"dynamic_function_str --> {dynamic_function_str}")
    print(f"=======================")

    rule_length = len(rule_map)
    print(f"=======================")
    print(f" len =======> {rule_length}")
    print(f"=======================")

    for item_add in list_row_obj:

        main_obj = dynamic.my_eval(main_obj,
                                   item_add,
                                   dynamic_function_str,
                                   rule_length)

    main_obj_str = json.dumps(main_obj, indent=4)

    main_obj_str = main_obj_str.replace("##", "")\
                               .replace("@@", "")

    print(f"=======================")
    print(f"{main_obj_str}")
    print(f"=======================")

    files.write_file(json_output,
                     main_obj_str)


main()
