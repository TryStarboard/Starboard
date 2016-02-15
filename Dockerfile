FROM phusion/passenger-customizable

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential
RUN apt-get install -y python

RUN mkdir /home/app/webapp

ADD package.json /home/app/webapp
ENV NODE_ENV production
WORKDIR /home/app/webapp
RUN npm install

ADD build /home/app/webapp/build
ADD build/server.js /home/app/webapp/build/app.js
ADD config /home/app/webapp/config
ADD template /home/app/webapp/template
ADD public /home/app/webapp/public

# Enable nginx
RUN rm -f /etc/service/nginx/down

ADD docker-artifact/gzip_max.conf /etc/nginx/conf.d/gzip_max.conf
ADD docker-artifact/env.conf /etc/nginx/main.d/env.conf
ADD docker-artifact/passenger.conf /etc/nginx/conf.d/passenger.conf

ADD docker-artifact/webapp.conf /etc/nginx/sites-enabled/webapp.conf
RUN rm /etc/nginx/sites-enabled/default

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
