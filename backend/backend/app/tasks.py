from backend.celery import app
from time import sleep


@app.task
def some_long_task(email):
    sleep(5)
    return f'Отчет успешно отправлен на почту {email}'
