import csv
import logging
from enum import Enum
from io import StringIO
from typing import Any, Mapping, List

from fastapi import FastAPI, File
from sqlmodel import Session, select
from pydantic import BaseModel

# from .models import Currency, engine

app = FastAPI(title="Fine Ants", description="A personal finance API")


# @app.get("/currency", response_model=List[Currency])
# def get_currencies(_) -> List[Currency]:
#
#     with Session(engine) as session:
#
#         data = session.exec(select(Currency))
#         return list(data)


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


class ImportResponse(BaseModel):
    headers: List[str]
    rows: List[Mapping[str, Any]]


def import_csv(f: bytes) -> ImportResponse:
    document = StringIO(f.decode("utf-8"))
    first_five = [dict(line) for _, line in zip(range(5), csv.DictReader(document))]
    output = ImportResponse(headers=list(first_five[0]), rows=first_five)
    logging.warning("Will be returning: %s", output)
    return output


def import_xls(document: bytes):
    pass


def import_xlsx(document: bytes):
    pass


@app.post("/upload-file", response_model=ImportResponse)
def import_file(upload: bytes = File(...)) -> ImportResponse:
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
        return import_xls(upload)
    elif file_type == FileType.XLSX:
        return import_xlsx(upload)
    else:
        return import_csv(upload)
