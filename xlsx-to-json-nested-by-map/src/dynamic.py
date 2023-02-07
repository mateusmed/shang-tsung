


def build_dynamic_function_str(rule_map_list):

    str_rule_list = []

    identify_list = "##"

    for rule_item in rule_map_list:

        str_rule_list.append(f"""\n\ndef dynamic_function_{rule_map_list.index(rule_item)}(document_found, document):\n""")

        for obj in rule_item:

            name_list = obj["name_list"].replace(identify_list, "")
            id_list = obj["id_list"]

            str_rule_list.append(f"""\n\n\tif document_found is not None and \"{identify_list}{name_list}\" in document_found:""")
            str_rule_list.append(f"""\n\t\tlist_{name_list} = document_found[\"{identify_list}{name_list}\"]""")
            str_rule_list.append(f"""\n\t\tdocument = document[\"{identify_list}{name_list}\"][0]""")
            str_rule_list.append(f"""\n\t\tdocument_found = next((doc for doc in list_{name_list}""")
            str_rule_list.append(f""" if""")

            for id in id_list:

                if id_list.index(id) == 0:
                    str_rule_list.append(f""" doc[\"{id}\"] == document[\"{id}\"] """)
                else:
                    str_rule_list.append(f""" and doc[\"{id}\"] == document[\"{id}\"] """)

            str_rule_list.append(f"""), None)\n """)
            str_rule_list.append(f"""\n\t\tif document_found is None:""")
            str_rule_list.append(f"""\n\t\t\tlist_{name_list}.append(document)""")
            # str_rule_list.append(f"""\n\t\t\treturn document_found""")

    return "".join(str_rule_list)


def my_eval(main_obj, obj_add, dynamic_functions_str, number_of_dynamic_functions):

    DYNAMIC_FUNCTIONS = dynamic_functions_str

    document_found = main_obj
    document = obj_add

    exec(DYNAMIC_FUNCTIONS)

    for i in range(number_of_dynamic_functions):
        exec(f"dynamic_function_{i}(document_found, document)")

    # dynamic_function_0(document_found, document)
    # dynamic_function_1(document_found, document)
    # dynamic_function(document_found, document)

    return main_obj