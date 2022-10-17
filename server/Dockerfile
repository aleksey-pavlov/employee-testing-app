FROM node:16.17.0-alpine as build
WORKDIR /opt
COPY . ./
RUN npm install
RUN npm run build

FROM node:16.17.0-buster-slim
WORKDIR /opt
RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1 wget
RUN wget https://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient19.3-basiclite-19.3.0.0.0-1.x86_64.rpm
RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.3*.rpm && apt-get -y autoremove && apt-get -y clean

COPY --from=build /opt/dist ./
COPY --from=build /opt/node_modules ./node_modules
CMD [ "node", "/opt/main.js" ]