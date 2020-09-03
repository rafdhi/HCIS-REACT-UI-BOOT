pipeline {
  agent any
  stages {
    stage('Add Repo UI') {
      steps {
        sh 'cd hcis.react.svc/app/ && git clone https://rafdhi:Bentardulu1@github.com/tigadaya/HCIS-REACT-UI-master.git'
      }
    }

    stage('Build Maven') {
      steps {
        sh 'cd hcis.react.svc && mvn clean install package docker:build -DskipTests'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker tag leevy/${IMAGENAME}:latest leevy/${IMAGENAME}:dev-${dt}'
      }
    }

    stage('Push Docker Image') {
      steps {
        echo 'Push Docker image'
        sh 'docker push leevy/${IMAGENAME}:dev-${dt}'
      }
    }

  }
}