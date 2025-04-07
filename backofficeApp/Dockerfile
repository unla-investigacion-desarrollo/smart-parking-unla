FROM python:3.9-slim
WORKDIR /app
RUN pip install --upgrade pip
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /srv
ENV FLASK_APP=app
CMD ["python","app.py"]
