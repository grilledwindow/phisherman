FROM ollama/ollama

RUN apt update 


# OLLAMA (REUBEN)
RUN apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev curl -y
RUN wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz
RUN tar -xf Python-3.12.0.tgz
RUN cd ./Python-3.12.0/ && ./configure --enable-optimizations
RUN cd ./Python-3.12.0/ && make -j 12
RUN cd ./Python-3.12.0/ && make altinstall

RUN ollama serve & sleep 5 && ollama pull deepseek-r1:14b
RUN pip3.12 install ollama Flask

# backend stuff
WORKDIR /root
COPY backend backend
RUN pip3.12 install -r backend/requirements.txt


# Start file
WORKDIR /root
COPY run.sh .
RUN chmod +x run.sh

ENTRYPOINT ["/root/run.sh"]