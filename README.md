# File Upload Service
Please implement a production grade microservice, in any programming language or framework, to receive a file upload request and store the file and send email notification. Following concerns need to be addressed
1.  Security
2.  Scalability
3.  Testability
4.  API Standard (RESTFul)

## Table of Contents
 - [Tech stack](#TechStack)
 - [Installation](#Installation)
 - [Usage](#Usage)

## TechStack
![architect](architect.png "Architect")
 - **Nodejs** (express) as microservice, for interface upload file, email send
 - **MiniO** as file storage 
 - **Nginx** for load balanceing
 - **Docker, Docker-compose** as container and container orchestration

## Installation
```bash
# Clone the repository 
git clone https://github.com/yourusername/your-project.git 
# Change directory  
cd your-project 
# Install dependencies npm install
npm install
```
## Usage
require [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/) before use
```bash
# to build docker image
docker build -t upload-app . 
# running rest of service with docker compose
docker-compose up -d
```
to access MiniO web console
http://localhost:9090/browser

to send request for upload file
```bash
curl --location 'http://localhost/upload' \
--form 'file=@"/Users/nashzii/Desktop/photo.png"' \
--form 'email="your_email@hotmail.com"'
```