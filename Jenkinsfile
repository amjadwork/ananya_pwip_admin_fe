pipeline {
  agent {
    label 'export-costing-be-node-agent'
  }

  stages {
    stage('Take a pull from git') {
      steps {
        dir('/home/ubuntu/export-costing-fe') {
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
        dir('/home/ubuntu/export-costing-fe') {
          sh 'npm install'
        }
      }
    }

    stage('build the project') {
      steps {
        dir('/home/ubuntu/export-costing-fe') {
          sh 'npm run build'
        }
      }
    }

    stage('Deploy to S3') {
      steps {
        dir('/home/ubuntu/export-costing-fe') {
          sh 'aws s3 sync build/ s3://pwip-admin-react-app/'
        }
      }
    }
  }
}
