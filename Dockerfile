FROM node:alpine

COPY .dockerfiles/entrypoint.sh /entrypoint.sh

RUN npm install --global remark-cli remark-preset-lint-recommended

ENTRYPOINT ["/entrypoint.sh"]
CMD []
