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
                dir('frontend-hrms') {
                    sh '''
                        sudo -u nodejs npm install
                        sudo -u nodejs npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    cp -r frontend-hrms/dist /var/www/node-apps/hrms/
                    pm2 restart 31
                '''
            }
        }
    }
}
