FROM ollama/ollama

RUN apt update 
RUN apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev -y
RUN wget https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz
RUN tar -xf Python-3.12.0.tgz
RUN cd ./Python-3.12.0/ && ./configure --enable-optimizations
RUN cd ./Python-3.12.0/ && make -j 12
RUN cd ./Python-3.12.0/ && make altinstall

RUN ollama serve & sleep 5 && ollama pull llama3.1
RUN pip3.12 install ollama Flask

WORKDIR /root
COPY app.py .
COPY run.sh .
RUN chmod +x run.sh

EXPOSE 5000

ENTRYPOINT ["/root/run.sh"]