FROM python:3.10-slim

WORKDIR /get_weather_info_cron

COPY . .

RUN pip install --no-cache-dir requests pika && \
    chmod +x entrypoint.sh

CMD ["bash", "entrypoint.sh"]

