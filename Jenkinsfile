pipeline {
  agent {
    label 'export-costing-fe-node-agent'
  }

  stages {
    stage('Take a pull from git') {
      steps {
        ws('/custom/workspace/path/export-costing-fe') {
          dir('.') {
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
    }

    stage('install dependencies') {
      steps {
        ws('/custom/workspace/path/export-costing-fe') {
          dir('.') {
            sh 'npm install'
          }
        }
      }
    }

    stage('build the project') {
      steps {
        ws('/custom/workspace/path/export-costing-fe') {
          dir('.') {
            sh 'npm run build'
          }
        }
      }
    }

    stage('Deploy to S3') {
      steps {
        ws('/custom/workspace/path/export-costing-fe') {
          dir('.') {
            sh 'aws s3 sync build/ s3://pwip-admin-react-app/'
          }
        }
      }
    }
  }
}
