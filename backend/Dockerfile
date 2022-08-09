FROM python:3.9-slim-buster

RUN pip install --upgrade pip poetry

WORKDIR /backend

COPY ./poetry.lock ./pyproject.toml ./

RUN poetry install --no-dev --no-root

COPY . ./

RUN poetry install --no-dev

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "--host", "0.0.0.0", "--port", "8000", "--reload", "fine_ants.app:app"]
