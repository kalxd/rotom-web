FROM nginx:1.29.0-alpine-perl

COPY dist/rotom-web/browser /var/www
