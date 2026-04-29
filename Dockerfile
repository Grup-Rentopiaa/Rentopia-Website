# Tahap 1: Build aplikasi menggunakan Node.js
FROM node:18-alpine AS build
WORKDIR /app

# Menyalin file package.json terlebih dahulu agar install library lebih cepat (caching)
COPY package*.json ./
RUN npm install

# Menyalin seluruh kodingan ke dalam kontainer
COPY . .

# Melakukan build aplikasi (mengubah kodingan React menjadi file statis di folder /dist)
RUN npm run build

# Tahap 2: Menjalankan aplikasi menggunakan Nginx (sangat ringan)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Membuka port 80 (standar web)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]