pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        bat(script: 'sh "cd hcis.react.svc/app/ && git clone https://rafdhi:Bentardulu1@github.com/tigadaya/HCIS-REACT-UI-master.git"', label: 'build')
      }
    }

  }
}