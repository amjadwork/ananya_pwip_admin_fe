pipeline {
  agent {
    label 'export-costing-be-node-agent'
  }

  stages {  
    stage('Take a pull from git') {
      steps {
        ws('/home/ubuntu/export-costing-fe') {
            checkout([$class: 'GitSCM',
            branches: [[name: 'main']],
            doGenerateSubmoduleConfigurations: false,
            extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, parentCredentials: false, recursiveSubmodules: true, reference: '', trackingSubmodules: false]],
            submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: 'export-costing-admin-fe', url: 'https://skswain_pwip:glpat-qd5RFTnbjvLYsmRbND-o@gitlab.com/techpwip/export-costing-fe.git']]
          ])
        }
      }
    }

    stage('install dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('build the project') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy to s3') {
      steps {
        sh 'aws s3 sync /home/ubuntu/export-costing-fe/build s3://pwip-admin-react-app/'
      }
    }
  }
}
