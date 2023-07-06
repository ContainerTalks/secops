# NodeJs DevSecOps Pipeline

## Techstack
- NodeJS
- Docker
- Docker-compose
- Sonarqube
- Trivy
    - Sensitive/Secret Data Scan
    - Vulnerability Scan
    - Docker Image Scan
- NMAP
- Arachni
- OWASP Zap
- Dependency Track
- 
### Steps
1. Create the nodejs application
2. Dockerise the nodejs application 
3. Run CICD Tool(Jenkins)
5. 
4. Enable SAST with SonarQube 
4. Install Trivy


# Proof of Implementation

## Prerequisites
- Docker
- Docker Compose 

## Create the nodejs application with fastify

- Install and create the application

```bash
npm install -g fastify
mkdir application && cd application/
npm init fastify -y
```

## Dockerise the nodejs application 

- Create the Dockerfile
```Dockerfile
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```
- Create the docker image
```bash
docker build -t nodejsapp .
```

- Create the `docker-compose.yml` file

```yml

```

## Dependency Track 

#### API Integration

```bash
curl -X "POST" "http://localhost:8081/api/v1/bom" \
     -H 'Content-Type: multipart/form-data' \
     -H "X-Api-Key: Evc5g3oOVGqXtVMJrQKUvCEck81DwHen" \
     -F "autoCreate=true" \
     -F "projectName=SampleAppOne" \
     -F "projectVersion=01.SNAPSHOT" \
     -F "parentName=SampleParent" \
     -F "parentVersion=01.SNAPSHOT" \
     -F "bom=./result.json"
```

