FROM ollama/ollama

RUN ollama pull deepseek-r1:8b

RUN apt update 
RUN apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev
RUN wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz
RUN tar -xf Python-3.12.0.tgz
RUN cd ./Python-3.12.0/ && ./configure --enable-optimizations
RUN cd ./Python-3.12.0/ && make -j 4
RUN cd ./Python-3.12.0/ && make altinstall

WORKDIR /root

RUN pip3.12 install ollama