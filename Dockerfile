FROM oven/bun:1.3.6-alpine

WORKDIR /app

# Copy package.json, bun.lock
COPY package.json bun.lock ./

# Accept license key at build time and scope only to install
ARG CENTRAL_LICENSE_KEY
ENV CENTRAL_LICENSE_KEY=$CENTRAL_LICENSE_KEY
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application using env variables
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "preview", "--host"]
