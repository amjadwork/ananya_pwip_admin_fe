pipeline {
  agent {
    label 'export-costing-be-node-agent'
  }

  stages {
    stage('Take a pull from git') {
      steps {
        ws('/home/ubuntu/export-costing-fe') {
          checkout([
            $class: 'GitSCM',
            branches: [[name: 'main']],
            userRemoteConfigs: [[
              credentialsId: 'export-costing-admin-fe',
              url: 'https://skswain_pwip:glpat-qd5RFTnbjvLYsmRbND-o@gitlab.com/techpwip/export-costing-fe.git'
            ]]
          ])
        }
      }
    }

    stage('install dependencies') {
      steps {
        ws('/home/ubuntu/export-costing-fe') {
          sh 'npm install'
        }
      }
    }

    stage('build the project') {
      steps {
        ws('/home/ubuntu/export-costing-fe') {
          sh 'npm run build'
        }
      }
    }

    stage('Deploy to s3') {
      steps {
        ws('/home/ubuntu/export-costing-fe') {
          sh 'aws s3 sync build/ s3://pwip-admin-react-app/'
        }
      }
    }
  }
}
