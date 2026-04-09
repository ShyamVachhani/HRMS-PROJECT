pipeline {
    agent { label 'hrms' }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build') {
            steps {
                dir('/var/www/node-apps/hrms/frontend-hrms') {
                    sh '''
                        sudo -u nodejs npm install
                        sudo -u nodejs npm run build
                    '''
                }
            }
        }

        stage('Restart App') {
            steps {
                sh 'pm2 restart 31'
            }
        }
    }
}
