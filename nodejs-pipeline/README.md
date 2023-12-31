# NodeJs DevSecOps Pipeline

## Techstack

- NodeJS
- Docker
- Docker-compose
- Sonarqube - SAST
- Trivy
  - Misconfiguration Check(`trivy config --file /path/to/config.yaml`)
  - Scan local filesystem(`trivy filesystem --dir /path/to/directory`)
  - Scan a container image(`trivy image <image-name>`)
  - Scan rootfs(`trivy rootfs --root /path/to/rootfs`)
- SCA with owasp dependency check 
- NMAP
- Arachni
- OWASP Zap
- Dependency Track


### Steps

1. Create the nodejs application
2. Dockerise the nodejs application
3. Run Sonarqube
4. Integrate Sonarqube
5. Run CICD Tool(Jenkins)
6. 
7. Enable SAST with SonarQube
8. Install Trivy

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

- Create the Dockerfile within the application created with fastify
- Create the docker image `docker build -t nodejsapp .`
- Create the `docker-compose.yml` file
- Run the application

```bash
docker create network nodejs_secops_pipeline
cd secops-pipeline/application/
docker-compose up -d
```

- Open the application [http://localhost:3000/](http://localhost:3000/)

## Run Sonarqube

Website:

- Run Sonarqube as a container with the following command.

```bash
cd nodejs-pipeline/secops-pipeline/sonarqube/
docker-compose up -d
```

- Open the application [http://localhost:9000](http://localhost:9000)
- Default Credentials for sonarqube `user: admin` and `password: admin`

## Integrate application with sonarqube

- Create the `sonar-project.properties`

- Run the scanner to save the quality analysis to sonarqube

```bash
docker run --rm --network nodejs_secops_pipeline -e SONAR_HOST_URL="http://sonarqube:9000" -v /Volumes/project/Docker-X/secops/nodejs-pipeline/secops-pipeline/application:/usr/src sonarsource/sonar-scanner-cli
```
```
docker run --rm --network nodejs_secops_pipeline \
  -e SONAR_HOST_URL="http://sonarqube:9000" \
  -e SONAR_LOGIN="sqp_885c5c8d7f12b7bdff0f19d3a0642d4bd668d40d" \
  -v /Volumes/project/Docker-X/secops/nodejs-pipeline/secops-pipeline/application:/usr/src \
  sonarsource/sonar-scanner-cli

```
- Report to the json 

```bash
docker run --rm --network nodejs_secops_pipeline \
  -e SONAR_HOST_URL="http://sonarqube:9000" \
  -e SONAR_LOGIN="sqp_885c5c8d7f12b7bdff0f19d3a0642d4bd668d40d" \
  -e SONAR_REPORT_EXPORT_PATH="/report/report.json" \
  -v /Volumes/project/Docker-X/secops/nodejs-pipeline/secops-pipeline/application:/usr/src \
  -v /Volumes/project/Docker-X/secops/nodejs-pipeline/secops-pipeline/report:/report \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=application \
  -Dsonar.sources=/usr/src \

```

## Dependency Track - Continuous SBOM Analysis Platform

Website: [https://docs.dependencytrack.org/](https://docs.dependencytrack.org/)

This is needed to save the trivy scan output to save into the a dashboard and
validate with multiple vulnerable databases available on the internet and tracks
the current package used in the project and alerts.

- Run the dependency track with the following

```bash
cd nodejs-pipeline/secops-pipeline/dependency-track/
docker-compose up -d
```

- Application is running on [http://localhost:9002/](http://localhost:9002/)

> Initial start of the api application takes sometime to download the current
> vilnerable dbs from multi data sources.

- Default credentials user: `admin` and password : `admin`, update the password
  just after the initial login.

- Create the project and token for the application to send the vulnerability
  report to the dependency track.

**Create the API key**

- Either add to the existing team or create a team
- Administration -> Access Management -> Teams -> Select team -> API Keys ->
  Click on + button and copy the key and save it for next task.

# Trivy scan for Vulnerability, Misconfiguration, Secret and License

Website:
[https://aquasecurity.github.io/trivy/v0.43/](https://aquasecurity.github.io/trivy/v0.43/)

Read more about
[Scan Coverage of Trivy](https://aquasecurity.github.io/trivy/v0.43/getting-started/coverage/).

## Prerequisites
- Dependency Track API Key and Project ID. 
```bash
API_ENDPOINT="http://localhost:8080/api/v1/"
API_KEY="O7u6AHQoaCViyg1CTu7rSva1rSP16vAm"
```

### Misconfiguration Check

- Scan configurations

```bash
find application -type f -name "*.yml" -exec trivy config {} --format cyclonedx  --output application_config_scan_report.xml \;
```

### Scan local filesystem

Command : `trivy filesystem --dir /path/to/directory`)

```bash
trivy filesystem --format cyclonedx --output application_fs_result.json --scanners vuln  application/

cyclonedx-py -e --in-file application_fs_result.json --output  application_fs_result.xml --format xml

curl -X "POST" "http://localhost:8080/api/v1/bom" \                                                  
     -H 'Content-Type: multipart/form-data' \
     -H "X-Api-Key: O7u6AHQoaCViyg1CTu7rSva1rSP16vAm" \
     -F "project=a059a864-f44c-484f-86ca-d3712438f112" \
      -F "bom=@application_fs_result.xml"
```
### Scan a container image

**Command**: `trivy image <image-name>`

```bash
# Complicated and multi vulnerability image

trivy image --scanners vuln,config,secret --severity HIGH,CRITICAL --format cyclonedx  --output application_config_scan_report.xml vibhuvi-session-ng

cyclonedx-py -e --in-file application_config_scan_report.xml --output  application_config_scan_report_cyclonedx.xml --format xml

curl -X "POST" "http://localhost:8080/api/v1/bom" \
    -H 'Content-Type: multipart/form-data' \
    -H "X-Api-Key: O7u6AHQoaCViyg1CTu7rSva1rSP16vAm" \
    -F "project=50305e82-d257-47d7-aaa1-8e8bc786e29d" \
    -F "bom=@application_config_scan_report_cyclonedx.xml"

# Simple example
trivy image  --format cyclonedx --output application_image_result.json --scanners vuln redis:6.2.7-alpine

cyclonedx-py -e --in-file application_image_result.json --output  application_image_result.xml --format xml

```
### Root Filesystem(rootfs) Scan

> Note : OS level outdated vulnerable libraries, it becomes critical when you have a public facing network with the machine which has outdated libraries.

```bash
trivy rootfs /
```
# SCA Scan 

```bash
sh sca-scan.sh
```

## Run SonaType Nexus

- Run the application as container

```bash
cd nodejs-pipeline/secops-pipeline/sonatype-nexus
docker-compose up -d
```

- Default user credentials user: `admin` passsword: get the password with
  `docker exec -it nexus cat /nexus-data/admin.password`
