import csv
from fastapi import Request, Response, File
# from django.http import HttpResponse, HttpRequest, HttpResponseNotAllowed, JsonResponse
# from django.core.files import File
from enum import Enum
import logging
from io import StringIO


class FileType(Enum):
    CSV = "csv"
    XLS = "xls"
    XLSX = "xlsx"


def id_file_type(byte_string: bytes) -> FileType:

    byte_string_hex = list(byte_string)

    if byte_string_hex == [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]:
        file_type = FileType.XLS
    elif byte_string_hex[0:4] == [0x50, 0x4B, 0x03, 0x04]:
        file_type = FileType.XLSX
    else:
        file_type = FileType.CSV

    return file_type


def import_csv(stream: bytes):
    document = StringIO(stream.decode("utf-8"))
    first_five = [line for _, line in zip(range(5), csv.DictReader(document))]
    return {"headers": list(first_five[0]), "rows": first_five}


def import_xls(document: bytes):
    pass


def import_xlsx(document: bytes):
    pass


@app.post("/import-file")
def import_file(uploaded: bytes = File(...)) -> Response:
    """
    find where temp path to uploaded file is
    use file utility to check file type
    pass to appropriate file handler
    format json data response to send back to Vue
    :param request:
    :return:
    """
    # TODO: figure out how to reset the pointer
    first_eight_bytes = uploaded[:8]
    file_type = id_file_type(first_eight_bytes)

    if file_type == FileType.XLS:
        return import_xls(uploaded)
    elif file_type == FileType.XLSX:
        return import_xlsx(uploaded)
    else:
        return import_csv(uploaded)
