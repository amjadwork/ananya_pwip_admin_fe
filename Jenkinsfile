pipeline {
  agent {
    node {
      label 'export-costing-be-node-agent'
      customWorkspace '/home/ubuntu/export-costing-fe'
    }
  }

  post {
    success {
      slackSend(
        color: 'good',
        message: 'Admin panel FE Pipeline succeeded!',
        tokenCredentialId: 'slack-ec-stage-channel-notification',
        channel: '#ec-ci-cd-stage-notification',
        attachments: [
          [
            title: 'Pipeline Details',
            color: 'good',
            fields: [
              [
                title: 'Commit',
                value: "Branch: ${env.GIT_BRANCH}, Commit: ${env.GIT_COMMIT}",
                short: false
              ],
              [
                title: 'Pipeline',
                value: "${env.BUILD_URL}",
                short: false
              ]
            ]
          ]
        ]
      )
    }
    failure {
      slackSend(
        color: 'danger',
        message: 'Admin panel FE Pipeline failed!',
        tokenCredentialId: 'slack-ec-stage-channel-notification',
        channel: '#ec-ci-cd-stage-notification',
        attachments: [
          [
            title: 'Pipeline Details',
            color: 'danger',
            fields: [
              [
                title: 'Commit',
                value: "Branch: ${env.GIT_BRANCH}, Commit: ${env.GIT_COMMIT}",
                short: false
              ],
              [
                title: 'Pipeline',
                value: "${env.BUILD_URL}",
                short: false
              ]
            ]
          ]
        ]
      )
    }
  }

  stages {
    stage('Take a pull from git') {
      steps {
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

    stage('install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('build the project') {
      steps {
        sh 'CI=false npm run build'
      }
    }

    stage('Deploy to s3') {
      steps {
        sh 'aws s3 sync build/ s3://pwip-admin-react-app/'
      }
    }

    stage('Copy build/* to /var/www/html') {
      steps {
        sh 'sudo cp -R /home/ubuntu/export-costing-fe/build/* /var/www/html/'
      }
    }

    stage('Remove build folder') {
      steps {
        sh 'sudo rm -rf /home/ubuntu/export-costing-fe/build'
      }
    }

    stage('Remove node_modules folder') {
      steps {
        sh 'sudo rm -rf /home/ubuntu/export-costing-fe/node_modules'
      }
    }
  }
}
