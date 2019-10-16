FROM python:3.7.3-stretch

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y --no-install-recommends nodejs

COPY server/requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

WORKDIR /app/client
COPY client/package.json /app/client
RUN npm install
COPY client /app/client

WORKDIR /app/server
COPY server /app/server

WORKDIR /app/client
COPY launch.sh /app/client
CMD ["bash", "launch.sh"]
