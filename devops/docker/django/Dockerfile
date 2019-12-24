FROM python:3.7
ARG VUE_PUBLIC_PATH=/static/
ARG VUE_APP_API_ENDPOINT=http://127.0.0.1:8000
ENV VUE_PUBLIC_PATH=${VUE_PUBLIC_PATH}
ENV VUE_APP_API_ENDPOINT=${VUE_APP_API_ENDPOINT}
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client curl bash
RUN curl -s https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
RUN inv build-frontend
EXPOSE 8000

CMD [ "inv", "production-run" ]

