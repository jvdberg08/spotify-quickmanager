FROM python:3-alpine
ENV PYTHONUNBUFFERED=1

COPY ./requirements.txt ./django/

WORKDIR ./django

RUN pip install -r requirements.txt