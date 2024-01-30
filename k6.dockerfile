FROM grafana/k6:latest
WORKDIR /test
ENV SCRIPT loadTest.js
COPY loadTest.js .
# Override the entry point of the base k6 image
ENTRYPOINT []
CMD ["sh", "-c", "k6 run --out statsd $SCRIPT"]