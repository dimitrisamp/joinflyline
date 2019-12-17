import os
import pathlib
import re
from collections import defaultdict
from pprint import pprint

ROOT_DIR = pathlib.Path(__file__).parent
TEMPLATES_DIR = ROOT_DIR / 'apps/home/templates/home/vue'
COMPONENTS_DIR = ROOT_DIR / 'apps/home/static/home/js/vue'

JS_REGEX = re.compile(r"(?P<component_name>\w+) = Vue\.component\(.*?\"(?P<component_name_template>.*)\"", re.DOTALL)
JS_REGEX_TEMPLATE = re.compile(r"template: \"#(?P<template_id>.*)\",")


TEMPLATE_REGEX = re.compile("<script.*id=\"(?P<template_id>vue-.*?-template)\".*>")
OUTPUT_PATH = ROOT_DIR / 'frontend/src/components'


def get_js_data(f):
    component_data = {}
    txt = f.read()
    mo = JS_REGEX.search(txt)
    if mo:
        data = mo.groupdict()
        component_data['component_name'] = data['component_name']
        component_data['name_in_template'] = data['component_name_template']
    mo = JS_REGEX_TEMPLATE.search(txt.strip())
    if mo:
        component_data['template_id'] = mo.groupdict()['template_id']
        return component_data


def clean_template(f):
    for l in f:
        line = l.strip()
        if line.startswith('<script') or line.startswith('</script'):
            continue
        yield l


def get_template_data(f):
    for l in f:
        mo = TEMPLATE_REGEX.match(l.strip())
        if mo:
            return {"template_id": mo.groupdict()["template_id"]}


if __name__ == '__main__':
    js_datas = []
    for o, dirs, files in os.walk(COMPONENTS_DIR):
        for fname in files:
            if fname.endswith('.js'):
                with open(pathlib.Path(o) / fname) as f:
                    data = get_js_data(f)
                    if data:
                        data['filename'] = pathlib.Path(o) / fname
                        js_datas.append(data)
    html_datas = []
    for o, dirs, files in os.walk(TEMPLATES_DIR):
        for fname in files:
            if fname.endswith('.html'):
                with open(pathlib.Path(o) / fname) as f:
                    data = get_template_data(f)
                    if data:
                        data['filename'] = pathlib.Path(o) / fname
                        html_datas.append(data)
    unified = defaultdict(dict)
    for d in js_datas:
        unified[d['template_id']]['js'] = d
    for d in html_datas:
        unified[d['template_id']]['html'] = d
    for d in unified.values():
        filename = OUTPUT_PATH / f"{d['js']['component_name']}.vue"
        with open(filename, 'w') as f:
            f.write('<template>\n')
            f.writelines(clean_template(open(d['html']['filename'])))
            f.write('</template>\n')
            f.write('\n')
            f.write('<script>\n')
            f.writelines(open(d['js']['filename']))
            f.write('</script>\n')
