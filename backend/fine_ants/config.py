import os


def sqlite_db_url():
    file_name = os.getenv("SQLITE_FILE_NAME")
    if not file_name:
        return "sqlite://"  # in memory DB
    return f"sqlite:///{file_name}"
