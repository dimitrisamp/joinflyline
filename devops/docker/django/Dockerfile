FROM python:3.7

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client curl bash \
RUN curl -s https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN inv build-frontend
EXPOSE 8000

CMD [ "inv", "production-run" ]

