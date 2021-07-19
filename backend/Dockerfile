FROM python:3.8
RUN pip install pipenv

WORKDIR /code
COPY Pipfile* .
RUN pipenv install --system --deploy --ignore-pipfile

COPY . .

CMD python backend/manage.py runserver

