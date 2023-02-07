import copy


def build_rule_obj(json_map):

    new_obj = {}

    for key in json_map:

        if "##" in key:
            new_obj["name_list"] = key
            obj_zero = json_map[key][0]

            new_obj["id_list"] = get_id_identify_of_obj(obj_zero)
            new_obj["sub_list"] = get_lists_of_obj(obj_zero)

    return new_obj


def build_list_rules(list_rule, obj):

    rule = build_rule_obj(obj)
    list_rule.append(rule)

    for sub_list_item in rule["sub_list"]:

        obj_deep = {
            sub_list_item: obj[rule["name_list"]][0][sub_list_item]
        }

        build_list_rules(list_rule, obj_deep)



def get_obj_has_sub_list_key(list, name_list):

    return next((item for item in list if name_list in item["sub_list"]), None)


def build_final_rule(list_add, list_rule, rule):

    new_obj = { "name_list": rule["name_list"],
                "id_list": rule["id_list"] }

    list_add.append(new_obj)

    another_item = get_obj_has_sub_list_key(list_rule, rule["name_list"])

    if another_item is not None:
        build_final_rule(list_add, list_rule, another_item)


def get_attributes_of(obj, id_key):

    list_id = []

    for attribute in obj:
        if id_key in attribute:
            list_id.append(attribute)

    return list_id


def get_id_identify_of_obj(obj):
    return get_attributes_of(obj, "@@")


def get_lists_of_obj(obj):
    return get_attributes_of(obj, "##")


def get_rule(json_map):

    list_rule = []
    build_list_rules(list_rule, json_map)

    list_rule_copy = copy.deepcopy(list_rule)
    list_rule_copy.reverse()

    complex_list = []

    for rule_reverse in list_rule_copy:
        final_list_test = []
        build_final_rule(final_list_test, list_rule_copy, rule_reverse)
        final_list_test.reverse()
        complex_list.append(final_list_test)

    complex_list.reverse()

    return complex_list
